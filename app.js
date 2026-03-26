/* ═══════════════════════════════════════════════════════════════
   APP.JS v3 — Core Navigation, Edit Mode, Modals, Toasts
   Fixed: main-tabs wiring, no references to missing elements
   ═══════════════════════════════════════════════════════════════ */

// ── DOM Helpers ──────────────────────────────────────────────
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

// ── Toast Notifications ──────────────────────────────────────
function showToast(msg, type = 'info', duration = 3000) {
  const container = $('#toast-container');
  if (!container) return;
  const iconMap = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const toast = el('div', `toast ${type}`);
  toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 310);
  }, duration);
}

// ── Modal Helpers ────────────────────────────────────────────
function openModal(id) {
  const m = $('#' + id);
  if (m) { m.style.display = 'flex'; }
}
function closeModal(id) {
  const m = $('#' + id);
  if (m) m.style.display = 'none';
}

// Close modals when clicking overlay background
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

// ── Main Tabs Navigation ──────────────────────────────────────
function switchSection(sectionId) {
  LCS.state.currentSection = sectionId;

  // Highlight active tab
  $$('.main-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.section === sectionId);
  });

  // Show/hide sections
  $$('.app-section').forEach(section => {
    const isTarget = section.id === `section-${sectionId}`;
    section.style.display = isTarget ? 'block' : 'none';
    section.classList.toggle('active', isTarget);
  });

  // Trigger section init
  const initMap = {
    'collections': () => CollectionsMgr.renderGallery(),
    'inspiration': () => InspoMgr.init(),
    'projects':    () => ProjectsMgr.renderGallery(),
    'studio':      () => StudioMgr.init(),
    'unzip3d':     () => Unzip3DMgr.init(),
    'foil':        () => FoilMgr.init(),
    'genstudio':   () => GenStudioMgr.init(),
  };
  if (initMap[sectionId]) initMap[sectionId]();
}

// ── Edit Mode ─────────────────────────────────────────────────
function toggleEditMode() {
  LCS.state.editMode = !LCS.state.editMode;
  document.body.classList.toggle('edit-mode', LCS.state.editMode);
  const btn = $('#edit-mode-btn');
  if (!btn) return;
  btn.classList.toggle('active', LCS.state.editMode);
  btn.innerHTML = LCS.state.editMode
    ? '<i class="fas fa-lock"></i>'
    : '<i class="fas fa-pencil"></i>';
  btn.title = LCS.state.editMode ? 'Exit Edit Mode' : 'Edit Mode';

  if (LCS.state.editMode) {
    showToast('Edit Mode ON — X to remove sections', 'info', 2500);
  } else {
    showToast('Changes saved', 'success', 1800);
  }

  // Re-render components if in detail view
  if (LCS.state.activeCollectionId && CollectionsMgr.currentView === 'view-detail') {
    const col = LCS.collections.find(c => c.id === LCS.state.activeCollectionId);
    if (col) CollectionsMgr.renderComponents(col);
  }
}

// ── Palette Builder ───────────────────────────────────────────
let _ncPalette = ['#F2B4C0','#EACBC0','#D4A5A5','#B8936A','#7A6055','#4A3728'];
let _ecPalette = [];

function openNewCollectionModal() {
  _ncPalette = ['#F2B4C0','#EACBC0','#D4A5A5','#B8936A','#7A6055','#4A3728'];
  refreshPaletteBuilder('nc-palette-builder', _ncPalette, 'nc');
  const nameEl = $('#nc-name');
  const sizeEl = $('#nc-size');
  const typeEl = $('#nc-type');
  const statusEl = $('#nc-status');
  const tagsEl = $('#nc-tags');
  const coverEl = $('#nc-cover-img');
  if (nameEl) nameEl.value = '';
  if (sizeEl) sizeEl.value = '12x12';
  if (typeEl) typeEl.value = 'Digital';
  if (statusEl) statusEl.value = 'In Progress';
  if (tagsEl) tagsEl.value = '';
  if (coverEl) coverEl.value = '';
  // Clear pattern preview
  const prevBox = $('#nc-pattern-preview');
  if (prevBox) prevBox.innerHTML = '';
  LCS.state._ncPatternImage = null;
  LCS.state._ncCoverImage = null;
  openModal('modal-new-collection');
  setTimeout(() => { if (nameEl) nameEl.focus(); }, 120);
}

