/* ═══════════════════════════════════════════════════════════════
   UNZIP3D.JS — 3D Object to 2D Template Generator
   ═══════════════════════════════════════════════════════════════ */

const Unzip3DMgr = {
  initialized: false,
  currentPhoto: null,
  activeTab: 'illustration',

  init() {
    if (!this.initialized) {
      this.initialized = true;
      this.setup();
    }
    this.renderSavedProjects();
  },

  setup() {
    // Upload zone
    const dropZone = $('#unzip-drop-zone');
    const fileInput = $('#unzip-file-input');
    const uploadBtn = $('#unzip-upload-btn');

    uploadBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
    dropZone?.addEventListener('click', () => fileInput.click());

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files[0]) this.loadPhoto(e.target.files[0]);
    });

    // Drag & Drop on the zone
    dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--rose-gold)'; });
    dropZone?.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
    dropZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files[0]) this.loadPhoto(files[0]);
    });

    // Change photo button
    $('#unzip-change-btn')?.addEventListener('click', () => {
      this.currentPhoto = null;
      $('#unzip-preview').style.display = 'none';
      $('#unzip-drop-zone').style.display = 'flex';
      $('#unzip-object-info').style.display = 'none';
      $('#unzip-results').style.display = 'none';
      $('#unzip-output-placeholder').style.display = 'flex';
    });

    // Generate button
    $('#unzip-generate-btn')?.addEventListener('click', () => this.generateTemplates());

    // Tab buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('unzip-tab') && e.target.closest('#unzip-results')) {
        this.switchUnzipTab(e.target.dataset.tab);
      }
    });
  },

  loadPhoto(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentPhoto = e.target.result;
      const preview = $('#unzip-preview');
      const previewImg = $('#unzip-preview-img');
      const dropZone = $('#unzip-drop-zone');
      const objInfo = $('#unzip-object-info');

      previewImg.src = this.currentPhoto;
      preview.style.display = 'block';
      dropZone.style.display = 'none';
      objInfo.style.display = 'flex';

      showToast('Photo loaded — fill in details and generate', 'success');
    };
    reader.readAsDataURL(file);
  },

  generateTemplates() {
    const type = $('#unzip-type')?.value?.trim() || '3D Object';
    const dims = $('#unzip-dims')?.value?.trim() || '';
    const notes = $('#unzip-notes')?.value?.trim() || '';

    if (!this.currentPhoto) {
      showToast('Please upload a photo first', 'error');
      return;
    }

    const btn = $('#unzip-generate-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-magic"></i> Generate Templates';

      // Create unzip project
      const project = {
        id: LCS.generateId(),
        name: type,
        dimensions: dims,
        notes,
        photo: this.currentPhoto,
        createdAt: Date.now(),
        generatedCode: 'GEN-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      };

      LCS.state.unzip3dProject = project;
      LCS.unzipProjects.unshift(project);
      LCS.save();

      $('#unzip-output-placeholder').style.display = 'none';
      $('#unzip-results').style.display = 'block';

      this.switchUnzipTab('illustration');
      this.renderSavedProjects();
      showToast(`"${type}" templates generated!`, 'success', 3000);
    }, 2800);
  },

  switchUnzipTab(tabId) {
    this.activeTab = tabId;
    $$('.unzip-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));

    const content = $('#unzip-tab-content');
    if (!content) return;

    const project = LCS.state.unzip3dProject;
    const name = project?.name || '3D Object';
    const dims = project?.dimensions || 'Standard size';

    const tabContent = {
      illustration: `
        <div style="text-align:center;padding:16px">
          <div style="width:200px;height:200px;background:linear-gradient(135deg,var(--blush-100),var(--rose-light));border-radius:12px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--blush-200)">
            <div style="text-align:center;color:var(--rose-dark)">
              <i class="fas fa-tshirt" style="font-size:4rem;opacity:0.4"></i>
              <div style="font-size:0.75rem;margin-top:8px;font-weight:700">Fashion Illustration</div>
              <div style="font-size:0.7rem;color:var(--text-muted)">${name}</div>
            </div>
          </div>
          <p style="font-size:0.85rem;color:var(--text-secondary)">Stylized fashion illustration showing the finished ${name} with suggested materials and colors applied.</p>
        </div>
      `,
      dieline: `
        <div style="padding:12px">
          <div style="background:var(--blush-50);border:1.5px dashed var(--blush-300);border-radius:8px;padding:20px;text-align:center;margin-bottom:12px">
            <i class="fas fa-vector-square" style="font-size:3rem;color:var(--blush-300);margin-bottom:10px;display:block"></i>
            <div style="font-size:0.85rem;font-weight:700;margin-bottom:6px">2D Die Line Template</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${name} · ${dims}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.8rem">
            <div style="background:var(--blush-100);padding:10px;border-radius:6px">
              <strong>Main Body</strong><br>
              <span style="color:var(--text-muted)">Cut line: solid</span>
            </div>
            <div style="background:#FFF3E0;padding:10px;border-radius:6px">
              <strong>Score Lines</strong><br>
              <span style="color:var(--text-muted)">Fold line: dashed</span>
            </div>
            <div style="background:#E8F5E9;padding:10px;border-radius:6px">
              <strong>Glue Flaps</strong><br>
              <span style="color:var(--text-muted)">Marked in green</span>
            </div>
            <div style="background:#E3F2FD;padding:10px;border-radius:6px">
              <strong>Hardware Holes</strong><br>
              <span style="color:var(--text-muted)">D-rings, snaps</span>
            </div>
          </div>
        </div>
      `,
      svg: `
        <div style="padding:12px">
          <div style="background:#f9f9f9;border:1.5px solid var(--border-color);border-radius:8px;padding:20px;text-align:center;margin-bottom:12px;font-family:monospace">
            <div style="color:#888;font-size:0.75rem;text-align:left;line-height:1.8">
              &lt;svg width="100%" viewBox="0 0 500 400"&gt;<br>
              &nbsp;&nbsp;&lt;!-- ${name} SVG Die Line --&gt;<br>
              &nbsp;&nbsp;&lt;g id="cut-lines" stroke="#000" fill="none"&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;rect x="50" y="50" width="400" height="300" /&gt;<br>
              &nbsp;&nbsp;&lt;/g&gt;<br>
              &nbsp;&nbsp;&lt;g id="score-lines" stroke="#999" stroke-dasharray="5,3"&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;line x1="50" y1="200" x2="450" y2="200" /&gt;<br>
              &nbsp;&nbsp;&lt;/g&gt;<br>
              &lt;/svg&gt;
            </div>
          </div>
          <p style="font-size:0.8rem;color:var(--text-secondary)">Clean SVG template ready for Cricut, Silhouette, or other cutting machines. Includes separate layers for cut and score lines.</p>
          <button class="btn-secondary btn-sm" onclick="showToast('Copying SVG code...','info',1500)"><i class="fas fa-copy"></i> Copy SVG Code</button>
        </div>
      `,
      materials: `
        <div style="padding:12px">
          <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:12px;color:var(--warm-600)">Materials List — ${name}</h4>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${[
              { item: 'Cardstock / Fabric', qty: '1/4 yard or 4 sheets', note: 'Main body material' },
              { item: 'D-Rings (1")',        qty: '4 pieces',             note: 'For straps' },
              { item: 'Magnetic Snap',       qty: '1 set',                note: 'Closure' },
              { item: 'Adhesive / Glue',     qty: '1 stick or bottle',    note: 'Assembly' },
              { item: 'Ribbon / Twine',      qty: '12 inches',            note: 'Optional accent' },
              { item: 'Clear Acetate',       qty: '1 sheet (optional)',   note: 'For window pockets' },
            ].map(m => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--card-bg);border:1.5px solid var(--border-color);border-radius:6px">
                <i class="fas fa-check-circle" style="color:var(--accent);font-size:0.85rem;flex-shrink:0"></i>
                <div style="flex:1">
                  <strong style="font-size:0.82rem">${m.item}</strong>
                  <span style="color:var(--text-muted);font-size:0.75rem;margin-left:8px">${m.note}</span>
                </div>
                <span style="font-size:0.78rem;color:var(--text-secondary);font-weight:700">${m.qty}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      instructions: `
        <div style="padding:12px">
          <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:12px;color:var(--warm-600)">Assembly Instructions — ${name}</h4>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${[
              'Print and cut die line template along solid cut lines.',
              'Score all dashed fold lines with a bone folder.',
              'Fold and crease all score lines firmly.',
              'Apply adhesive to glue flaps (marked in green on template).',
              'Attach hardware (D-rings, snaps) at marked hardware points.',
              'Assemble body by joining glue flap sections.',
              'Add ribbon or closure elements.',
              'Let dry fully before using (approx. 30 minutes).',
            ].map((step, i) => `
              <div style="display:flex;gap:12px;align-items:flex-start">
                <div style="width:24px;height:24px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;margin-top:2px">${i+1}</div>
                <p style="font-size:0.85rem;color:var(--text-primary);line-height:1.5;margin:0">${step}</p>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:14px;padding:10px;background:var(--blush-50);border-radius:6px;font-size:0.78rem;color:var(--text-secondary)">
            <i class="fas fa-lightbulb" style="color:var(--accent);margin-right:6px"></i>
            <strong>Generating Code:</strong> ${project?.generatedCode || 'N/A'} — Save this code to recreate this template style.
          </div>
        </div>
      `,
    };

    content.innerHTML = tabContent[tabId] || `<p>Tab content for ${tabId}</p>`;
  },

  renderSavedProjects() {
    const grid = $('#unzip-saved-grid');
    if (!grid) return;

    if (LCS.unzipProjects.length === 0) {
      grid.innerHTML = `
        <div style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:24px;grid-column:1/-1">
          <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:8px;opacity:0.3"></i>
          No unzip projects yet. Upload a 3D object photo to get started!
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    LCS.unzipProjects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'collection-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="card-cover" style="height:100px">
          ${project.photo
            ? `<img src="${project.photo}" alt="${project.name}" style="width:100%;height:100%;object-fit:cover" />`
            : `<div style="width:100%;height:100%;background:var(--blush-100);display:flex;align-items:center;justify-content:center">
                 <i class="fas fa-box-open" style="font-size:2rem;color:var(--blush-300)"></i>
               </div>`
          }
        </div>
        <div class="card-body" style="padding:10px">
          <div class="card-name">${project.name}</div>
          <div class="card-meta" style="font-size:0.72rem">${LCS.formatDate(project.createdAt)}</div>
          <div style="font-size:0.68rem;color:var(--text-muted);margin-top:4px;font-weight:700">Code: ${project.generatedCode}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        LCS.state.unzip3dProject = project;
        if (project.photo) {
          this.currentPhoto = project.photo;
          $('#unzip-preview-img').src = project.photo;
          $('#unzip-preview').style.display = 'block';
          $('#unzip-drop-zone').style.display = 'none';
          $('#unzip-object-info').style.display = 'flex';
        }
        $('#unzip-output-placeholder').style.display = 'none';
        $('#unzip-results').style.display = 'block';
        this.switchUnzipTab('illustration');
        showToast(`Loaded: ${project.name}`, 'info');
      });
      grid.appendChild(card);
    });
  }
};
