/* ═══════════════════════════════════════════════════════════════
   COLLECTIONS.JS v3 — Full background/pattern image system
   ═══════════════════════════════════════════════════════════════ */

const CollectionsMgr = {

  currentView: 'view-gallery',

  // ── Show a view ──────────────────────────────────────────────
  showView(view) {
    this.currentView = view;
    ['view-gallery','view-detail','view-fileviewer'].forEach(id => {
      const el = $('#' + id);
      if (el) {
        el.style.display = (id === view) ? 'block' : 'none';
        el.classList.toggle('active', id === view);
      }
    });
  },

  // ── Tag filter chips ────────────────────────────────────────
  buildTagFilters() {
    const bar = $('#tag-filter-bar');
    if (!bar) return;
    const allTags = new Set();
    LCS.collections.forEach(c => (c.tags||[]).forEach(t => allTags.add(t)));
    bar.querySelectorAll('.tag-chip:not([data-filter="all"])').forEach(c => c.remove());
    allTags.forEach(tag => {
      const chip = document.createElement('button');
      chip.className = 'tag-chip';
      chip.dataset.filter = tag;
      chip.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
      chip.addEventListener('click', () => {
        $$('.tag-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderGallery(null, tag);
      });
      bar.appendChild(chip);
    });

    const sidebarTags = $('#sidebar-tags');
    if (sidebarTags) {
      sidebarTags.innerHTML = '';
      allTags.forEach(tag => {
        const chip = document.createElement('div');
        chip.className = 'sidebar-tag-chip';
        chip.style.background = this.tagColor(tag);
        chip.style.color = this.tagTextColor(tag);
        chip.textContent = tag.toUpperCase();
        chip.addEventListener('click', () => {
          $$('.sidebar-tag-chip').forEach(c => c.style.outline = 'none');
          chip.style.outline = '2px solid var(--warm-600)';
          this.renderGallery(null, tag);
        });
        sidebarTags.appendChild(chip);
      });
    }
  },

  tagColor(tag) {
    const m = { floral:'#F9D5D3',summer:'#FFEAA7',autumn:'#FFDDA1',bold:'#FFB3B3',foil:'#FFF0A0',spring:'#C8F0C8',romantic:'#F9D5D3',ocean:'#A8D8F0',winter:'#C8D8F8',vintage:'#F0D8C8',gold:'#FFF0A0',warm:'#FFE4B8',dark:'#D0C8D8',moody:'#D0C0D8',purple:'#E8C8F0',evening:'#C8C0E0',blue:'#C8E0F8',coastal:'#C8F0F0',harvest:'#FFDDA1',feminine:'#F9D5D3' };
    return m[tag.toLowerCase()] || '#EFE8E5';
  },
  tagTextColor(tag) {
    const m = { floral:'#C0394A',summer:'#9B7700',autumn:'#A05000',bold:'#8B0000',foil:'#7A6000',spring:'#1A7A1A',romantic:'#C0394A',ocean:'#006080',winter:'#003080',vintage:'#7A4020',gold:'#7A6000',warm:'#7A4000',dark:'#4A3060',moody:'#5A3070',purple:'#5A0080',evening:'#3A3070',blue:'#003080',coastal:'#006060',harvest:'#A05000',feminine:'#C0394A' };
    return m[tag.toLowerCase()] || '#5A463E';
  },

  // ── Gallery Render ──────────────────────────────────────────
  renderGallery(searchTerm, tagFilter) {
    const grid = $('#collections-grid');
    const empty = $('#collections-empty');
    if (!grid) return;

    let cols = [...LCS.collections];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      cols = cols.filter(c => c.name.toLowerCase().includes(q) || (c.tags||[]).some(t => t.toLowerCase().includes(q)));
    }
    if (tagFilter && tagFilter !== 'all') {
      cols = cols.filter(c => (c.tags||[]).includes(tagFilter));
    }

    const countEl = $('#collections-count');
    if (countEl) countEl.textContent = `${cols.length} collection${cols.length !== 1 ? 's' : ''}`;

    if (cols.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'flex';
      return;
    }
    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
    grid.innerHTML = '';
    cols.forEach(col => grid.appendChild(this.buildCard(col)));
    this.buildTagFilters();
    this.showView('view-gallery');
  },

  buildCard(col) {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.dataset.id = col.id;

    const totalItems = (col.components||[]).reduce((s,c) => s + (c.count||0), 0);
    const p = col.palette || [];
    const c1 = p[0] || '#F2B4C0', c2 = p[2] || '#CFA18D';
    const statusClass = LCS.statusClass(col.status);
    const initials = col.name.split(' ').map(w => w[0]).join('').substr(0,2).toUpperCase();

    // Card cover: use coverImage if available, else palette gradient
    let coverHtml;
    if (col.coverImage) {
      coverHtml = `<img src="${col.coverImage}" alt="${col.name}" class="card-cover-img" loading="lazy" />`;
    } else {
      coverHtml = `<div class="card-cover-gradient" style="--c1:${c1};--c2:${c2}">
                     <span class="card-initials">${initials}</span>
                   </div>`;
    }

    // Show palette as small color band at bottom of card cover
    const paletteBand = p.slice(0,6).map(c => `<div class="palette-band-seg" style="background:${c}"></div>`).join('');

    card.innerHTML = `
      <div class="card-cover">
        ${coverHtml}
        <div class="card-palette-band">${paletteBand}</div>
        <div class="card-status-overlay"><span class="status-tag ${statusClass}">${col.status}</span></div>
        <div class="card-action-overlay">
          <button class="card-action-btn cover-upload-btn" data-id="${col.id}" title="Upload cover image">
            <i class="fas fa-image"></i>
          </button>
          <button class="card-action-btn edit-btn" data-id="${col.id}" title="Edit collection">
            <i class="fas fa-pencil"></i>
          </button>
          <button class="card-action-btn delete-btn" data-id="${col.id}" title="Delete collection">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <input type="file" class="card-cover-file-input" data-id="${col.id}" accept="image/*" style="display:none" />
      </div>
      <div class="card-body">
        <div class="card-name">${col.name}</div>
        <div class="card-sub">${totalItems} Items${col.size ? ' · ' + col.size : ''}${col.tags?.length ? ' · ' + col.tags.slice(0,2).map(t => '#'+t).join(' ') : ''}</div>
        <div class="card-tags">${(col.tags||[]).slice(0,3).map(t => `<span class="card-tag">#${t}</span>`).join('')}</div>
      </div>
    `;

    // Wire click → open detail
    card.addEventListener('click', e => {
      if (e.target.closest('.card-action-btn') || e.target.closest('.card-cover-file-input')) return;
      this.openDetail(col.id);
    });

    // Wire action buttons
    card.querySelector('.edit-btn').addEventListener('click', e => {
      e.stopPropagation();
      openEditCollectionModal(col.id);
    });
    card.querySelector('.delete-btn').addEventListener('click', e => {
      e.stopPropagation();
      if (confirm(`Delete "${col.name}"? This cannot be undone.`)) deleteCollection(col.id);
    });

    // Card-level cover image upload
    const coverUploadBtn = card.querySelector('.cover-upload-btn');
    const cardCoverInput = card.querySelector('.card-cover-file-input');
    coverUploadBtn.addEventListener('click', e => {
      e.stopPropagation();
      cardCoverInput.click();
    });
    cardCoverInput.addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = ev => {
        col.coverImage = ev.target.result;
        col.updatedAt = Date.now();
        LCS.save();
        this.renderGallery();
        showToast('Cover image updated ✨', 'success');
      };
      r.readAsDataURL(f);
    });

    return card;
  },

  // ── Detail View ──────────────────────────────────────────────
  openDetail(collectionId) {
    const col = LCS.collections.find(c => c.id === collectionId);
    if (!col) return;
    LCS.state.activeCollectionId = collectionId;

    this.showView('view-detail');
    this.applyCollectionBackground(col);
    this.renderDetailHeader(col);
    this.renderCollectionSidebar(collectionId);
    this.renderComponents(col);
    this.renderFileCenterPanel(col);
    this.renderRightPanel(col);
    this.wireDetailControls(col);
  },

  wireDetailControls(col) {
    // Back button
    const backBtn = $('#back-to-gallery-btn');
    if (backBtn) backBtn.onclick = () => {
      this.showView('view-gallery');
      this.clearBackground();
      this.renderGallery();
    };

    // Back mobile
    const backMobile = $('#back-btn-mobile');
    if (backMobile) backMobile.onclick = () => {
      this.showView('view-gallery');
      this.clearBackground();
      this.renderGallery();
    };

    const sidebarAddBtn = $('#sidebar-add-btn');
    if (sidebarAddBtn) sidebarAddBtn.onclick = () => openNewCollectionModal();

    const addAssetsBtn = $('#add-assets-btn');
    if (addAssetsBtn) addAssetsBtn.onclick = () => openAddComponentModal();

    const downloadBtn = $('#download-all-btn');
    if (downloadBtn) downloadBtn.onclick = () => showToast('Preparing ZIP download...', 'info');

    const downloadZipBtn = $('#download-zip-btn');
    if (downloadZipBtn) downloadZipBtn.onclick = () => showToast('Preparing ZIP download...', 'info');

    const editCollBtn = $('#edit-coll-btn');
    if (editCollBtn) editCollBtn.onclick = () => openEditCollectionModal(col.id);

    const heartBtn = $('#coll-heart-btn');
    if (heartBtn) heartBtn.onclick = (e) => {
      const btn = e.currentTarget;
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      icon.className = btn.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
      showToast(btn.classList.contains('active') ? 'Added to Favorites ♡' : 'Removed from Favorites', 'info', 1800);
    };

    const notesBtn = $('#coll-notes-btn');
    if (notesBtn) notesBtn.onclick = () => {
      const notes = $('#coll-notes-area');
      if (notes) notes.scrollIntoView({ behavior:'smooth', block:'center' });
    };

    const uploadFilesBtn = $('#upload-files-btn');
    if (uploadFilesBtn) uploadFilesBtn.onclick = () => showToast('Connect your file manager to upload files', 'info');

    // ── RIGHT PANEL: Change Cover button ─────────────────
    const changeCoverBtn = $('#change-preview-btn');
    const coverImgInput = $('#cover-img-input');
    const removeCoverBtn = $('#remove-cover-btn');

    if (changeCoverBtn && coverImgInput) {
      changeCoverBtn.onclick = () => coverImgInput.click();
      coverImgInput.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          col.coverImage = ev.target.result;
          col.updatedAt = Date.now();
          LCS.save();
          this.openDetail(col.id);
          showToast('Cover image updated ✨', 'success');
        };
        r.readAsDataURL(f);
      };
    }
    if (removeCoverBtn) {
      removeCoverBtn.style.display = col.coverImage ? 'inline-flex' : 'none';
      removeCoverBtn.onclick = () => {
        if (!confirm('Remove cover image?')) return;
        col.coverImage = null;
        col.updatedAt = Date.now();
        LCS.save();
        this.openDetail(col.id);
        showToast('Cover image removed', 'info');
      };
    }

    // ── RIGHT PANEL: Pattern upload ──────────────────────
    const uploadPatternBtn = $('#right-upload-pattern-btn');
    const rightPatternInput = $('#right-pattern-input');
    const removePatternBtn = $('#right-remove-pattern-btn');

    if (uploadPatternBtn && rightPatternInput) {
      uploadPatternBtn.onclick = () => rightPatternInput.click();
      rightPatternInput.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          col.patternImage = ev.target.result;
          col.updatedAt = Date.now();
          LCS.save();
          this.applyCollectionBackground(col);
          this.renderRightPanel(col);
          showToast('Pattern background applied ✨', 'success');
        };
        r.readAsDataURL(f);
      };
    }
    if (removePatternBtn) {
      removePatternBtn.style.display = col.patternImage ? 'inline-flex' : 'none';
      removePatternBtn.onclick = () => {
        if (!confirm('Remove pattern background?')) return;
        col.patternImage = null;
        col.updatedAt = Date.now();
        LCS.save();
        this.applyCollectionBackground(col);
        this.renderRightPanel(col);
        showToast('Pattern background removed', 'info');
      };
    }

    // ── RIGHT PANEL: Pattern scale/opacity sliders ───────
    this.wirePatternSliders(col);

    // ── INLINE HEADER BG BAR ─────────────────────────────
    this.wireHeaderBgBar(col);

    // Notes autosave
    const notesArea = $('#coll-notes-area');
    if (notesArea) {
      notesArea.value = col.notes || '';
      notesArea.addEventListener('input', () => { col.notes = notesArea.value; LCS.save(); });
    }
    const quickNotes = $('#quick-notes-area');
    if (quickNotes) {
      quickNotes.value = col.quickNotes || '';
      quickNotes.addEventListener('input', () => { col.quickNotes = quickNotes.value; LCS.save(); });
    }

    // Organize tabs
    $$('.organize-tab').forEach(tab => {
      tab.onclick = () => {
        $$('.organize-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        showToast(`Organized by: ${tab.dataset.org}`, 'info', 1500);
      };
    });
  },

  wirePatternSliders(col) {
    const scaleEl = $('#right-pattern-scale');
    const scaleValEl = $('#right-scale-val');
    const opacityEl = $('#right-pattern-opacity');
    const opacityValEl = $('#right-opacity-val');

    if (scaleEl) {
      scaleEl.value = Math.round((col.patternScale || 1) * 100);
      if (scaleValEl) scaleValEl.textContent = scaleEl.value + '%';
      scaleEl.addEventListener('input', () => {
        if (scaleValEl) scaleValEl.textContent = scaleEl.value + '%';
        col.patternScale = parseInt(scaleEl.value) / 100;
        LCS.save();
        this.applyCollectionBackground(col);
      });
    }
    if (opacityEl) {
      opacityEl.value = Math.round((col.patternOpacity || 0.18) * 100);
      if (opacityValEl) opacityValEl.textContent = opacityEl.value + '%';
      opacityEl.addEventListener('input', () => {
        if (opacityValEl) opacityValEl.textContent = opacityEl.value + '%';
        col.patternOpacity = parseInt(opacityEl.value) / 100;
        LCS.save();
        this.applyCollectionBackground(col);
      });
    }
  },

  wireHeaderBgBar(col) {
    // Inline bg bar: Change Cover, Change Pattern, Clear BG
    const detailCoverBtn = $('#detail-change-cover-btn');
    const detailPatternBtn = $('#detail-change-pattern-btn');
    const detailClearBgBtn = $('#detail-clear-bg-btn');
    const detailCoverInput = $('#detail-cover-img-input');
    const detailPatternInput = $('#detail-pattern-img-input');
    const bgSliderWrap = $('#bg-slider-wrap');

    if (detailCoverBtn && detailCoverInput) {
      detailCoverBtn.onclick = () => detailCoverInput.click();
      detailCoverInput.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          col.coverImage = ev.target.result;
          col.updatedAt = Date.now();
          LCS.save();
          this.openDetail(col.id);
          showToast('Card cover updated ✨', 'success');
        };
        r.readAsDataURL(f);
      };
    }

    if (detailPatternBtn && detailPatternInput) {
      detailPatternBtn.onclick = () => detailPatternInput.click();
      detailPatternInput.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          col.patternImage = ev.target.result;
          col.updatedAt = Date.now();
          LCS.save();
          this.applyCollectionBackground(col);
          if (bgSliderWrap) bgSliderWrap.style.display = 'flex';
          // Also update right panel
          this.renderRightPanel(col);
          this.wirePatternSliders(col);
          this.wireHeaderBgBar(col);
          showToast('Page pattern applied ✨', 'success');
        };
        r.readAsDataURL(f);
      };
    }

    if (detailClearBgBtn) {
      detailClearBgBtn.onclick = () => {
        col.patternImage = null;
        col.coverImage = null;
        col.updatedAt = Date.now();
        LCS.save();
        this.applyCollectionBackground(col);
        this.renderRightPanel(col);
        if (bgSliderWrap) bgSliderWrap.style.display = 'none';
        showToast('Background cleared', 'info');
      };
    }

    // Show/hide slider wrap based on whether pattern is set
    if (bgSliderWrap) {
      bgSliderWrap.style.display = col.patternImage ? 'flex' : 'none';
    }

    // Wire detail-level sliders (in header bg bar)
    const detailScaleEl = $('#detail-pattern-scale');
    const detailScaleVal = $('#detail-scale-val');
    const detailOpacityEl = $('#detail-pattern-opacity');
    const detailOpacityVal = $('#detail-opacity-val');

    if (detailScaleEl) {
      detailScaleEl.value = Math.round((col.patternScale||1)*100);
      if (detailScaleVal) detailScaleVal.textContent = detailScaleEl.value + '%';
      detailScaleEl.oninput = () => {
        if (detailScaleVal) detailScaleVal.textContent = detailScaleEl.value + '%';
        col.patternScale = parseInt(detailScaleEl.value) / 100;
        LCS.save();
        this.applyCollectionBackground(col);
      };
    }
    if (detailOpacityEl) {
      detailOpacityEl.value = Math.round((col.patternOpacity||0.18)*100);
      if (detailOpacityVal) detailOpacityVal.textContent = detailOpacityEl.value + '%';
      detailOpacityEl.oninput = () => {
        if (detailOpacityVal) detailOpacityVal.textContent = detailOpacityEl.value + '%';
        col.patternOpacity = parseInt(detailOpacityEl.value) / 100;
        LCS.save();
        this.applyCollectionBackground(col);
      };
    }
  },

  // ── Apply Collection Background ──────────────────────────────
  applyCollectionBackground(col) {
    const pageBody = $('#page-body');
    if (!pageBody) return;

    const p = col.palette || [];
    const c1 = p[0] || '#F9EDE9';
    const c2 = p[1] || '#F0E0DC';
    const c3 = p[2] || '#E8D0CC';

    if (col.patternImage) {
      const scale = col.patternScale || 1;
      const opacity = col.patternOpacity || 0.18;
      const sizePx = Math.round(200 * scale) + 'px';
      pageBody.style.cssText = `
        background-image: url("${col.patternImage}");
        background-repeat: repeat;
        background-size: ${sizePx};
        background-position: top left;
        position: relative;
      `;
      // Add a color overlay using a pseudo-element via a child div
      this.setPatternOverlay(pageBody, c1, c2, opacity);
    } else if (col.coverImage) {
      // Use cover image as blurred bg
      pageBody.style.cssText = `
        background: linear-gradient(160deg, ${c1}55 0%, ${c2}66 40%, ${c3}44 100%);
      `;
      this.removePatternOverlay(pageBody);
    } else {
      pageBody.style.cssText = `
        background: linear-gradient(160deg, ${c1}55 0%, ${c2}66 40%, ${c3}44 100%);
      `;
      this.removePatternOverlay(pageBody);
    }

    // Update CSS accent variables
    if (p.length >= 3) {
      document.documentElement.style.setProperty('--accent', p[2]);
      document.documentElement.style.setProperty('--accent-hover', p[3] || p[2]);
    }
  },

  setPatternOverlay(body, c1, c2, opacity) {
    let overlay = body.querySelector('.pattern-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pattern-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;';
      body.prepend(overlay);
    }
    overlay.style.background = `linear-gradient(160deg, ${c1}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, ${c2}${Math.round(opacity*0.7*255).toString(16).padStart(2,'0')} 100%)`;
  },

  removePatternOverlay(body) {
    const overlay = body.querySelector('.pattern-overlay');
    if (overlay) overlay.remove();
  },

  clearBackground() {
    const body = $('#page-body');
    if (body) {
      body.style.cssText = '';
      this.removePatternOverlay(body);
    }
    document.documentElement.style.setProperty('--accent', '#CFA18D');
    document.documentElement.style.setProperty('--accent-hover', '#A0705A');
  },

  // ── Detail Header ────────────────────────────────────────────
  renderDetailHeader(col) {
    const titleEl = $('#coll-title');
    if (titleEl) {
      titleEl.textContent = col.name;
      // Make title inline-editable on double-click
      titleEl.title = 'Double-click to rename';
      titleEl.addEventListener('dblclick', () => {
        const old = col.name;
        titleEl.contentEditable = 'true';
        titleEl.focus();
        const range = document.createRange();
        range.selectNodeContents(titleEl);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        const save = () => {
          titleEl.contentEditable = 'false';
          const newName = titleEl.textContent.trim();
          if (newName && newName !== old) {
            col.name = newName;
            col.updatedAt = Date.now();
            LCS.save();
            showToast('Collection renamed ✨', 'success');
          } else {
            titleEl.textContent = old;
          }
        };
        titleEl.addEventListener('blur', save, { once: true });
        titleEl.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); titleEl.blur(); }
          if (e.key === 'Escape') { titleEl.textContent = old; titleEl.blur(); }
        }, { once: true });
      }, { once: false });
    }

    const totalItems = (col.components||[]).reduce((s,c) => s + (c.count||0), 0);
    const countLabel = $('#components-count-label');
    if (countLabel) countLabel.textContent = `${totalItems} ITEMS`;

    // Meta row
    const types = (col.components||[]).map(c => c.label.toUpperCase().replace(' SHEETS','').replace(' PAPERS','').replace(' / CUT-APARTS',''));
    const metaEl = $('#coll-meta-row');
    if (metaEl) metaEl.textContent = [col.size || '12x12', ...(types.slice(0,5))].join(' · ');

    // Status
    const stEl = $('#coll-status-tag');
    if (stEl) { stEl.textContent = col.status; stEl.className = `status-tag ${LCS.statusClass(col.status)}`; }

    // Palette dots
    const palRow = $('#coll-palette-row');
    if (palRow) {
      palRow.innerHTML = '';
      (col.palette||[]).forEach((color, i) => {
        const dot = document.createElement('div');
        dot.className = 'coll-palette-dot';
        dot.style.background = color;
        dot.title = `Apply theme color: ${color}`;
        dot.addEventListener('click', () => {
          $$('.coll-palette-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          document.documentElement.style.setProperty('--accent', color);
          showToast(`Theme color: ${color}`, 'success', 1600);
        });
        palRow.appendChild(dot);
      });
    }
  },

  // ── Sidebar ──────────────────────────────────────────────────
  renderCollectionSidebar(activeId) {
    const list = $('#coll-sidebar-list');
    if (!list) return;
    list.innerHTML = '';
    LCS.collections.forEach(col => {
      const li = document.createElement('li');
      li.className = `sidebar-coll-item${col.id === activeId ? ' active' : ''}`;
      const p = col.palette || [];
      const c1 = p[0]||'#F2B4C0', c2 = p[1]||'#CFA18D';
      const totalItems = (col.components||[]).reduce((s,c) => s+(c.count||0), 0);
      li.innerHTML = `
        <div class="sidebar-coll-thumb">
          ${col.coverImage
            ? `<img src="${col.coverImage}" alt="${col.name}" />`
            : `<div class="gradient-thumb" style="background:linear-gradient(135deg,${c1},${c2})"></div>`}
        </div>
        <div class="sidebar-coll-info">
          <div class="sidebar-coll-name">${col.name}</div>
          <div class="sidebar-coll-meta">${totalItems} Items</div>
          <div class="sidebar-coll-dots">
            ${p.slice(0,4).map(c => `<div class="sidebar-dot" style="background:${c}"></div>`).join('')}
          </div>
        </div>
        <div class="sidebar-coll-count">${totalItems}</div>
      `;
      li.addEventListener('click', () => this.openDetail(col.id));
      list.appendChild(li);
    });
    this.buildTagFilters();
  },

  // ── Components Grid ──────────────────────────────────────────
  renderComponents(col) {
    const grid = $('#components-grid');
    if (!grid) return;
    grid.innerHTML = '';
    (col.components||[]).forEach(comp => grid.appendChild(this.buildCompBox(comp, col)));

    if (LCS.state.editMode) {
      const addBox = document.createElement('div');
      addBox.className = 'component-box comp-add-box';
      addBox.innerHTML = `<div class="comp-add-inner"><i class="fas fa-plus"></i><span>ADD SECTION</span></div>`;
      addBox.addEventListener('click', () => openAddComponentModal());
      grid.appendChild(addBox);
    }
  },

  buildCompBox(comp, col) {
    const box = document.createElement('div');
    box.className = 'component-box';
    box.dataset.compId = comp.id;
    const palette = col.palette || [];

    // Thumbnail grid — use collection colors as colored tile placeholders
    const thumbsHtml = [0,1,2,3,4,5].map((i) => {
      const bg = palette[i % palette.length] || '#F2B4C0';
      const bg2 = palette[(i+1) % Math.max(palette.length,1)] || '#CFA18D';
      return `<div class="comp-thumb" style="background:linear-gradient(135deg,${bg}44,${bg2}66)">
        <i class="${comp.icon}" style="color:${bg};font-size:0.7rem;opacity:0.7"></i>
      </div>`;
    }).join('');

    box.innerHTML = `
      <button class="comp-remove-btn edit-only" title="Remove section"><i class="fas fa-times"></i></button>
      <div class="comp-header">
        <div class="comp-title">
          <span class="comp-icon-wrap"><i class="${comp.icon}"></i></span>
          <span class="comp-label-text">${comp.label.toUpperCase()}</span>
        </div>
        <div class="comp-count-badge">${comp.count || 0}</div>
      </div>
      <div class="comp-thumbs">${thumbsHtml}</div>
      <div class="comp-footer">
        <button class="comp-count-btn comp-count-down" data-id="${comp.id}" title="Decrease count"><i class="fas fa-minus"></i></button>
        <span class="comp-count-display">${comp.count || 0} files</span>
        <button class="comp-count-btn comp-count-up" data-id="${comp.id}" title="Increase count"><i class="fas fa-plus"></i></button>
        <button class="comp-view-btn" data-comp-id="${comp.id}">
          VIEW FILES <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    box.querySelector('.comp-view-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      LCS.state.currentFileCategory = comp.label;
      LCS.state.currentFilesCollectionId = col.id;
      this.openFileViewer(col, comp);
    });

    box.querySelector('.comp-remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (!LCS.state.editMode) return;
      col.components = (col.components||[]).filter(c => c.id !== comp.id);
      LCS.save();
      this.renderComponents(col);
      const total = (col.components||[]).reduce((s,c) => s+(c.count||0), 0);
      const lbl = $('#components-count-label');
      if (lbl) lbl.textContent = `${total} ITEMS`;
      showToast(`"${comp.label}" removed`, 'info');
    });

    box.querySelector('.comp-count-down').addEventListener('click', e => {
      e.stopPropagation();
      if (comp.count > 0) { comp.count--; LCS.save(); this.renderComponents(col); }
    });
    box.querySelector('.comp-count-up').addEventListener('click', e => {
      e.stopPropagation();
      comp.count++;
      LCS.save();
      this.renderComponents(col);
    });

    return box;
  },

  // ── File Center Panel ─────────────────────────────────────────
  renderFileCenterPanel(col) {
    const btns = $('#file-type-buttons');
    const extraChips = $('#extra-file-chips');
    if (!btns) return;

    const fileTypes = ['SVG Files','PMD Files','PNG Stamps','Stencils','Backgrounds','PMDG Stamps','Cut Files','Print Sheets'];
    btns.innerHTML = '';
    fileTypes.forEach((ft, i) => {
      const btn = document.createElement('button');
      btn.className = `file-type-btn${i === 0 ? ' active' : ''}`;
      btn.textContent = ft;
      btn.addEventListener('click', () => {
        $$('.file-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        LCS.state.currentFileFormat = ft.replace(' Files','').toUpperCase();
        this.openFileViewer(col, null, ft);
      });
      btns.appendChild(btn);
    });

    if (extraChips) {
      extraChips.innerHTML = '';
      ['SVG Files','PMD Files','PNG Stamps','Backgrounds','Print Sheets','Cut Files'].forEach(ft => {
        const chip = document.createElement('span');
        chip.className = 'extra-chip';
        chip.textContent = ft;
        chip.addEventListener('click', () => this.openFileViewer(col, null, ft));
        extraChips.appendChild(chip);
      });
    }
  },

  // ── Right Panel (Preview + Pattern Controls) ─────────────────
  renderRightPanel(col) {
    // Cover preview
    const previewWrap = $('#preview-img-wrap');
    if (previewWrap) {
      const p = col.palette || [];
      const c1 = p[0]||'#F2B4C0', c2 = p[2]||'#CFA18D';
      if (col.coverImage) {
        previewWrap.innerHTML = `<img src="${col.coverImage}" alt="${col.name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius)" />`;
      } else {
        previewWrap.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,${c1},${c2});border-radius:var(--radius);display:flex;align-items:center;justify-content:center">
          <span style="font-family:var(--font-heading);font-size:1.8rem;color:rgba(255,255,255,0.55);font-weight:700">${col.name.split(' ').map(w=>w[0]).join('').substr(0,2).toUpperCase()}</span>
        </div>`;
      }
    }

    // Remove cover button visibility
    const removeCoverBtn = $('#remove-cover-btn');
    if (removeCoverBtn) removeCoverBtn.style.display = col.coverImage ? 'inline-flex' : 'none';

    // Pattern preview
    const patternPlaceholder = $('#pattern-placeholder');
    const rightPatternImg = $('#right-pattern-img');
    const patternControls = $('#pattern-controls');
    const removePatternBtn = $('#right-remove-pattern-btn');

    if (rightPatternImg && patternPlaceholder) {
      if (col.patternImage) {
        rightPatternImg.src = col.patternImage;
        rightPatternImg.style.display = 'block';
        patternPlaceholder.style.display = 'none';
        if (patternControls) patternControls.style.display = 'block';
        if (removePatternBtn) removePatternBtn.style.display = 'inline-flex';
      } else {
        rightPatternImg.style.display = 'none';
        patternPlaceholder.style.display = 'flex';
        if (patternControls) patternControls.style.display = 'none';
        if (removePatternBtn) removePatternBtn.style.display = 'none';
      }
    }

    // File type folders
    const rff = $('#right-file-types');
    if (rff) {
      rff.innerHTML = '<div class="sidebar-section-label" style="padding:8px 12px;font-size:0.65rem;letter-spacing:0.12em;color:var(--text-muted)">FILE CENTER</div>';
      [
        { icon: 'fas fa-file-code',  label: 'SVG Files',   color: '#F4A03A' },
        { icon: 'fas fa-file-alt',   label: 'PMD Files',   color: '#9B59B6' },
        { icon: 'fas fa-file-image', label: 'PNG Stamps',  color: '#3498DB' },
        { icon: 'fas fa-cut',        label: 'Stencils',    color: '#E74C3C' },
      ].forEach(ff => {
        const count = Math.floor(Math.random()*10)+2;
        const item = document.createElement('div');
        item.className = 'right-file-folder';
        item.innerHTML = `
          <div class="rff-left">
            <i class="${ff.icon}" style="color:${ff.color};font-size:0.9rem"></i>
            <span class="rff-label">${ff.label}</span>
          </div>
          <span class="rff-count">${count}</span>
        `;
        item.addEventListener('click', () => this.openFileViewer(col, null, ff.label));
        rff.appendChild(item);
      });
    }
  },

  // ── File Viewer ──────────────────────────────────────────────
  openFileViewer(col, comp, fileType) {
    const catLabel = comp ? comp.label : (fileType || 'All Files');
    this.showView('view-fileviewer');

    const titleEl = $('#fileviewer-title');
    if (titleEl) titleEl.textContent = `${col.name} — ${catLabel.toUpperCase()}`;

    const backBtn = $('#fileviewer-back-btn');
    if (backBtn) backBtn.onclick = () => { this.openDetail(col.id); };

    const count = comp ? (comp.count || 12) : 12;
    const files = this.generateFiles(col, catLabel, count);
    const grid = $('#fileviewer-grid');
    if (grid) {
      grid.innerHTML = '';
      files.forEach(f => grid.appendChild(this.buildFvCard(f, col)));
    }

    const selectAllCb = $('#select-all-cb');
    if (selectAllCb) {
      selectAllCb.checked = false;
      selectAllCb.onchange = () => {
        $$('.fv-card').forEach(card => {
          card.classList.toggle('selected', selectAllCb.checked);
          const check = card.querySelector('.fv-checkbox-check');
          if (check) check.style.display = selectAllCb.checked ? 'block' : 'none';
        });
        LCS.state.selectedFiles = selectAllCb.checked ? files.map(f => f.id) : [];
        if (selectAllCb.checked) showToast(`${files.length} files selected`, 'success', 1500);
      };
    }

    const dlBtn = $('#fileviewer-download-btn');
    if (dlBtn) dlBtn.onclick = () => {
      const selectedCount = $$('.fv-card.selected').length;
      if (selectedCount === 0) { showToast('Select files first', 'error'); return; }
      showToast(`Downloading ${selectedCount} files...`, 'info');
    };
  },

  generateFiles(col, category, count = 12) {
    const palette = col.palette || ['#F2B4C0'];
    const cat = category.toLowerCase().replace(/\s/g, '-').replace(/\//g, '');
    const filePrefix = cat.includes('sticker') ? 'sticker' : cat.includes('paper') ? 'paper' : cat.includes('ephem') ? 'ephemera' : cat.includes('svg') ? 'svg' : cat.includes('png') ? 'png_stamp' : cat.includes('pmd') ? 'pmd_file' : cat.includes('background') ? 'bg' : cat.includes('stencil') ? 'stencil' : 'file';
    const formats = cat.includes('svg') ? ['SVG'] : cat.includes('pmd') ? ['PMD'] : cat.includes('png') ? ['PNG'] : cat.includes('pdf') || cat.includes('print') ? ['PDF'] : ['PNG','SVG','PDF'];
    const files = [];
    for (let i = 0; i < count; i++) {
      const fmt = formats[i % formats.length];
      files.push({
        id: `${col.id}_${cat}_${i}`,
        name: `${filePrefix}_${String(i+1).padStart(2,'0')}.${fmt.toLowerCase()}`,
        type: fmt,
        color: palette[i % palette.length],
      });
    }
    return files;
  },

  buildFvCard(file, col) {
    const card = document.createElement('div');
    card.className = 'fv-card';
    card.dataset.fileId = file.id;

    const iconMap = { SVG:'fa-file-code fv-icon-svg', PDF:'fa-file-pdf fv-icon-pdf', PNG:'fa-file-image fv-icon-png', PMD:'fa-file-alt fv-icon-pmd' };
    const badgeMap = { SVG:'badge-svg', PDF:'badge-pdf', PNG:'badge-png', PMD:'badge-pmd' };
    const icon = iconMap[file.type] || 'fa-file fv-icon-png';
    const badge = badgeMap[file.type] || 'badge-png';

    const p = col.palette || [];
    const idx = Math.floor(Math.random() * Math.max(p.length,1));
    const thumbBg = p[idx] || '#F2B4C0';
    const thumbBg2 = p[(idx+1) % Math.max(p.length,1)] || '#CFA18D';

    card.innerHTML = `
      <div class="fv-checkbox">
        <i class="fas fa-check fv-checkbox-check" style="display:none"></i>
      </div>
      <div class="fv-thumb">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,${thumbBg}55,${thumbBg2}88);display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm)">
          <i class="fas ${icon.split(' ')[0]} ${icon.split(' ')[1] || ''}" style="font-size:1.8rem"></i>
        </div>
      </div>
      <div class="fv-info">
        <div class="fv-name">${file.name}</div>
        <span class="fv-type-badge ${badge}">${file.type}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const check = card.querySelector('.fv-checkbox-check');
      if (check) check.style.display = card.classList.contains('selected') ? 'block' : 'none';
      if (card.classList.contains('selected')) {
        if (!LCS.state.selectedFiles.includes(file.id)) LCS.state.selectedFiles.push(file.id);
      } else {
        LCS.state.selectedFiles = LCS.state.selectedFiles.filter(id => id !== file.id);
      }
    });

    return card;
  }
};