function refreshPaletteBuilder(containerId, palette, prefix) {
  const container = $('#' + containerId);
  if (!container) return;
  container.innerHTML = '';
  palette.forEach((color, i) => {
    const dot = el('div', 'palette-dot-input');
    dot.style.background = color;
    dot.dataset.index = i;
    dot.title = `Color ${i+1}: ${color}`;

    // Plus icon overlay
    const plus = el('span', 'dot-plus', '+');
    dot.appendChild(plus);

    dot.addEventListener('click', () => {
      LCS.state.editingPaletteDotIndex = i;
      LCS.state.editingPalettePrefix = prefix;
      const pickerEl = $('#global-color-picker');
      if (pickerEl) {
        pickerEl.value = color;
        pickerEl.dataset.prefix = prefix;
        pickerEl.click();
      }
    });
    container.appendChild(dot);
  });
}

function setupColorPickers() {
  const picker = $('#global-color-picker');
  if (!picker) return;
  picker.addEventListener('input', (e) => {
    const idx = LCS.state.editingPaletteDotIndex;
    const prefix = e.target.dataset.prefix;
    if (prefix === 'nc') {
      _ncPalette[idx] = e.target.value;
      refreshPaletteBuilder('nc-palette-builder', _ncPalette, 'nc');
    } else if (prefix === 'ec') {
      const col = LCS.collections.find(c => c.id === LCS.state.editingCollectionId);
      if (col && col.palette) {
        col.palette[idx] = e.target.value;
        _ecPalette[idx] = e.target.value;
        refreshPaletteBuilder('ec-palette-builder', col.palette, 'ec');
      }
    }
  });
}

// ── Save New Collection ───────────────────────────────────────
function saveNewCollection() {
  const nameEl = $('#nc-name');
  const name = nameEl ? nameEl.value.trim() : '';
  if (!name) { showToast('Please enter a collection name', 'error'); return; }

  const doSave = (coverData, patternData) => {
    const collection = {
      id: LCS.generateId(),
      name,
      size: ($('#nc-size') || {}).value || '12x12',
      type: ($('#nc-type') || {}).value || 'Digital',
      status: ($('#nc-status') || {}).value || 'In Progress',
      tags: (($('#nc-tags') || {}).value || '').split(',').map(t => t.trim()).filter(Boolean),
      palette: [..._ncPalette],
      coverColor: _ncPalette[0],
      coverImage: coverData,
      patternImage: patternData,
      patternScale: 1,
      patternOpacity: 0.18,
      notes: '',
      quickNotes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      components: [
        { id: LCS.generateId(), type: 'pattern-papers', label: 'Pattern Papers', count: 0, items: [], icon: 'fas fa-th' },
        { id: LCS.generateId(), type: 'sticker-sheets', label: 'Sticker Sheets', count: 0, items: [], icon: 'fas fa-star' },
        { id: LCS.generateId(), type: 'ephemera',       label: 'Ephemera',       count: 0, items: [], icon: 'fas fa-scissors' },
      ]
    };
    LCS.collections.unshift(collection);
    LCS.save();
    closeModal('modal-new-collection');
    CollectionsMgr.renderGallery();
    showToast(`"${name}" created! ✨`, 'success');
  };

  // Read cover image
  const coverInput = $('#nc-cover-img');
  const readFile = (input, cb) => {
    if (input && input.files && input.files[0]) {
      const r = new FileReader();
      r.onload = e => cb(e.target.result);
      r.readAsDataURL(input.files[0]);
    } else { cb(null); }
  };

  readFile(coverInput, (coverData) => {
    const patternInput = $('#nc-pattern-img');
    readFile(patternInput, (patternData) => {
      doSave(coverData || LCS.state._ncCoverImage || null, patternData || LCS.state._ncPatternImage || null);
    });
  });
}

