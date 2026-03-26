/* ═══════════════════════════════════════════════════════════════
   STUDIO.JS — AI Creation Studio, Template Library, Mockups
   ═══════════════════════════════════════════════════════════════ */

const StudioMgr = {
  initialized: false,

  init() {
    if (!this.initialized) {
      this.initialized = true;
      this.setupStudio();
    }
    this.renderTemplates();
    this.renderStudioMockups();
  },

  setupStudio() {
    // Studio image upload
    const imgInput = $('#studio-img-input');
    if (imgInput) {
      imgInput.addEventListener('change', (e) => {
        const zone = $('#studio-inspiration-zone');
        const preview = document.createElement('div');
        preview.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px';
        Array.from(e.target.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = ev => {
            const img = document.createElement('img');
            img.src = ev.target.result;
            img.style.cssText = 'width:70px;height:70px;object-fit:cover;border-radius:6px;border:2px solid var(--blush-200)';
            preview.appendChild(img);
          };
          reader.readAsDataURL(file);
        });
        zone.appendChild(preview);
        imgInput.value = '';
      });
    }

    // Generate button
    const genBtn = $('#generate-btn');
    if (genBtn) {
      genBtn.addEventListener('click', () => this.simulateGeneration());
    }
  },

  renderTemplates() {
    const grid = $('#template-list');
    if (!grid) return;
    grid.innerHTML = '';

    LCS.studioTemplates.forEach(template => {
      const card = document.createElement('div');
      card.className = `template-card${LCS.state.studioTemplate?.id === template.id ? ' selected' : ''}`;
      card.dataset.templateId = template.id;
      card.innerHTML = `
        <span class="template-card-icon">${template.icon}</span>
        <div class="template-card-name">${template.name}</div>
        <div class="template-card-items">${template.items}</div>
        <span class="template-card-badge">${template.badge}</span>
      `;

      card.addEventListener('click', () => {
        LCS.state.studioTemplate = template;
        $$('.template-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Fill default prompt
        const promptEl = $('#studio-prompt');
        if (promptEl) {
          promptEl.value = template.prompt;
          promptEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showToast(`Template "${template.name}" selected ✨`, 'success', 1800);
      });

      grid.appendChild(card);
    });
  },

  simulateGeneration() {
    if (!LCS.state.studioTemplate) {
      showToast('Please select a template first', 'error');
      return;
    }

    const btn = $('#generate-btn');
    const resultEl = $('#generation-result');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Collection';

      const t = LCS.state.studioTemplate;
      const promptEl = $('#studio-prompt');
      const promptText = promptEl?.value || t.prompt;

      resultEl.classList.add('visible');
      resultEl.innerHTML = `
        <div style="border-left:3px solid var(--accent);padding-left:14px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <i class="fas fa-check-circle" style="color:#2e7d32;font-size:1.2rem"></i>
            <strong style="color:var(--warm-700)">Collection Generated Successfully!</strong>
          </div>
          <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:10px">
            <strong>Template:</strong> ${t.name} &nbsp;|&nbsp; <strong>Pieces:</strong> ${t.badge}
          </div>
          <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px;font-style:italic">"${promptText.substr(0, 120)}..."</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn-primary btn-sm" id="gen-save-btn">
              <i class="fas fa-plus"></i> Add to My Collections
            </button>
            <button class="btn-secondary btn-sm">
              <i class="fas fa-redo"></i> Regenerate
            </button>
            <button class="btn-secondary btn-sm">
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      `;

      // Save to collections
      resultEl.querySelector('#gen-save-btn').addEventListener('click', () => {
        const colName = t.name + ' — ' + new Date().toLocaleDateString();
        const newCol = {
          id: LCS.generateId(),
          name: colName,
          size: '12x12',
          type: 'Digital',
          status: 'In Progress',
          tags: ['ai-generated', t.name.toLowerCase().replace(/\s/g, '-')],
          palette: ['#F2B4C0','#EACBC0','#D4A5A5','#B8936A','#7A6055'],
          coverColor: '#F2B4C0',
          coverImage: null,
          patternImage: null,
          patternScale: 1,
          patternOpacity: 0.18,
          notes: '',
          quickNotes: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          components: this.parseTemplateComponents(t),
        };
        LCS.collections.unshift(newCol);
        LCS.save();
        showToast(`"${colName}" added to Collections!`, 'success');
        setTimeout(() => switchSection('collections'), 1500);
      });

      showToast('Collection generated! Review and save to your library', 'success', 4000);
    }, 2500);
  },

  parseTemplateComponents(template) {
    // Parse the template items string into components
    const components = [];
    const parseMap = {
      'pattern papers': { type: 'pattern-papers', label: 'Pattern Papers', icon: 'fas fa-th' },
      'sticker sheets': { type: 'sticker-sheets', label: 'Sticker Sheets', icon: 'fas fa-star' },
      'ephemera':       { type: 'ephemera',        label: 'Ephemera',       icon: 'fas fa-scissors' },
      'journaling cards': { type: 'journaling-cards', label: 'Journaling Cards', icon: 'fas fa-sticky-note' },
      'tags':           { type: 'tags',            label: 'Tags',           icon: 'fas fa-tag' },
      'foiled layer':   { type: 'foiled-layers',   label: 'Foiled Layers',  icon: 'fas fa-star-of-life' },
      'die cut':        { type: 'die-cuts',         label: 'Die Cuts',       icon: 'fas fa-cut' },
      'border':         { type: 'borders',          label: 'Borders & Strips', icon: 'fas fa-minus' },
      'pocket':         { type: 'journaling-cards', label: 'Pocket Cards',   icon: 'fas fa-sticky-note' },
    };

    const items = template.items.split(',').map(s => s.trim().toLowerCase());
    items.forEach(item => {
      const match = Object.entries(parseMap).find(([key]) => item.includes(key));
      if (match) {
        const count = parseInt(item) || 0;
        components.push({
          id: LCS.generateId(),
          ...match[1],
          count,
          items: []
        });
      }
    });

    return components.length ? components : [
      { id: LCS.generateId(), type: 'pattern-papers', label: 'Pattern Papers', count: 6,  items: [], icon: 'fas fa-th' },
      { id: LCS.generateId(), type: 'sticker-sheets', label: 'Sticker Sheets', count: 2,  items: [], icon: 'fas fa-star' },
      { id: LCS.generateId(), type: 'ephemera',       label: 'Ephemera',       count: 4,  items: [], icon: 'fas fa-scissors' },
    ];
  },

  renderStudioMockups() {
    const grid = $('#studio-mockup-grid');
    if (!grid) return;
    grid.innerHTML = '';

    LCS.mockupTemplates.slice(0, 6).forEach(mockup => {
      const item = document.createElement('div');
      item.className = 'mockup-item';
      item.style.background = mockup.bg;
      item.style.minHeight = '130px';
      item.innerHTML = `
        <div style="text-align:center;color:var(--text-muted);font-size:0.75rem;padding:16px">
          <i class="fas fa-image" style="font-size:1.8rem;display:block;margin-bottom:8px;opacity:0.35"></i>
          ${mockup.label}
        </div>
        <div class="mockup-label">${mockup.label}</div>
      `;
      item.addEventListener('click', () => {
        showToast(`Selected mockup: ${mockup.label}`, 'info', 2000);
        item.style.border = '2.5px solid var(--accent)';
      });
      grid.appendChild(item);
    });

    // View all button
    const viewAll = document.createElement('div');
    viewAll.className = 'mockup-item';
    viewAll.style.cssText = `background:var(--blush-100);border:2px dashed var(--blush-200);cursor:pointer;min-height:130px`;
    viewAll.innerHTML = `<div style="text-align:center;font-size:0.8rem;color:var(--text-muted)"><i class="fas fa-plus" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:0.4"></i>View All ${LCS.mockupTemplates.length} Mockups</div>`;
    viewAll.addEventListener('click', () => {
      const remaining = LCS.mockupTemplates.slice(6);
      remaining.forEach(mockup => {
        const item = document.createElement('div');
        item.className = 'mockup-item';
        item.style.background = mockup.bg;
        item.style.minHeight = '130px';
        item.innerHTML = `
          <div style="text-align:center;color:var(--text-muted);font-size:0.75rem;padding:16px">
            <i class="fas fa-image" style="font-size:1.8rem;display:block;margin-bottom:8px;opacity:0.35"></i>
            ${mockup.label}
          </div>
          <div class="mockup-label">${mockup.label}</div>
        `;
        grid.insertBefore(item, viewAll);
      });
      viewAll.remove();
    });
    grid.appendChild(viewAll);
  }
};
