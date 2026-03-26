/* ═══════════════════════════════════════════════════════════════
   PROJECTS.JS — Craft Projects Gallery, Detail View
   ═══════════════════════════════════════════════════════════════ */

const ProjectsMgr = {
  currentStatus: 'all',
  initialized: false,

  init() {
    if (!this.initialized) {
      this.initialized = true;
      this.setupStatusFilters();
      this.setupSearch();
    }
    this.renderGallery();
  },

  setupStatusFilters() {
    $$('.status-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.status-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentStatus = btn.dataset.status;
        this.renderGallery();
      });
    });
  },

  setupSearch() {
    const searchEl = $('#projects-search');
    if (searchEl) {
      searchEl.addEventListener('input', (e) => {
        this.renderGallery(e.target.value);
      });
    }
  },

  // ── Gallery ──────────────────────────────────────────────────
  renderGallery(searchTerm = '') {
    const grid = $('#projects-grid');
    const empty = $('#projects-empty');
    if (!grid) return;

    let projects = LCS.projects;

    // Filter by status
    if (this.currentStatus !== 'all') {
      projects = projects.filter(p =>
        p.status.toLowerCase().replace(/\s+/g, '-') === this.currentStatus
      );
    }

    // Filter by search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      projects = projects.filter(p => p.name.toLowerCase().includes(q));
    }

    const count = $('#projects-count');
    if (count) count.textContent = `${projects.length} Project${projects.length !== 1 ? 's' : ''}`;

    if (projects.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'flex';
      return;
    }

    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
    grid.innerHTML = '';

    projects.forEach(project => {
      const tile = this.buildProjectTile(project);
      grid.appendChild(tile);
    });
  },

  buildProjectTile(project) {
    const tile = document.createElement('div');
    tile.className = 'project-tile';
    tile.dataset.id = project.id;

    const palette = project.palette || ['#F9D5D3','#F2B4C0','#CFA18D'];
    const bgColor  = palette[0] || '#F2B4C0';
    const bg2Color = palette[1] || '#CFA18D';
    const statusClass = LCS.statusClass(project.status);
    const progress = project.progressPercent || 0;
    const formattedDate = LCS.formatDate(project.updatedAt);
    const sectionCount = (project.sections || []).length;

    // Mini thumbnails from palette
    const thumbsHtml = palette.slice(0,4).map(c =>
      `<div class="project-mini-thumb" style="background:${c}"></div>`
    ).join('');

    tile.innerHTML = `
      <div class="project-tile-header" style="background:linear-gradient(135deg,${bgColor}AA,${bg2Color}CC)">
        ${project.coverImage ? `<img src="${project.coverImage}" alt="${project.name}" />` : ''}
        <div class="project-tile-status">
          <span class="status-tag ${statusClass}">${project.status}</span>
        </div>
        ${LCS.state.editMode ? `
          <div style="position:absolute;top:8px;right:8px;z-index:2;display:flex;gap:4px">
            <button class="card-edit-btn edit-btn" style="background:var(--rose-gold);color:white;width:24px;height:24px;border-radius:50%;border:none;cursor:pointer;font-size:0.6rem" data-id="${project.id}"><i class="fas fa-pencil"></i></button>
            <button class="card-edit-btn delete-btn" style="background:#c0392b;color:white;width:24px;height:24px;border-radius:50%;border:none;cursor:pointer;font-size:0.6rem" data-id="${project.id}"><i class="fas fa-trash-alt"></i></button>
          </div>
        ` : ''}
      </div>
      <div class="project-thumbs-row">${thumbsHtml}</div>
      <div class="project-tile-body">
        <div class="project-tile-name">${project.name}</div>
        <div class="project-tile-meta">
          <i class="fas fa-calendar-alt"></i> ${formattedDate}
          <span style="margin:0 4px">·</span>
          <i class="fas fa-layer-group"></i> ${sectionCount} sections
        </div>
        <div class="project-progress">
          <div class="project-progress-fill" style="width:${progress}%"></div>
        </div>
      </div>
    `;

    tile.addEventListener('click', (e) => {
      if (e.target.closest('.card-edit-btn')) return;
      this.openDetail(project.id);
    });

    tile.querySelector('.delete-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
        LCS.projects = LCS.projects.filter(p => p.id !== project.id);
        LCS.save();
        this.renderGallery();
        showToast('Project deleted', 'info');
      }
    });

    tile.querySelector('.edit-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const newName = prompt('Rename project:', project.name);
      if (newName && newName.trim()) {
        project.name = newName.trim();
        LCS.save();
        this.renderGallery();
      }
    });

    return tile;
  },

  // ── Detail View ─────────────────────────────────────────────
  openDetail(projectId) {
    const project = LCS.projects.find(p => p.id === projectId);
    if (!project) return;
    LCS.state.activeProjectId = projectId;

    $('#projects-gallery-view').style.display = 'none';
    const detailView = $('#project-detail-view');
    detailView.style.display = 'block';

    this.renderProjectSidebar(projectId);
    this.renderProjectDetail(project);
  },

  renderProjectSidebar(activeId) {
    const list = $('#project-sidebar-list');
    if (!list) return;
    list.innerHTML = '';
    LCS.projects.forEach(p => {
      const item = document.createElement('li');
      item.className = `sidebar-collection-item${p.id === activeId ? ' active' : ''}`;
      const bg = p.palette?.[0] || '#F2B4C0';
      item.innerHTML = `
        <div class="sidebar-thumb" style="background:${bg}"></div>
        <div class="sidebar-item-info">
          <div class="sidebar-item-name">${p.name}</div>
          <div class="sidebar-item-meta">${p.status}</div>
        </div>
      `;
      item.addEventListener('click', () => this.openDetail(p.id));
      list.appendChild(item);
    });
  },

  renderProjectDetail(project) {
    const main = $('#project-detail-main');
    if (!main) return;

    const palette = project.palette || ['#F9D5D3','#F2B4C0','#CFA18D'];
    const bg1 = palette[0] || '#F2B4C0';
    const bg2 = palette[1] || '#CFA18D';
    const statusClass = LCS.statusClass(project.status);

    // Build header HTML
    let headerHtml = `
      <div class="project-detail-header" style="background:linear-gradient(135deg,${bg1}66,${bg2}AA)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <h2 style="font-family:var(--font-heading);font-size:1.6rem;color:var(--warm-700);margin-bottom:8px">${project.name}</h2>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span class="status-tag ${statusClass}">${project.status}</span>
              ${project.dimensions ? `<span class="detail-meta-item"><i class="fas fa-ruler-combined" style="margin-right:4px"></i>${project.dimensions}</span>` : ''}
              <span class="detail-meta-item"><i class="fas fa-calendar-alt" style="margin-right:4px"></i>Updated ${LCS.formatDate(project.updatedAt)}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn-secondary btn-sm" id="proj-edit-status-btn"><i class="fas fa-tag"></i> Change Status</button>
            <button class="btn-secondary btn-sm" id="proj-add-section-btn"><i class="fas fa-plus"></i> Add Section</button>
            <button class="btn-icon" id="proj-close-btn" title="Back to Projects"><i class="fas fa-arrow-left"></i></button>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px">
          ${palette.map(c => `<div class="palette-dot" style="background:${c};width:28px;height:28px"></div>`).join('')}
        </div>
        <div style="margin-top:10px">
          <div class="project-progress" style="height:6px;max-width:300px">
            <div class="project-progress-fill" style="width:${project.progressPercent || 0}%"></div>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;display:block">${project.progressPercent || 0}% complete</span>
        </div>
      </div>
    `;

    // Sections
    const sectionsHtml = `
      <h3 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--warm-600);margin-bottom:14px">Project Workspace</h3>
      <div class="project-sections-grid" id="project-sections-grid">
        <!-- Sections rendered below -->
      </div>
    `;

    main.innerHTML = headerHtml + sectionsHtml;

    // Wire header buttons
    main.querySelector('#proj-close-btn').addEventListener('click', () => {
      $('#project-detail-view').style.display = 'none';
      $('#projects-gallery-view').style.display = 'block';
    });

    main.querySelector('#proj-edit-status-btn').addEventListener('click', () => {
      const statuses = ['Beginning','In Progress','Finishing','Completed','Paused'];
      const choice = prompt(`Current status: ${project.status}\nChange to:\n${statuses.map((s,i) => `${i+1}. ${s}`).join('\n')}\n(Enter number)`);
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < statuses.length) {
        project.status = statuses[idx];
        LCS.save();
        this.renderProjectDetail(project);
        showToast(`Status updated to "${project.status}"`, 'success');
      }
    });

    main.querySelector('#proj-add-section-btn').addEventListener('click', () => {
      const name = prompt('Section name:');
      if (!name) return;
      const typeChoice = prompt('Section type:\n1. Notes\n2. Checklist\n3. Files\n4. Color Palette\n(Enter number)');
      const typeMap = { '1':'notes','2':'checklist','3':'files','4':'palette' };
      const type = typeMap[typeChoice] || 'notes';
      project.sections = project.sections || [];
      project.sections.push({
        id: LCS.generateId(),
        title: name,
        type,
        content: '',
        items: type === 'checklist' ? [] : undefined,
      });
      LCS.save();
      this.renderProjectSections(project, main.querySelector('#project-sections-grid'));
    });

    // Render sections
    this.renderProjectSections(project, main.querySelector('#project-sections-grid'));
  },

  renderProjectSections(project, grid) {
    if (!grid) return;
    grid.innerHTML = '';

    (project.sections || []).forEach(section => {
      const box = this.buildSectionBox(section, project);
      grid.appendChild(box);
    });

    if (!project.sections || project.sections.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:32px">
          <i class="fas fa-plus-circle empty-icon"></i>
          <p>No sections yet. Click "Add Section" to build your workspace.</p>
        </div>
      `;
    }
  },

  buildSectionBox(section, project) {
    const box = document.createElement('div');
    box.className = 'project-section-box editable-item';
    box.dataset.sectionId = section.id;

    let contentHtml = '';

    switch (section.type) {
      case 'notes':
        contentHtml = `
          <textarea class="project-section-notes" placeholder="Add notes here..." data-section-id="${section.id}"
            rows="4">${section.content || ''}</textarea>
        `;
        break;

      case 'list':
        contentHtml = `
          <textarea class="project-section-notes" placeholder="Add items (one per line)..." data-section-id="${section.id}"
            rows="5">${section.content || ''}</textarea>
        `;
        break;

      case 'checklist':
        const items = section.items || [];
        contentHtml = `
          <div class="checklist-items" data-section-id="${section.id}">
            ${items.map((item, i) => `
              <div class="checklist-item" style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <input type="checkbox" ${item.done ? 'checked' : ''} data-project-id="${project.id}" data-section-id="${section.id}" data-item-index="${i}"
                  style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent)" />
                <span style="font-size:0.85rem;${item.done ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${item.text}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn-secondary btn-sm" style="margin-top:8px" data-add-check="${section.id}">
            <i class="fas fa-plus"></i> Add Item
          </button>
        `;
        break;

      case 'palette':
        const palette = section.palette || project.palette || [];
        contentHtml = `
          <div style="display:flex;gap:8px;flex-wrap:wrap;padding:8px 0">
            ${palette.map(c => `<div style="width:32px;height:32px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.1)" title="${c}"></div>`).join('')}
          </div>
        `;
        break;

      case 'files':
        contentHtml = `
          <div style="padding:12px;border:2px dashed var(--blush-200);border-radius:6px;text-align:center;font-size:0.8rem;color:var(--text-muted)">
            <i class="fas fa-folder-open" style="display:block;font-size:1.5rem;margin-bottom:6px;color:var(--blush-300)"></i>
            Drop files here or browse
          </div>
        `;
        break;

      default:
        contentHtml = `<div class="project-section-content">${section.content || 'Empty section'}</div>`;
    }

    box.innerHTML = `
      <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
      <div class="edit-remove-btn"><i class="fas fa-times"></i></div>
      <div class="project-section-title">
        <i class="${section.icon || 'fas fa-sticky-note'}" style="margin-right:6px;color:var(--accent)"></i>
        ${section.title}
      </div>
      <div class="project-section-content">${contentHtml}</div>
    `;

    // Wire textarea autosave
    const textarea = box.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        section.content = textarea.value;
        LCS.save();
      });
    }

    // Wire checkboxes
    box.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const idx = parseInt(cb.dataset.itemIndex);
        if (section.items && section.items[idx] !== undefined) {
          section.items[idx].done = cb.checked;
          // Update strikethrough
          const span = cb.nextElementSibling;
          if (span) {
            span.style.textDecoration = cb.checked ? 'line-through' : 'none';
            span.style.color = cb.checked ? 'var(--text-muted)' : '';
          }
          // Update progress
          const done = section.items.filter(i => i.done).length;
          project.progressPercent = Math.round((done / section.items.length) * 100);
          LCS.save();
        }
      });
    });

    // Add checklist item button
    const addCheckBtn = box.querySelector('[data-add-check]');
    if (addCheckBtn) {
      addCheckBtn.addEventListener('click', () => {
        const text = prompt('New checklist item:');
        if (!text) return;
        section.items = section.items || [];
        section.items.push({ text, done: false });
        LCS.save();
        const checkList = box.querySelector('.checklist-items');
        const newItem = document.createElement('div');
        newItem.className = 'checklist-item';
        newItem.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
        const idx = section.items.length - 1;
        newItem.innerHTML = `
          <input type="checkbox" data-project-id="${project.id}" data-section-id="${section.id}" data-item-index="${idx}"
            style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent)" />
          <span style="font-size:0.85rem">${text}</span>
        `;
        newItem.querySelector('input').addEventListener('change', (e) => {
          section.items[idx].done = e.target.checked;
          newItem.querySelector('span').style.textDecoration = e.target.checked ? 'line-through' : 'none';
          const done = section.items.filter(i => i.done).length;
          project.progressPercent = Math.round((done / section.items.length) * 100);
          LCS.save();
        });
        checkList.appendChild(newItem);
        showToast('Checklist item added', 'success', 1500);
      });
    }

    // Remove section button
    box.querySelector('.edit-remove-btn').addEventListener('click', () => {
      if (!LCS.state.editMode) return;
      project.sections = project.sections.filter(s => s.id !== section.id);
      LCS.save();
      box.remove();
      showToast(`"${section.title}" removed`, 'info');
    });

    return box;
  }
};