// ── Open / Save Edit Collection Modal ────────────────────────
function openEditCollectionModal(collectionId) {
  const col = LCS.collections.find(c => c.id === collectionId);
  if (!col) return;
  LCS.state.editingCollectionId = collectionId;
  _ecPalette = [...(col.palette || _ncPalette)];
  const nameEl = $('#ec-name');
  const statusEl = $('#ec-status');
  const tagsEl = $('#ec-tags');
  if (nameEl) nameEl.value = col.name;
  if (statusEl) statusEl.value = col.status;
  if (tagsEl) tagsEl.value = (col.tags || []).join(', ');
  refreshPaletteBuilder('ec-palette-builder', _ecPalette, 'ec');

  // Show current cover/pattern preview
  const coverThumb = $('#ec-cover-thumb');
  if (coverThumb) {
    coverThumb.src = col.coverImage || '';
    coverThumb.style.display = col.coverImage ? 'block' : 'none';
  }
  const patternThumb = $('#ec-pattern-thumb');
  if (patternThumb) {
    patternThumb.src = col.patternImage || '';
    patternThumb.style.display = col.patternImage ? 'block' : 'none';
  }

  // Sliders
  const scaleEl = $('#ec-pattern-scale');
  const opacityEl = $('#ec-pattern-opacity');
  const scaleVal = $('#ec-scale-val');
  const opacityVal = $('#ec-opacity-val');
  if (scaleEl) { scaleEl.value = (col.patternScale || 1) * 100; if (scaleVal) scaleVal.textContent = Math.round((col.patternScale||1)*100)+'%'; }
  if (opacityEl) { opacityEl.value = Math.round((col.patternOpacity||0.18)*100); if (opacityVal) opacityVal.textContent = Math.round((col.patternOpacity||0.18)*100)+'%'; }

  openModal('modal-edit-collection');
}

function saveEditCollection() {
  const col = LCS.collections.find(c => c.id === LCS.state.editingCollectionId);
  if (!col) return;

  const nameEl = $('#ec-name');
  const statusEl = $('#ec-status');
  const tagsEl = $('#ec-tags');
  if (nameEl && nameEl.value.trim()) col.name = nameEl.value.trim();
  if (statusEl) col.status = statusEl.value;
  if (tagsEl) col.tags = tagsEl.value.split(',').map(t => t.trim()).filter(Boolean);
  col.palette = [..._ecPalette];
  col.coverColor = _ecPalette[0];
  col.updatedAt = Date.now();

  const scaleEl = $('#ec-pattern-scale');
  const opacityEl = $('#ec-pattern-opacity');
  if (scaleEl) col.patternScale = parseInt(scaleEl.value) / 100;
  if (opacityEl) col.patternOpacity = parseInt(opacityEl.value) / 100;

  const doSave = (coverData, patternData) => {
    if (coverData) col.coverImage = coverData;
    if (patternData) col.patternImage = patternData;
    LCS.save();
    closeModal('modal-edit-collection');
    CollectionsMgr.renderGallery();
    if (LCS.state.activeCollectionId === col.id) CollectionsMgr.openDetail(col.id);
    showToast('Collection updated ✨', 'success');
  };

  const readFile = (input, cb) => {
    if (input && input.files && input.files[0]) {
      const r = new FileReader();
      r.onload = e => cb(e.target.result);
      r.readAsDataURL(input.files[0]);
    } else { cb(null); }
  };

  readFile($('#ec-cover-img'), (coverData) => {
    readFile($('#ec-pattern-img'), (patternData) => {
      doSave(coverData, patternData);
    });
  });
}

function deleteCollection(collectionId) {
  if (!confirm('Delete this collection? This cannot be undone.')) return;
  LCS.collections = LCS.collections.filter(c => c.id !== collectionId);
  LCS.save();
  closeModal('modal-edit-collection');
  LCS.state.activeCollectionId = null;
  CollectionsMgr.showView('view-gallery');
  CollectionsMgr.renderGallery();
  showToast('Collection deleted', 'info');
}

// ── Component Modal ────────────────────────────────────────────
function openAddComponentModal() {
  const grid = $('#component-type-grid');
  if (!grid) return;
  grid.innerHTML = '';
  LCS.componentTypes.forEach(type => {
    const item = el('div', 'component-type-item');
    item.innerHTML = `<i class="${type.icon}"></i><span>${type.label}</span>`;
    item.addEventListener('click', () => {
      addComponentToCollection(type);
      closeModal('modal-add-component');
    });
    grid.appendChild(item);
  });
  openModal('modal-add-component');
}

function addComponentToCollection(type) {
  const col = LCS.collections.find(c => c.id === LCS.state.activeCollectionId);
  if (!col) return;
  col.components = col.components || [];
  col.components.push({
    id: LCS.generateId(),
    type: type.id,
    label: type.label,
    count: 0,
    items: [],
    icon: type.icon
  });
  LCS.save();
  CollectionsMgr.renderComponents(col);
  showToast(`"${type.label}" added`, 'success');
}

