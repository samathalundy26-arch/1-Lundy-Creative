/* ═══════════════════════════════════════════════════════════════
   INSPIRATION.JS — Whiteboard, Drag & Drop, Folders
   ═══════════════════════════════════════════════════════════════ */

const InspoMgr = {
  initialized: false,
  dragItem: null,
  dragOffsetX: 0,
  dragOffsetY: 0,
  selectedFolderColor: '#F2B4C0',

  init() {
    if (this.initialized) {
      this.renderFolders();
      this.renderWhiteboardItems();
      return;
    }
    this.initialized = true;
    this.setupWhiteboard();
    this.setupFolderActions();
    this.renderFolders();
    this.renderWhiteboardItems();
  },

  // ── Whiteboard Setup ──────────────────────────────────────────
  setupWhiteboard() {
    const canvas = $('#whiteboard-canvas');
    if (!canvas) return;

    // File input for adding images
    const fileInput = $('#wb-file-input');
    $('#add-image-btn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => this.addImageItem(ev.target.result, null);
        reader.readAsDataURL(file);
      });
      fileInput.value = '';
    });

    // Add note
    $('#add-note-btn').addEventListener('click', () => this.addNoteItem());

    // Clear whiteboard
    $('#wb-clear-btn').addEventListener('click', () => {
      if (confirm('Clear all whiteboard items?')) {
        LCS.inspoItems = LCS.inspoItems.filter(i => i.type !== 'image' && i.type !== 'note');
        LCS.save();
        this.renderWhiteboardItems();
        showToast('Whiteboard cleared', 'info');
      }
    });

    // Drag & drop from browser
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-active');
    });
    canvas.addEventListener('dragleave', () => canvas.classList.remove('drag-active'));
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-active');
      const canvasRect = canvas.getBoundingClientRect();

      // Check for image files dropped
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = ev => {
          const x = e.clientX - canvasRect.left + canvas.scrollLeft - 80 + idx * 20;
          const y = e.clientY - canvasRect.top  + canvas.scrollTop  - 60 + idx * 20;
          this.addImageItem(ev.target.result, null, Math.max(20, x), Math.max(20, y));
        };
        reader.readAsDataURL(file);
      });

      // Check for image URLs dragged from browser
      const imgSrc = e.dataTransfer.getData('text/html');
      if (!files.length && imgSrc) {
        const match = imgSrc.match(/src="([^"]+)"/);
        if (match) {
          const x = e.clientX - canvasRect.left + canvas.scrollLeft - 80;
          const y = e.clientY - canvasRect.top  + canvas.scrollTop  - 60;
          this.addImageItem(null, match[1], Math.max(20, x), Math.max(20, y));
        }
      }
    });
  },

  addImageItem(dataUrl, srcUrl, x, y) {
    const canvas = $('#whiteboard-canvas');
    const hint = $('#whiteboard-drop-hint');
    if (hint) hint.style.display = 'none';

    const defaultX = 20 + Math.random() * 200;
    const defaultY = 20 + Math.random() * 150;

    const item = {
      id: LCS.generateId(),
      type: 'image',
      x: x !== undefined ? x : defaultX,
      y: y !== undefined ? y : defaultY,
      w: 200,
      h: 160,
      src: dataUrl || srcUrl,
      folderId: LCS.state.currentInspoFolder,
      label: 'Inspiration image'
    };

    LCS.inspoItems.push(item);
    LCS.save();
    this.renderWhiteboardItem(item, canvas);
    showToast('Image added to board', 'success', 1800);
  },

  addNoteItem() {
    const canvas = $('#whiteboard-canvas');
    const hint = $('#whiteboard-drop-hint');
    if (hint) hint.style.display = 'none';

    const item = {
      id: LCS.generateId(),
      type: 'note',
      x: 30 + Math.random() * 200,
      y: 30 + Math.random() * 150,
      w: 160,
      h: 100,
      text: '',
      folderId: LCS.state.currentInspoFolder,
    };

    LCS.inspoItems.push(item);
    LCS.save();
    this.renderWhiteboardItem(item, canvas);
  },

  renderWhiteboardItems() {
    const canvas = $('#whiteboard-canvas');
    if (!canvas) return;

    // Remove all existing wb-items
    $$('.wb-item').forEach(i => i.remove());

    const hint = $('#whiteboard-drop-hint');
    const filtered = LCS.inspoItems.filter(i =>
      !LCS.state.currentInspoFolder || i.folderId === LCS.state.currentInspoFolder
    );

    if (filtered.length === 0) {
      if (hint) hint.style.display = 'block';
    } else {
      if (hint) hint.style.display = 'none';
      filtered.forEach(item => this.renderWhiteboardItem(item, canvas));
    }
  },

  renderWhiteboardItem(item, canvas) {
    const wbEl = document.createElement('div');
    wbEl.className = item.type === 'note' ? 'wb-item wb-note' : 'wb-item';
    wbEl.dataset.itemId = item.id;
    wbEl.style.left   = item.x + 'px';
    wbEl.style.top    = item.y + 'px';
    wbEl.style.width  = item.w + 'px';
    wbEl.style.height = item.h + 'px';

    if (item.type === 'image') {
      wbEl.innerHTML = `
        <img src="${item.src || ''}" alt="${item.label}" style="width:100%;height:100%;object-fit:cover;display:block" />
        <div class="wb-item-controls">
          <button class="wb-ctrl-btn move-folder" title="Move to folder"><i class="fas fa-folder-open"></i></button>
          <button class="wb-ctrl-btn remove" title="Remove"><i class="fas fa-times"></i></button>
        </div>
      `;
    } else {
      wbEl.innerHTML = `
        <div class="wb-item-controls">
          <button class="wb-ctrl-btn remove" title="Remove"><i class="fas fa-times"></i></button>
        </div>
        <textarea class="wb-note-input" placeholder="Add a note..." style="width:100%;min-height:70px;background:transparent;border:none;outline:none;font-family:var(--font-body);font-size:0.85rem;resize:both;color:var(--warm-700);line-height:1.5">${item.text || ''}</textarea>
      `;

      const textarea = wbEl.querySelector('textarea');
      textarea.addEventListener('input', () => {
        item.text = textarea.value;
        LCS.save();
      });
    }

    // Remove button
    wbEl.querySelector('.wb-ctrl-btn.remove')?.addEventListener('click', () => {
      LCS.inspoItems = LCS.inspoItems.filter(i => i.id !== item.id);
      LCS.save();
      wbEl.remove();
      if (!canvas.querySelectorAll('.wb-item').length) {
        $('#whiteboard-drop-hint').style.display = 'block';
      }
    });

    // Move to folder button
    wbEl.querySelector('.wb-ctrl-btn.move-folder')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showFolderPicker(item, e);
    });

    // Make item draggable within canvas
    this.makeItemDraggable(wbEl, item, canvas);

    canvas.appendChild(wbEl);
  },

  makeItemDraggable(el, item, canvas) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    el.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I' || e.target.tagName === 'TEXTAREA') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = item.x;
      startTop  = item.y;
      el.classList.add('selected');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      item.x = Math.max(0, startLeft + dx);
      item.y = Math.max(0, startTop  + dy);
      el.style.left = item.x + 'px';
      el.style.top  = item.y + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        LCS.save();
      }
    });
  },

  showFolderPicker(item, e) {
    // Simple folder selection via prompt-like dialog
    const folderNames = LCS.inspoFolders.map((f, i) => `${i+1}. ${f.name}`).join('\n');
    const choice = prompt(`Move to folder:\n${folderNames}\n(Enter folder number, or 0 for no folder)`);
    if (choice === null) return;
    const idx = parseInt(choice) - 1;
    if (choice === '0') {
      item.folderId = null;
      showToast('Removed from folder', 'info');
    } else if (idx >= 0 && idx < LCS.inspoFolders.length) {
      item.folderId = LCS.inspoFolders[idx].id;
      showToast(`Moved to "${LCS.inspoFolders[idx].name}"`, 'success');
    }
    LCS.save();
    this.renderFolders();
  },

  // ── Folders ───────────────────────────────────────────────────
  setupFolderActions() {
    // New folder button
    $('#new-inspo-folder-btn').addEventListener('click', () => {
      InspoMgr.selectedFolderColor = '#F2B4C0';
      $$('.folder-color-swatch').forEach(s => s.classList.remove('selected'));
      const firstSwatch = $('.folder-color-swatch');
      if (firstSwatch) firstSwatch.classList.add('selected');
      openModal('modal-new-inspo-folder');
      setTimeout(() => $('#inspo-folder-name').focus(), 100);
    });

    // Folder color swatches
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('folder-color-swatch')) {
        $$('.folder-color-swatch').forEach(s => s.classList.remove('selected'));
        e.target.classList.add('selected');
        InspoMgr.selectedFolderColor = e.target.dataset.color;
      }
    });

    // Save folder
    $('#save-inspo-folder-btn').addEventListener('click', () => {
      const name = $('#inspo-folder-name').value.trim();
      if (!name) { showToast('Enter a folder name', 'error'); return; }

      const folder = {
        id: LCS.generateId(),
        name,
        color: InspoMgr.selectedFolderColor || '#F2B4C0',
        count: 0
      };

      LCS.inspoFolders.push(folder);
      LCS.save();
      closeModal('modal-new-inspo-folder');
      $('#inspo-folder-name').value = '';
      InspoMgr.renderFolders();
      showToast(`Folder "${name}" created`, 'success');
    });
  },

  renderFolders() {
    const list = $('#inspo-folders-list');
    if (!list) return;
    list.innerHTML = '';

    // "All Items" folder
    const allItem = document.createElement('div');
    allItem.className = `inspo-folder-item${LCS.state.currentInspoFolder === null ? ' active' : ''}`;
    allItem.innerHTML = `
      <div class="inspo-folder-icon"><i class="fas fa-border-all" style="color:var(--rose-gold)"></i></div>
      <div class="inspo-folder-info">
        <div class="inspo-folder-name">All Items</div>
        <div class="inspo-folder-count">${LCS.inspoItems.length} items</div>
      </div>
    `;
    allItem.addEventListener('click', () => {
      LCS.state.currentInspoFolder = null;
      this.renderFolders();
      this.renderWhiteboardItems();
    });
    list.appendChild(allItem);

    LCS.inspoFolders.forEach(folder => {
      const count = LCS.inspoItems.filter(i => i.folderId === folder.id).length;
      const item = document.createElement('div');
      item.className = `inspo-folder-item${LCS.state.currentInspoFolder === folder.id ? ' active' : ''}`;
      item.innerHTML = `
        <div class="inspo-folder-icon"><i class="fas fa-folder" style="color:${folder.color}"></i></div>
        <div class="inspo-folder-info">
          <div class="inspo-folder-name">${folder.name}</div>
          <div class="inspo-folder-count">${count} items</div>
        </div>
        <div class="inspo-folder-actions">
          <button class="btn-icon" style="width:24px;height:24px;font-size:0.7rem" title="Delete folder">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.inspo-folder-actions')) return;
        LCS.state.currentInspoFolder = folder.id;
        this.renderFolders();
        this.renderWhiteboardItems();
      });

      item.querySelector('.inspo-folder-actions button').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete folder "${folder.name}"? Items will remain on the board.`)) {
          LCS.inspoFolders = LCS.inspoFolders.filter(f => f.id !== folder.id);
          LCS.inspoItems.forEach(i => { if (i.folderId === folder.id) i.folderId = null; });
          LCS.save();
          if (LCS.state.currentInspoFolder === folder.id) LCS.state.currentInspoFolder = null;
          this.renderFolders();
          showToast(`Folder "${folder.name}" deleted`, 'info');
        }
      });

      list.appendChild(item);
    });
  }
};