// ── Project Setup ──────────────────────────────────────────────
function openNewProjectModal() {
  LCS.state.newProjectStep = 1;
  LCS.state.newProjectWorkspaceType = 'guided';
  const npName = $('#np-name');
  const npDims = $('#np-dims');
  const npStatus = $('#np-status');
  if (npName) npName.value = '';
  if (npDims) npDims.value = '';
  if (npStatus) npStatus.value = 'Beginning';
  showSetupStep(1);
  openModal('modal-new-project');
}

function showSetupStep(step) {
  LCS.state.newProjectStep = step;
  $$('.setup-step').forEach(s => s.style.display = 'none');
  const target = $(`#setup-step-${step}`);
  if (target) target.style.display = 'block';
  const prevBtn = $('#setup-prev-btn');
  const nextBtn = $('#setup-next-btn');
  if (prevBtn) prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
  if (nextBtn) {
    if (step === 3) {
      nextBtn.innerHTML = 'Create Project <i class="fas fa-check"></i>';
      nextBtn.onclick = saveNewProject;
    } else {
      nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
      nextBtn.onclick = () => showSetupStep(step + 1);
    }
  }
}

function saveNewProject() {
  const npName = $('#np-name');
  const npDims = $('#np-dims');
  const npStatus = $('#np-status');
  const name = (npName ? npName.value.trim() : '') || 'Untitled Project';
  const dims = npDims ? npDims.value.trim() : '';
  const status = npStatus ? npStatus.value : 'Beginning';

  const project = {
    id: LCS.generateId(),
    name, status, dimensions: dims,
    palette: [...LCS.state.newProjectPalette],
    workspaceType: LCS.state.newProjectWorkspaceType,
    coverImage: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    sections: LCS.state.newProjectWorkspaceType === 'guided'
      ? LCS.guidedSections.map(s => ({
          ...s, id: LCS.generateId(), content: '',
          items: s.type === 'checklist' ? [] : undefined,
          palette: s.type === 'palette' ? [...LCS.state.newProjectPalette] : undefined,
        }))
      : [],
    progressPercent: 0,
  };

  LCS.projects.unshift(project);
  LCS.save();
  closeModal('modal-new-project');
  ProjectsMgr.renderGallery();
  showToast(`"${name}" created! ✨`, 'success');
}

// ── Global Search ─────────────────────────────────────────────
function handleGlobalSearch(term) {
  if (!term) term = $('#global-search-input') ? $('#global-search-input').value.trim() : '';
  if (!term) return;
  const q = term.toLowerCase();
  const colMatches = LCS.collections.filter(c =>
    c.name.toLowerCase().includes(q) || (c.tags||[]).some(t => t.toLowerCase().includes(q))
  );
  if (colMatches.length > 0) {
    switchSection('collections');
    CollectionsMgr.renderGallery(term);
    showToast(`Found ${colMatches.length} collection(s) for "${term}"`, 'info');
  } else {
    const projMatches = LCS.projects.filter(p => p.name.toLowerCase().includes(q));
    if (projMatches.length > 0) {
      switchSection('projects');
      showToast(`Found ${projMatches.length} project(s) for "${term}"`, 'info');
    } else {
      showToast(`No results for "${term}"`, 'info');
    }
  }
}

// ── Main App Init ─────────────────────────────────────────────
function initApp() {
  LCS.load();
  LCS.seedSampleData();

  // Wire main-tabs navigation
  $$('.main-tab').forEach(tab => {
    tab.addEventListener('click', () => switchSection(tab.dataset.section));
  });

  // Topbar buttons
  const editModeBtn = $('#edit-mode-btn');
  if (editModeBtn) editModeBtn.addEventListener('click', toggleEditMode);

  const themeBtn = $('#theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', () => openModal('modal-theme'));

  const newCollBtn = $('#new-collection-btn');
  if (newCollBtn) newCollBtn.addEventListener('click', openNewCollectionModal);

  const importBtn = $('#import-files-btn');
  if (importBtn) importBtn.addEventListener('click', () => showToast('Import: connect your file manager', 'info'));

  // Collection modals
  const saveNewCollBtn = $('#save-new-collection-btn');
  if (saveNewCollBtn) saveNewCollBtn.addEventListener('click', saveNewCollection);

  const newCollEmptyBtn = $('#new-collection-empty-btn');
  if (newCollEmptyBtn) newCollEmptyBtn.addEventListener('click', openNewCollectionModal);

  const saveEditCollBtn = $('#save-edit-collection-btn');
  if (saveEditCollBtn) saveEditCollBtn.addEventListener('click', saveEditCollection);

  const deleteCollBtn = $('#delete-collection-btn');
  if (deleteCollBtn) deleteCollBtn.addEventListener('click', () => deleteCollection(LCS.state.editingCollectionId));

  // Projects
  const newProjectBtn = $('#new-project-btn');
  if (newProjectBtn) newProjectBtn.addEventListener('click', openNewProjectModal);

  const newProjectEmptyBtn = $('#new-project-empty-btn');
  if (newProjectEmptyBtn) newProjectEmptyBtn.addEventListener('click', openNewProjectModal);

  const setupPrevBtn = $('#setup-prev-btn');
  if (setupPrevBtn) setupPrevBtn.addEventListener('click', () => showSetupStep(LCS.state.newProjectStep - 1));

  const setupNextBtn = $('#setup-next-btn');
  if (setupNextBtn) setupNextBtn.addEventListener('click', () => showSetupStep(LCS.state.newProjectStep + 1));

  // Workspace options
  $$('.workspace-option').forEach(opt => {
    opt.addEventListener('click', () => {
      $$('.workspace-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      LCS.state.newProjectWorkspaceType = opt.dataset.type;
    });
  });

  // Global search
  const searchInput = $('#global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (LCS.state.currentSection === 'collections') {
        CollectionsMgr.renderGallery(e.target.value);
      }
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleGlobalSearch(e.target.value);
    });
  }

  // EC cover / pattern file inputs — live preview
  setupEditModalFilePreviews();

  // Theme
  if (typeof ThemeMgr !== 'undefined') ThemeMgr.init();

  // Color pickers
  setupColorPickers();

  // EC scale/opacity sliders
  setupEditSliders();

  // Initial render
  switchSection('collections');
}

function setupEditModalFilePreviews() {
  // Edit collection — cover image preview
  const ecCoverInput = $('#ec-cover-img');
  const ecCoverThumb = $('#ec-cover-thumb');
  if (ecCoverInput && ecCoverThumb) {
    ecCoverInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = ev => { ecCoverThumb.src = ev.target.result; ecCoverThumb.style.display = 'block'; };
      r.readAsDataURL(f);
    });
  }

  // Edit collection — pattern image preview
  const ecPatternInput = $('#ec-pattern-img');
  const ecPatternThumb = $('#ec-pattern-thumb');
  if (ecPatternInput && ecPatternThumb) {
    ecPatternInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = ev => { ecPatternThumb.src = ev.target.result; ecPatternThumb.style.display = 'block'; };
      r.readAsDataURL(f);
    });
  }

  // New collection — cover preview
  const ncCoverInput = $('#nc-cover-img');
  const ncCoverPreview = $('#nc-cover-preview');
  if (ncCoverInput && ncCoverPreview) {
    ncCoverInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = ev => { ncCoverPreview.src = ev.target.result; ncCoverPreview.style.display = 'block'; LCS.state._ncCoverImage = ev.target.result; };
      r.readAsDataURL(f);
    });
  }

  // New collection — pattern preview
  const ncPatternInput = $('#nc-pattern-img');
  const ncPatternPreview = $('#nc-pattern-preview-img');
  if (ncPatternInput && ncPatternPreview) {
    ncPatternInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = ev => { ncPatternPreview.src = ev.target.result; ncPatternPreview.style.display = 'block'; LCS.state._ncPatternImage = ev.target.result; };
      r.readAsDataURL(f);
    });
  }
}

function setupEditSliders() {
  const scaleEl = $('#ec-pattern-scale');
  const scaleVal = $('#ec-scale-val');
  if (scaleEl && scaleVal) {
    scaleEl.addEventListener('input', () => { scaleVal.textContent = scaleEl.value + '%'; });
  }
  const opacityEl = $('#ec-pattern-opacity');
  const opacityVal = $('#ec-opacity-val');
  if (opacityEl && opacityVal) {
    opacityEl.addEventListener('input', () => { opacityVal.textContent = opacityEl.value + '%'; });
  }
}

document.addEventListener('DOMContentLoaded', initApp);
