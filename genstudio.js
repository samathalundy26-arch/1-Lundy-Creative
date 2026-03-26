/* ═══════════════════════════════════════════════════════════════
   GENSTUDIO.JS — Gen Studio: AI Programs, Visual Library,
   Skill Binders, Notebooks, Worksheet Generator, Prompt Helper,
   Brand Kit, Studio Dashboard
   ═══════════════════════════════════════════════════════════════ */

const GenStudioMgr = {

  initialized: false,
  activePage: 'dashboard',
  samMode: false,
  activeBinderId: null,
  activeBinderTab: null,
  activeVariant: 'short',
  wsColor: '#CFA18D',
  aiColor: '#CFA18D',
  binderColor: '#CFA18D',
  nbColor: '#CFA18D',
  variants: null,

  /* ────────────────────────────────────────────
     INIT
  ──────────────────────────────────────────── */
  init() {
    if (!this.initialized) {
      this.seedData();
      this.setupSpineNav();
      this.setupAISection();
      this.setupLibrarySection();
      this.setupBinderSection();
      this.setupNotebookSection();
      this.setupWorksheetSection();
      this.setupPromptHelper();
      this.setupSlidePanel();
      this.setupStatCards();
      this.initialized = true;
    }
    this.showPage(this.activePage);
    this.renderDashboard();
  },

  /* ────────────────────────────────────────────
     DATA SEED
  ──────────────────────────────────────────── */
  seedData() {
    const gs = this.getData();
    if (gs.aiPrograms && gs.aiPrograms.length > 0) return; // already seeded

    const seed = {
      aiPrograms: [
        { id:'ai_001', name:'Microsoft Copilot', desc:'Writing, research, and creative brainstorming', tags:['Writing','Research','Brainstorming'], color:'#1A2744', icon:'🤖', counts:{documents:12,images:3,prompts:8,notes:5}, created: Date.now() },
        { id:'ai_002', name:'Adobe Firefly', desc:'Image generation and creative effects', tags:['Images','Design','Foiling'], color:'#E8647A', icon:'🔥', counts:{documents:4,images:28,prompts:15,notes:2}, created: Date.now() },
        { id:'ai_003', name:'ChatGPT', desc:'All-purpose writing, coding, and ideation', tags:['Writing','Coding','Ideas'], color:'#4BA67C', icon:'💬', counts:{documents:18,images:0,prompts:22,notes:11}, created: Date.now() },
        { id:'ai_004', name:'Midjourney', desc:'Fashion illustrations and artistic imagery', tags:['Images','Illustration','Fashion'], color:'#7B5EA7', icon:'🎨', counts:{documents:2,images:47,prompts:30,notes:8}, created: Date.now() },
        { id:'ai_005', name:'Canva AI', desc:'Graphic design and template creation', tags:['Design','Templates','Branding'], color:'#FF7055', icon:'🖌️', counts:{documents:9,images:14,prompts:6,notes:3}, created: Date.now() },
        { id:'ai_006', name:'Google Gemini', desc:'Research, planning, and app development', tags:['Research','Coding','Planning'], color:'#2EB8B8', icon:'💎', counts:{documents:7,images:1,prompts:11,notes:6}, created: Date.now() },
        { id:'ai_007', name:'Ask Anything', desc:'Quick question and answer AI assistant', tags:['Q&A','Research'], color:'#5B8DEF', icon:'❓', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_008', name:'DeepAI Chat', desc:'AI chat for creative ideas and content generation', tags:['Writing','Ideas','Creative'], color:'#E8647A', icon:'🌊', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_009', name:'DeepSeek', desc:'Advanced AI for research, reasoning, and coding', tags:['Research','Coding','Analysis'], color:'#4A90D9', icon:'🔭', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_010', name:'NotebookLM', desc:'Google AI for summarizing and organizing documents', tags:['Research','Summarizing','Notes'], color:'#4BA67C', icon:'📒', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_011', name:'M365 Copilot', desc:'Microsoft AI built into Word, Excel, PowerPoint', tags:['Documents','Office','Presentations'], color:'#1A2744', icon:'💼', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_012', name:'Genspark', desc:'AI-powered research and content creation platform', tags:['Research','Content','Writing'], color:'#FF7055', icon:'⚡', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_013', name:'Skywork', desc:'AI assistant for professional and creative tasks', tags:['Writing','Professional','Creative'], color:'#7B5EA7', icon:'🌤️', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_014', name:'Wispr Flow', desc:'AI-powered voice-to-text for hands-free dictation', tags:['Voice','Dictation','Accessibility'], color:'#2EB8B8', icon:'🎙️', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_015', name:'Notion AI', desc:'AI features built into Notion — writing, summarizing, organizing', tags:['Organization','Writing','Notes'], color:'#111111', icon:'📋', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_016', name:'Milanote', desc:'AI-assisted creative organization and visual moodboards', tags:['Moodboards','Creative','Visual'], color:'#F5A623', icon:'🗃️', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_017', name:'Manus', desc:'AI writing and creative tool for long-form content', tags:['Writing','Creative','Long-form'], color:'#9B59B6', icon:'✍️', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() },
        { id:'ai_018', name:'Firebase Studio', desc:'AI-augmented dev tooling for building and deploying apps', tags:['Coding','App Dev','Backend'], color:'#FFA000', icon:'🔧', counts:{documents:0,images:0,prompts:0,notes:0}, created: Date.now() }
      ],
      libraryItems: [
        { id:'lib_001', title:'Rose Gold Foil Fashion Figure', type:'image', source:'Midjourney', fileType:'PNG', tags:['foiling','fashion','rose gold'], notes:'Used for paper pad cover', created: Date.now() },
        { id:'lib_002', title:'Floral Pattern — Blush Summer', type:'pattern', source:'Adobe Firefly', fileType:'SVG', tags:['floral','blush','summer'], notes:'Repeating background pattern', created: Date.now() },
        { id:'lib_003', title:'Foiling Technique Guide', type:'worksheet', source:'ChatGPT', fileType:'PDF', tags:['foiling','technique','tutorial'], notes:'Step-by-step hot foiling steps', created: Date.now() },
        { id:'lib_004', title:'Elegant Script Prompt Pack', type:'prompt', source:'ChatGPT', fileType:'TXT', tags:['prompts','design','script'], notes:'8 prompts for elegant script imagery', created: Date.now() },
        { id:'lib_005', title:'Gold Foil Stencil Layer', type:'foil', source:'Canva AI', fileType:'SVG', tags:['foil','stencil','gold'], notes:'Ready for foil press machine', created: Date.now() },
        { id:'lib_006', title:'Autumn Harvest Palette Template', type:'template', source:'Canva AI', fileType:'PDF', tags:['autumn','harvest','palette'], notes:'12×12 layout template', created: Date.now() },
        { id:'lib_007', title:'Ocean Dreams Illustration', type:'image', source:'Midjourney', fileType:'JPG', tags:['ocean','watercolor','dreams'], notes:'Dreamy ocean scene illustration', created: Date.now() },
        { id:'lib_008', title:'Midnight Garden Pattern', type:'pattern', source:'Adobe Firefly', fileType:'PNG', tags:['midnight','garden','dark'], notes:'Deep navy botanical repeating', created: Date.now() }
      ],
      binders: [
        { id:'bnd_001', title:'Foiling Techniques', subject:'Foiling & Embellishments', color:'#D4A851', tabs:[
          { id:'tab_001', label:'Getting Started', pages:[{id:'pg_001',type:'Tutorial',title:'Hot Foil Basics',content:'Start with a clean, dry surface...'},{id:'pg_002',type:'Notes',title:'Supply List',content:''}] },
          { id:'tab_002', label:'Techniques', pages:[{id:'pg_003',type:'Worksheet',title:'Foiling Checklist',content:''}] },
          { id:'tab_003', label:'References', pages:[{id:'pg_004',type:'Reference',title:'Brand Color Codes',content:''}] }
        ], created: Date.now() },
        { id:'bnd_002', title:'App Development', subject:'Firebase & Coding', color:'#FFA000', tabs:[
          { id:'tab_004', label:'Architecture', pages:[{id:'pg_005',type:'Notes',title:'Project Notes',content:''}] },
          { id:'tab_005', label:'Prompts', pages:[{id:'pg_006',type:'Prompt',title:'Code Gen Prompts',content:''}] }
        ], created: Date.now() },
        { id:'bnd_003', title:'Paper Crafting', subject:'Paper Pad Design', color:'#E8647A', tabs:[
          { id:'tab_006', label:'Designs', pages:[{id:'pg_007',type:'Worksheet',title:'Design Checklist',content:''}] },
          { id:'tab_007', label:'Printing', pages:[{id:'pg_008',type:'Tutorial',title:'Print Settings',content:''}] }
        ], created: Date.now() },
        { id:'bnd_004', title:'Prompt Writing', subject:'AI Prompt Engineering', color:'#7B5EA7', tabs:[
          { id:'tab_008', label:'SAM Mode', pages:[{id:'pg_009',type:'Technique',title:'SAM Mode Guidelines',content:'Bold, visual, aesthetically aligned...'}] }
        ], created: Date.now() },
        { id:'bnd_005', title:'Digital Design', subject:'Digital Tools & Workflow', color:'#2EB8B8', tabs:[
          { id:'tab_009', label:'Workflow', pages:[{id:'pg_010',type:'Notes',title:'My Workflow',content:''}] }
        ], created: Date.now() }
      ],
      notebooks: [
        { id:'nb_001', name:'Inspiration Folder', type:'folder', color:'#CFA18D', pages:5, created: Date.now() },
        { id:'nb_002', name:'Spring Sketchbook', type:'sketchbook', color:'#B5C9A1', pages:24, created: Date.now() },
        { id:'nb_003', name:'Design Notes', type:'spiral', color:'#F2B4C0', pages:48, created: Date.now() },
        { id:'nb_004', name:'Autumn Harvest Pad', type:'scrapbook', color:'#D4A851', pages:12, created: Date.now() },
        { id:'nb_005', name:'Ocean Dreams Journal', type:'spiral', color:'#2EB8B8', pages:32, created: Date.now() },
        { id:'nb_006', name:'Project Files', type:'folder', color:'#7B5EA7', pages:0, created: Date.now() },
        { id:'nb_007', name:'Foil Studio Notes', type:'sketchbook', color:'#FF7055', pages:16, created: Date.now() },
        { id:'nb_008', name:'Midnight Garden Pad', type:'scrapbook', color:'#1A2744', pages:12, created: Date.now() }
      ],
      savedPrompts: [],
      worksheets: []
    };

    this.saveData(seed);
  },

  getData() {
    try { return JSON.parse(localStorage.getItem('lcs_genstudio') || '{}'); } catch(e) { return {}; }
  },

  saveData(data) {
    localStorage.setItem('lcs_genstudio', JSON.stringify(data));
  },

  updateData(key, value) {
    const d = this.getData();
    d[key] = value;
    this.saveData(d);
  },

  genId(prefix = 'gs') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2,6)}`;
  },

  /* ────────────────────────────────────────────
     SPINE NAVIGATION
  ──────────────────────────────────────────── */
  setupSpineNav() {
    const btns = document.querySelectorAll('.gen-spine-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.showPage(btn.dataset.genPage);
      });
    });

    // Quick action buttons on dashboard
    document.addEventListener('click', e => {
      const qa = e.target.closest('[data-gen-page]');
      if (qa && qa.closest('#section-genstudio') && !qa.closest('.gen-spine-nav')) {
        this.showPage(qa.dataset.genPage);
      }
    });
  },

  showPage(pageId) {
    this.activePage = pageId;
    document.querySelectorAll('.gen-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.gen-spine-btn').forEach(b => b.classList.remove('active'));

    const page = document.getElementById(`gen-page-${pageId}`);
    if (page) page.classList.add('active');

    const btn = document.querySelector(`.gen-spine-btn[data-gen-page="${pageId}"]`);
    if (btn) btn.classList.add('active');

    // Render page content
    const renderMap = {
      'dashboard':      () => this.renderDashboard(),
      'ai-programs':    () => this.renderAIPrograms(),
      'visual-library': () => this.renderLibrary(),
      'skill-binders':  () => this.renderBinderShelf(),
      'notebooks':      () => this.renderNotebooks(),
      'worksheet':      () => this.updateWorksheetPreview(),
      'prompt-helper':  () => this.renderSavedPrompts(),
      'brand-kit':      () => {},
    };
    if (renderMap[pageId]) renderMap[pageId]();
  },

  /* ────────────────────────────────────────────
     DASHBOARD
  ──────────────────────────────────────────── */
  renderDashboard() {
    const d = this.getData();

    // Set date
    const dateEl = document.getElementById('gen-today-date');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = `${now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})} — your creative space is ready.`;
    }

    // Stats
    const stats = {
      'stat-library':   (d.libraryItems||[]).length,
      'stat-ai':        (d.aiPrograms||[]).length,
      'stat-prompts':   (d.savedPrompts||[]).length,
      'stat-binders':   (d.binders||[]).length,
      'stat-notebooks': (d.notebooks||[]).length,
      'stat-worksheets':(d.worksheets||[]).length,
    };
    Object.entries(stats).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    // Recently added — merge all items with timestamps, take last 8
    const recent = [];
    (d.aiPrograms||[]).forEach(x => recent.push({title:x.name, type:'AI Program', icon:x.icon, color:x.color, ts:x.created||0}));
    (d.libraryItems||[]).forEach(x => recent.push({title:x.title, type:this.libTypeLabel(x.type), icon:this.libTypeIcon(x.type), color:'#CFA18D', ts:x.created||0}));
    (d.binders||[]).forEach(x => recent.push({title:x.title, type:'Skill Binder', icon:'📚', color:x.color, ts:x.created||0}));
    (d.savedPrompts||[]).forEach(x => recent.push({title:x.title||'Saved Prompt', type:'Prompt', icon:'✨', color:'#7B5EA7', ts:x.created||0}));
    recent.sort((a,b) => b.ts - a.ts);
    const top = recent.slice(0,8);

    const grid = document.getElementById('gen-recent-grid');
    if (grid) {
      if (top.length === 0) {
        grid.innerHTML = '<p class="gen-empty-hint">Create your first item to see it here.</p>';
      } else {
        grid.innerHTML = top.map(item => `
          <div class="gen-recent-card" style="--rc:${item.color}">
            <div class="gen-recent-icon">${item.icon}</div>
            <div class="gen-recent-info">
              <div class="gen-recent-title">${item.title}</div>
              <div class="gen-recent-type">${item.type}</div>
            </div>
          </div>
        `).join('');
      }
    }
  },

  setupStatCards() {
    // Stat cards on dashboard navigate to section
    document.querySelectorAll('.gen-stat-card[data-gen-page]').forEach(card => {
      card.style.cursor = 'pointer';
    });
  },

  /* ────────────────────────────────────────────
     AI PROGRAMS
  ──────────────────────────────────────────── */
  setupAISection() {
    const addBtn = document.getElementById('add-ai-btn');
    if (addBtn) addBtn.addEventListener('click', () => {
      document.getElementById('ai-name').value = '';
      document.getElementById('ai-desc').value = '';
      document.getElementById('ai-tags').value = '';
      document.getElementById('ai-icon').value = '🤖';
      this.aiColor = '#CFA18D';
      this.resetColorSwatches('ai-color-row', '#CFA18D');
      openModal('modal-add-ai');
    });

    // Color swatches
    this.setupColorSwatches('ai-color-row', (c) => { this.aiColor = c; });

    const saveBtn = document.getElementById('ai-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const name = document.getElementById('ai-name').value.trim();
      if (!name) { showToast('Program name is required', 'warning'); return; }
      const d = this.getData();
      d.aiPrograms = d.aiPrograms || [];
      d.aiPrograms.push({
        id: this.genId('ai'),
        name,
        desc: document.getElementById('ai-desc').value.trim(),
        tags: document.getElementById('ai-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
        icon: document.getElementById('ai-icon').value.trim() || '🤖',
        color: this.aiColor,
        counts: {documents:0,images:0,prompts:0,notes:0},
        created: Date.now()
      });
      this.saveData(d);
      closeModal('modal-add-ai');
      this.renderAIPrograms();
      showToast(`${name} added to AI Programs`, 'success');
    });
  },

  renderAIPrograms() {
    const d = this.getData();
    const grid = document.getElementById('gen-ai-grid');
    if (!grid) return;
    const programs = d.aiPrograms || [];

    grid.innerHTML = programs.map(ai => {
      const tagHtml = (ai.tags||[]).map(t => `<span class="gen-ai-tag">${t}</span>`).join('');
      const total = Object.values(ai.counts||{}).reduce((s,v) => s+v, 0);
      return `
        <div class="gen-ai-card" data-ai-id="${ai.id}" style="--ai-color:${ai.color}">
          <div class="gen-ai-card-top">
            <div class="gen-ai-icon-wrap">${ai.icon}</div>
            <div class="gen-ai-card-info">
              <div class="gen-ai-name">${ai.name}</div>
              <div class="gen-ai-desc">${ai.desc}</div>
            </div>
            ${LCS && LCS.state && LCS.state.editMode ? `<button class="gen-delete-btn" data-del-ai="${ai.id}" title="Delete"><i class="fas fa-times"></i></button>` : ''}
          </div>
          <div class="gen-ai-tags">${tagHtml}</div>
          <div class="gen-ai-counts">
            <div class="gen-ai-count-item"><span>${ai.counts.documents}</span><small>Docs</small></div>
            <div class="gen-ai-count-item"><span>${ai.counts.images}</span><small>Images</small></div>
            <div class="gen-ai-count-item"><span>${ai.counts.prompts}</span><small>Prompts</small></div>
            <div class="gen-ai-count-item"><span>${ai.counts.notes}</span><small>Notes</small></div>
          </div>
          <button class="gen-ai-open-btn" data-open-ai="${ai.id}">View Details <i class="fas fa-arrow-right"></i></button>
        </div>
      `;
    }).join('');

    // Wire open buttons
    grid.querySelectorAll('[data-open-ai]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.openAISlide(btn.dataset.openAi);
      });
    });

    // Wire delete buttons
    grid.querySelectorAll('[data-del-ai]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Delete this AI program?')) return;
        const d2 = this.getData();
        d2.aiPrograms = d2.aiPrograms.filter(a => a.id !== btn.dataset.delAi);
        this.saveData(d2);
        this.renderAIPrograms();
        showToast('AI Program removed', 'info');
      });
    });

    // Card click → slide
    grid.querySelectorAll('.gen-ai-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-del-ai]') || e.target.closest('[data-open-ai]')) return;
        this.openAISlide(card.dataset.aiId);
      });
    });
  },

  openAISlide(aiId) {
    const d = this.getData();
    const ai = (d.aiPrograms||[]).find(a => a.id === aiId);
    if (!ai) return;

    const panel = document.getElementById('gen-slide-panel');
    const content = document.getElementById('gen-slide-content');
    if (!panel || !content) return;

    const storageItems = ['Documents','Images','Prompts','Notes','Exports','Templates','Foil Layers'];
    const storageHtml = storageItems.map(s => `
      <div class="gen-slide-storage-item">
        <i class="fas fa-folder" style="color:${ai.color}"></i>
        <span>${s}</span>
        <span class="gen-slide-storage-count">0 items</span>
      </div>
    `).join('');

    content.innerHTML = `
      <div class="gen-slide-ai-header" style="--ai-color:${ai.color}">
        <div class="gen-slide-ai-icon">${ai.icon}</div>
        <div>
          <div class="gen-slide-ai-name">${ai.name}</div>
          <div class="gen-slide-ai-desc">${ai.desc}</div>
          <div class="gen-slide-ai-tags">${(ai.tags||[]).map(t=>`<span class="gen-ai-tag">${t}</span>`).join('')}</div>
        </div>
      </div>
      <div class="gen-slide-counts-row">
        <div class="gen-slide-count-box"><div>${ai.counts.documents}</div><small>Docs</small></div>
        <div class="gen-slide-count-box"><div>${ai.counts.images}</div><small>Images</small></div>
        <div class="gen-slide-count-box"><div>${ai.counts.prompts}</div><small>Prompts</small></div>
        <div class="gen-slide-count-box"><div>${ai.counts.notes}</div><small>Notes</small></div>
      </div>
      <div class="gen-slide-section-label">STORAGE SECTIONS</div>
      <div class="gen-slide-storage">${storageHtml}</div>
      <div class="gen-slide-section-label" style="margin-top:16px">QUICK ACTIONS</div>
      <div class="gen-slide-qa-row">
        <button class="gen-filter-chip" onclick="GenStudioMgr.showPage('prompt-helper')"><i class="fas fa-magic"></i> New Prompt</button>
        <button class="gen-filter-chip" onclick="GenStudioMgr.showPage('worksheet')"><i class="fas fa-file-alt"></i> New Worksheet</button>
        <button class="gen-filter-chip" onclick="GenStudioMgr.showPage('visual-library')"><i class="fas fa-images"></i> View Library</button>
      </div>
    `;
    panel.classList.add('open');
  },

  setupSlidePanel() {
    const closeBtn = document.getElementById('gen-slide-close');
    if (closeBtn) closeBtn.addEventListener('click', () => {
      document.getElementById('gen-slide-panel').classList.remove('open');
    });
  },

  /* ────────────────────────────────────────────
     VISUAL LIBRARY
  ──────────────────────────────────────────── */
  setupLibrarySection() {
    const addBtn = document.getElementById('add-lib-item-btn');
    if (addBtn) addBtn.addEventListener('click', () => {
      ['lib-title','lib-filetype','lib-tags','lib-notes'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
      });
      openModal('modal-add-lib');
    });

    const saveBtn = document.getElementById('lib-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const title = document.getElementById('lib-title').value.trim();
      if (!title) { showToast('Title is required', 'warning'); return; }
      const d = this.getData();
      d.libraryItems = d.libraryItems || [];
      d.libraryItems.push({
        id: this.genId('lib'),
        title,
        type: document.getElementById('lib-type').value,
        source: document.getElementById('lib-source').value,
        fileType: document.getElementById('lib-filetype').value.trim() || 'PNG',
        tags: document.getElementById('lib-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
        notes: document.getElementById('lib-notes').value.trim(),
        created: Date.now()
      });
      this.saveData(d);
      closeModal('modal-add-lib');
      this.renderLibrary();
      showToast(`${title} added to Visual Library`, 'success');
    });

    // Filter chips
    document.querySelectorAll('#gen-lib-filters .gen-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#gen-lib-filters .gen-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderLibrary(chip.dataset.libFilter);
      });
    });

    // Search
    const search = document.getElementById('gen-lib-search');
    if (search) search.addEventListener('input', () => {
      const activeFilter = document.querySelector('#gen-lib-filters .gen-filter-chip.active');
      this.renderLibrary(activeFilter ? activeFilter.dataset.libFilter : 'all', search.value);
    });
  },

  renderLibrary(filter = 'all', search = '') {
    const d = this.getData();
    const grid = document.getElementById('gen-lib-grid');
    if (!grid) return;

    let items = d.libraryItems || [];
    if (filter && filter !== 'all') items = items.filter(i => i.type === filter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || (i.tags||[]).some(t => t.toLowerCase().includes(q)) || (i.source||'').toLowerCase().includes(q));
    }

    if (items.length === 0) {
      grid.innerHTML = '<p class="gen-empty-hint">No items found. Add your first library item.</p>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="gen-lib-card" data-lib-id="${item.id}">
        <div class="gen-lib-card-top">
          <div class="gen-lib-type-badge gen-lib-type-${item.type}">${this.libTypeLabel(item.type)}</div>
          <div class="gen-lib-file-badge">${item.fileType||'FILE'}</div>
          ${LCS && LCS.state && LCS.state.editMode ? `<button class="gen-delete-btn gen-delete-lib" data-del-lib="${item.id}" title="Delete"><i class="fas fa-times"></i></button>` : ''}
        </div>
        <div class="gen-lib-icon">${this.libTypeIcon(item.type)}</div>
        <div class="gen-lib-title">${item.title}</div>
        <div class="gen-lib-source">via ${item.source||'Unknown'}</div>
        <div class="gen-lib-tags">${(item.tags||[]).slice(0,3).map(t=>`<span class="gen-ai-tag">${t}</span>`).join('')}</div>
        ${item.notes ? `<div class="gen-lib-notes">${item.notes}</div>` : ''}
      </div>
    `).join('');

    // Delete buttons
    grid.querySelectorAll('[data-del-lib]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Remove this item from the library?')) return;
        const d2 = this.getData();
        d2.libraryItems = d2.libraryItems.filter(i => i.id !== btn.dataset.delLib);
        this.saveData(d2);
        this.renderLibrary(filter, search);
        showToast('Item removed', 'info');
      });
    });
  },

  libTypeLabel(type) {
    const m = {image:'Image',worksheet:'Worksheet',prompt:'Prompt',foil:'Foil Layer',pattern:'Pattern',template:'Template'};
    return m[type] || type;
  },

  libTypeIcon(type) {
    const m = {image:'🖼️',worksheet:'📄',prompt:'✨',foil:'✦',pattern:'🔷',template:'📐'};
    return m[type] || '📁';
  },

  /* ────────────────────────────────────────────
     SKILL BINDERS
  ──────────────────────────────────────────── */
  setupBinderSection() {
    const addBtn = document.getElementById('add-binder-btn');
    if (addBtn) addBtn.addEventListener('click', () => {
      ['binder-title','binder-subject'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
      });
      this.binderColor = '#CFA18D';
      this.resetColorSwatches('binder-color-row', '#CFA18D');
      openModal('modal-add-binder');
    });

    this.setupColorSwatches('binder-color-row', (c) => { this.binderColor = c; });

    const saveBtn = document.getElementById('binder-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const title = document.getElementById('binder-title').value.trim();
      if (!title) { showToast('Binder title is required', 'warning'); return; }
      const d = this.getData();
      d.binders = d.binders || [];
      const newBinder = {
        id: this.genId('bnd'),
        title,
        subject: document.getElementById('binder-subject').value.trim(),
        color: this.binderColor,
        tabs: [{ id: this.genId('tab'), label: 'Main', pages: [] }],
        created: Date.now()
      };
      d.binders.push(newBinder);
      this.saveData(d);
      closeModal('modal-add-binder');
      this.renderBinderShelf();
      this.openBinder(newBinder.id);
      showToast(`${title} binder created`, 'success');
    });
  },

  renderBinderShelf() {
    const d = this.getData();
    const shelf = document.getElementById('gen-binder-shelf');
    if (!shelf) return;
    const binders = d.binders || [];

    shelf.innerHTML = binders.map(b => `
      <div class="gen-binder-spine ${this.activeBinderId === b.id ? 'active' : ''}" data-binder-id="${b.id}" style="--bc:${b.color}">
        <div class="gen-binder-spine-color"></div>
        <div class="gen-binder-spine-text">
          <span class="gen-binder-spine-title">${b.title}</span>
          <span class="gen-binder-spine-sub">${b.subject || ''}</span>
        </div>
        ${LCS && LCS.state && LCS.state.editMode ? `<button class="gen-delete-btn gen-delete-binder" data-del-binder="${b.id}"><i class="fas fa-times"></i></button>` : ''}
      </div>
    `).join('') + (binders.length === 0 ? '<p class="gen-empty-hint">No binders yet. Create your first!</p>' : '');

    shelf.querySelectorAll('.gen-binder-spine').forEach(spine => {
      spine.addEventListener('click', e => {
        if (e.target.closest('[data-del-binder]')) return;
        this.openBinder(spine.dataset.binderId);
      });
    });

    shelf.querySelectorAll('[data-del-binder]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Delete this binder?')) return;
        const d2 = this.getData();
        d2.binders = d2.binders.filter(b => b.id !== btn.dataset.delBinder);
        this.saveData(d2);
        if (this.activeBinderId === btn.dataset.delBinder) this.activeBinderId = null;
        this.renderBinderShelf();
        if (!this.activeBinderId) {
          const detail = document.getElementById('gen-binder-detail');
          if (detail) detail.innerHTML = '<div class="gen-binder-empty"><i class="fas fa-book-open"></i><p>Select a binder from the shelf</p></div>';
        }
        showToast('Binder deleted', 'info');
      });
    });
  },

  openBinder(binderId) {
    const d = this.getData();
    const binder = (d.binders||[]).find(b => b.id === binderId);
    if (!binder) return;
    this.activeBinderId = binderId;
    this.activeBinderTab = binder.tabs[0]?.id || null;
    this.renderBinderShelf();
    this.renderBinderDetail(binder);
  },

  renderBinderDetail(binder) {
    const detail = document.getElementById('gen-binder-detail');
    if (!detail) return;

    const tabsHtml = (binder.tabs||[]).map(tab => `
      <button class="gen-binder-tab ${this.activeBinderTab === tab.id ? 'active' : ''}" data-tab-id="${tab.id}" style="--bc:${binder.color}">
        ${tab.label}
        ${LCS && LCS.state && LCS.state.editMode ? `<span class="gen-tab-del" data-del-tab="${tab.id}">×</span>` : ''}
      </button>
    `).join('');

    const activeTab = (binder.tabs||[]).find(t => t.id === this.activeBinderTab);
    const pagesHtml = activeTab ? (activeTab.pages||[]).map(pg => `
      <div class="gen-binder-page" data-pg-id="${pg.id}">
        <div class="gen-binder-page-header">
          <div>
            <span class="gen-page-type-badge">${pg.type}</span>
            <input class="gen-binder-page-title-input" value="${pg.title}" data-save-pg="${pg.id}" />
          </div>
          ${LCS && LCS.state && LCS.state.editMode ? `<button class="gen-delete-btn" data-del-pg="${pg.id}"><i class="fas fa-times"></i></button>` : ''}
        </div>
        <textarea class="gen-binder-page-content" data-save-pg-content="${pg.id}" placeholder="Add your notes, steps, references...">${pg.content||''}</textarea>
      </div>
    `).join('') : '';

    detail.innerHTML = `
      <div class="gen-binder-detail-header" style="--bc:${binder.color}">
        <div class="gen-binder-cover-dot" style="background:${binder.color}"></div>
        <div>
          <div class="gen-binder-detail-title">${binder.title}</div>
          <div class="gen-binder-detail-sub">${binder.subject||''}</div>
        </div>
      </div>
      <div class="gen-binder-tabs-row">
        ${tabsHtml}
        <button class="gen-binder-add-tab" data-binder="${binder.id}" title="Add tab" style="color:${binder.color}"><i class="fas fa-plus"></i> Tab</button>
      </div>
      <div class="gen-binder-pages" id="gen-binder-pages">
        ${pagesHtml}
        ${activeTab ? `<button class="gen-add-page-btn" style="--bc:${binder.color}"><i class="fas fa-plus"></i> Add Page</button>` : ''}
      </div>
    `;

    // Tab click
    detail.querySelectorAll('[data-tab-id]').forEach(btn => {
      btn.addEventListener('click', e => {
        if (e.target.closest('[data-del-tab]')) return;
        this.activeBinderTab = btn.dataset.tabId;
        this.renderBinderDetail(binder);
      });
    });

    // Delete tab
    detail.querySelectorAll('[data-del-tab]').forEach(span => {
      span.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Delete this tab?')) return;
        const d = this.getData();
        const b = d.binders.find(b => b.id === binder.id);
        b.tabs = b.tabs.filter(t => t.id !== span.dataset.delTab);
        if (this.activeBinderTab === span.dataset.delTab) this.activeBinderTab = b.tabs[0]?.id || null;
        this.saveData(d);
        this.renderBinderDetail(b);
        showToast('Tab removed', 'info');
      });
    });

    // Add tab
    const addTabBtn = detail.querySelector('[data-binder]');
    if (addTabBtn) addTabBtn.addEventListener('click', () => {
      const label = prompt('New tab name:');
      if (!label) return;
      const d = this.getData();
      const b = d.binders.find(b => b.id === binder.id);
      const newTab = { id: this.genId('tab'), label, pages: [] };
      b.tabs.push(newTab);
      this.activeBinderTab = newTab.id;
      this.saveData(d);
      this.renderBinderDetail(b);
    });

    // Add page
    const addPageBtn = detail.querySelector('.gen-add-page-btn');
    if (addPageBtn) addPageBtn.addEventListener('click', () => {
      const types = ['Worksheet','Tutorial','Notes','Prompt','Technique','Reference'];
      const type = prompt(`Page type:\n${types.join(', ')}`, 'Notes');
      if (!type) return;
      const title = prompt('Page title:', 'Untitled Page');
      if (!title) return;
      const d = this.getData();
      const b = d.binders.find(b => b.id === binder.id);
      const tab = b.tabs.find(t => t.id === this.activeBinderTab);
      if (tab) {
        tab.pages.push({ id: this.genId('pg'), type, title, content: '' });
        this.saveData(d);
        this.renderBinderDetail(b);
      }
    });

    // Delete page
    detail.querySelectorAll('[data-del-pg]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this page?')) return;
        const d = this.getData();
        const b = d.binders.find(b => b.id === binder.id);
        const tab = b.tabs.find(t => t.id === this.activeBinderTab);
        if (tab) tab.pages = tab.pages.filter(p => p.id !== btn.dataset.delPg);
        this.saveData(d);
        this.renderBinderDetail(b);
      });
    });

    // Auto-save page title
    detail.querySelectorAll('[data-save-pg]').forEach(input => {
      input.addEventListener('change', () => {
        const d = this.getData();
        const b = d.binders.find(b => b.id === binder.id);
        const tab = b.tabs.find(t => t.id === this.activeBinderTab);
        const pg = tab?.pages.find(p => p.id === input.dataset.savePg);
        if (pg) pg.title = input.value;
        this.saveData(d);
      });
    });

    // Auto-save page content
    detail.querySelectorAll('[data-save-pg-content]').forEach(ta => {
      ta.addEventListener('input', () => {
        const d = this.getData();
        const b = d.binders.find(b => b.id === binder.id);
        const tab = b.tabs.find(t => t.id === this.activeBinderTab);
        const pg = tab?.pages.find(p => p.id === ta.dataset.savePgContent);
        if (pg) pg.content = ta.value;
        this.saveData(d);
      });
    });
  },

  /* ────────────────────────────────────────────
     NOTEBOOKS & FOLDERS
  ──────────────────────────────────────────── */
  setupNotebookSection() {
    const addBtn = document.getElementById('add-notebook-btn');
    if (addBtn) addBtn.addEventListener('click', () => {
      document.getElementById('nb-name').value = '';
      this.nbColor = '#CFA18D';
      this.resetColorSwatches('nb-color-row', '#CFA18D');
      openModal('modal-add-notebook');
    });

    this.setupColorSwatches('nb-color-row', (c) => { this.nbColor = c; });

    const saveBtn = document.getElementById('nb-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const name = document.getElementById('nb-name').value.trim();
      if (!name) { showToast('Name is required', 'warning'); return; }
      const d = this.getData();
      d.notebooks = d.notebooks || [];
      d.notebooks.push({
        id: this.genId('nb'),
        name,
        type: document.getElementById('nb-type').value,
        color: this.nbColor,
        pages: 0,
        created: Date.now()
      });
      this.saveData(d);
      closeModal('modal-add-notebook');
      this.renderNotebooks();
      showToast(`${name} added`, 'success');
    });

    // Filter chips
    document.querySelectorAll('.gen-nb-filter-bar .gen-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.gen-nb-filter-bar .gen-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderNotebooks(chip.dataset.nbFilter);
      });
    });
  },

  renderNotebooks(filter = 'all') {
    const d = this.getData();
    const grid = document.getElementById('gen-nb-grid');
    if (!grid) return;

    let items = d.notebooks || [];
    if (filter && filter !== 'all') items = items.filter(i => i.type === filter);

    if (items.length === 0) {
      grid.innerHTML = '<p class="gen-empty-hint">No containers found.</p>';
      return;
    }

    grid.innerHTML = items.map(nb => {
      const visual = this.buildContainerVisual(nb);
      return `
        <div class="gen-nb-card" data-nb-id="${nb.id}">
          ${LCS && LCS.state && LCS.state.editMode ? `<button class="gen-delete-btn gen-delete-nb" data-del-nb="${nb.id}"><i class="fas fa-times"></i></button>` : ''}
          <div class="gen-nb-visual">${visual}</div>
          <div class="gen-nb-name">${nb.name}</div>
          <div class="gen-nb-type-label">${this.nbTypeLabel(nb.type)}</div>
          ${nb.pages > 0 ? `<div class="gen-nb-pages">${nb.pages} pages</div>` : ''}
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-del-nb]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Delete this container?')) return;
        const d2 = this.getData();
        d2.notebooks = d2.notebooks.filter(n => n.id !== btn.dataset.delNb);
        this.saveData(d2);
        this.renderNotebooks(filter);
        showToast('Container removed', 'info');
      });
    });
  },

  buildContainerVisual(nb) {
    const c = nb.color || '#CFA18D';
    const light = this.lightenColor(c, 40);
    if (nb.type === 'folder') {
      return `<svg width="80" height="64" viewBox="0 0 80 64" fill="none">
        <path d="M4 14 Q4 10 8 10 H28 L34 4 H72 Q76 4 76 8 V56 Q76 60 72 60 H8 Q4 60 4 56 Z" fill="${c}" opacity="0.85"/>
        <path d="M4 20 H76 V56 Q76 60 72 60 H8 Q4 60 4 56 Z" fill="${light}"/>
      </svg>`;
    }
    if (nb.type === 'spiral') {
      const rings = [16,24,32,40,48,56,64].map(x => `<circle cx="${x}" cy="32" r="4" fill="${c}" opacity="0.7"/><rect x="${x-2}" y="24" width="4" height="16" rx="2" fill="${c}" opacity="0.4"/>`).join('');
      return `<svg width="80" height="64" viewBox="0 0 80 64" fill="none">
        <rect x="14" y="8" width="62" height="48" rx="4" fill="${light}"/>
        <rect x="14" y="8" width="62" height="8" rx="4" fill="${c}" opacity="0.7"/>
        ${rings}
        <rect x="2" y="8" width="14" height="48" rx="4" fill="${c}" opacity="0.3"/>
      </svg>`;
    }
    if (nb.type === 'sketchbook') {
      return `<svg width="80" height="64" viewBox="0 0 80 64" fill="none">
        <rect x="8" y="6" width="64" height="52" rx="3" fill="${c}" opacity="0.85"/>
        <rect x="12" y="10" width="56" height="44" rx="2" fill="${light}"/>
        <rect x="8" y="6" width="8" height="52" rx="3" fill="${c}"/>
        <line x1="28" y1="18" x2="60" y2="18" stroke="${c}" stroke-width="1.5" opacity="0.4"/>
        <line x1="28" y1="26" x2="60" y2="26" stroke="${c}" stroke-width="1.5" opacity="0.4"/>
        <line x1="28" y1="34" x2="60" y2="34" stroke="${c}" stroke-width="1.5" opacity="0.4"/>
      </svg>`;
    }
    if (nb.type === 'scrapbook') {
      return `<svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="4" y="4" width="72" height="72" rx="4" fill="${light}" stroke="${c}" stroke-width="2"/>
        <rect x="4" y="4" width="72" height="12" rx="4" fill="${c}" opacity="0.7"/>
        <text x="40" y="74" text-anchor="middle" font-size="8" fill="${c}" opacity="0.6" font-family="Lato,sans-serif">12×12</text>
      </svg>`;
    }
    return `<i class="fas fa-book" style="font-size:2rem;color:${c}"></i>`;
  },

  nbTypeLabel(type) {
    const m = {folder:'Folder',spiral:'Spiral Notebook',sketchbook:'Sketchbook',scrapbook:'12×12 Scrapbook Pad'};
    return m[type] || type;
  },

  /* ────────────────────────────────────────────
     WORKSHEET GENERATOR
  ──────────────────────────────────────────── */
  setupWorksheetSection() {
    const inputs = ['ws-title','ws-source','ws-tags','ws-filetypes','ws-content','ws-size'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.updateWorksheetPreview());
      if (el && el.tagName === 'SELECT') el.addEventListener('change', () => this.updateWorksheetPreview());
    });

    // Color swatches
    this.setupColorSwatches('ws-color-row', (c) => {
      this.wsColor = c;
      this.updateWorksheetPreview();
    });

    // Save to library
    const saveBtn = document.getElementById('ws-save-lib-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const title = (document.getElementById('ws-title')?.value || '').trim();
      if (!title) { showToast('Add a title before saving', 'warning'); return; }
      const d = this.getData();
      d.worksheets = d.worksheets || [];
      d.worksheets.push({
        id: this.genId('ws'),
        title,
        source: document.getElementById('ws-source')?.value || '',
        tags: (document.getElementById('ws-tags')?.value || '').split(',').map(t=>t.trim()).filter(Boolean),
        content: document.getElementById('ws-content')?.value || '',
        color: this.wsColor,
        size: document.getElementById('ws-size')?.value || '8.5x11',
        created: Date.now()
      });
      // Also add to library
      d.libraryItems = d.libraryItems || [];
      d.libraryItems.push({
        id: this.genId('lib'),
        title,
        type: 'worksheet',
        source: document.getElementById('ws-source')?.value || '',
        fileType: 'PDF',
        tags: (document.getElementById('ws-tags')?.value || '').split(',').map(t=>t.trim()).filter(Boolean),
        notes: 'Generated by Worksheet Generator',
        created: Date.now()
      });
      this.saveData(d);
      showToast(`${title} saved to library`, 'success');
    });
  },

  updateWorksheetPreview() {
    const title = document.getElementById('ws-title')?.value || 'Worksheet Title';
    const source = document.getElementById('ws-source')?.value || '';
    const tags = document.getElementById('ws-tags')?.value || '';
    const content = document.getElementById('ws-content')?.value || '';
    const c = this.wsColor;

    const header = document.getElementById('ws-preview-header');
    if (header) header.style.borderTop = `5px solid ${c}`;

    const logoEl = document.querySelector('.ws-preview-logo');
    if (logoEl) logoEl.style.color = c;

    const titleEl = document.getElementById('ws-preview-title');
    if (titleEl) titleEl.textContent = title || 'Worksheet Title';

    const metaEl = document.getElementById('ws-preview-meta');
    if (metaEl) metaEl.textContent = [source, tags].filter(Boolean).join(' · ') || 'Source · Tags';

    const bodyEl = document.getElementById('ws-preview-body');
    if (bodyEl) {
      if (content.trim()) {
        bodyEl.innerHTML = content.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('');
      } else {
        bodyEl.innerHTML = '<p style="color:#aaa;font-style:italic">Your content will appear here...</p>';
      }
    }
  },

  printWorksheet() {
    const preview = document.getElementById('ws-preview');
    if (!preview) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>Worksheet</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body{margin:0;padding:40px;font-family:'Lato',sans-serif}
      .ws-preview-header{border-top:5px solid ${this.wsColor};padding:20px 0 16px;margin-bottom:20px}
      .ws-preview-logo{font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;color:${this.wsColor};margin-bottom:6px}
      .ws-preview-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#3D2F2A;margin-bottom:6px}
      .ws-preview-meta{font-size:0.8rem;color:#7A6055}
      .ws-preview-body p{margin:0 0 12px;font-size:0.95rem;line-height:1.7}
      @media print{body{padding:20px}}
    </style></head><body>${preview.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  },

  /* ────────────────────────────────────────────
     PROMPT HELPER
  ──────────────────────────────────────────── */
  setupPromptHelper() {
    const samBtn = document.getElementById('gen-sam-btn');
    if (samBtn) samBtn.addEventListener('click', () => {
      this.samMode = !this.samMode;
      samBtn.classList.toggle('active', this.samMode);
      showToast(this.samMode ? 'SAM Mode ON — bold, visual, aesthetically aligned' : 'SAM Mode OFF', this.samMode ? 'success' : 'info');
    });

    const genBtn = document.getElementById('gen-prompt-btn');
    if (genBtn) genBtn.addEventListener('click', () => this.generatePrompts());

    // Variant tabs
    document.querySelectorAll('.ph-vtab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ph-vtab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeVariant = tab.dataset.vtab;
        this.renderActiveVariant();
      });
    });

    // Copy
    const copyBtn = document.getElementById('ph-copy-btn');
    if (copyBtn) copyBtn.addEventListener('click', () => {
      const body = document.getElementById('ph-variant-body');
      if (body) {
        navigator.clipboard?.writeText(body.textContent).then(() => showToast('Copied to clipboard!', 'success')).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = body.textContent;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Copied!', 'success');
        });
      }
    });

    // Save
    const saveBtn = document.getElementById('ph-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      if (!this.variants) { showToast('Generate prompts first', 'warning'); return; }
      const input = document.getElementById('ph-input')?.value.trim();
      const body = document.getElementById('ph-variant-body')?.textContent;
      if (!body) return;
      const d = this.getData();
      d.savedPrompts = d.savedPrompts || [];
      d.savedPrompts.unshift({
        id: this.genId('ph'),
        title: input ? input.substring(0,50) + (input.length > 50 ? '...' : '') : 'Saved Prompt',
        variant: this.activeVariant,
        content: body,
        target: document.getElementById('ph-target')?.value || 'general',
        samMode: this.samMode,
        created: Date.now()
      });
      // Also add to library
      d.libraryItems = d.libraryItems || [];
      d.libraryItems.push({
        id: this.genId('lib'),
        title: d.savedPrompts[0].title,
        type: 'prompt',
        source: 'Prompt Helper',
        fileType: 'TXT',
        tags: ['prompt', document.getElementById('ph-target')?.value || 'general'],
        notes: this.samMode ? 'SAM Mode' : '',
        created: Date.now()
      });
      this.saveData(d);
      this.renderSavedPrompts();
      showToast('Prompt saved to library', 'success');
    });
  },

  generatePrompts() {
    const input = document.getElementById('ph-input')?.value.trim();
    if (!input) { showToast('Enter your idea first', 'warning'); return; }
    const target = document.getElementById('ph-target')?.value || 'general';
    const sam = this.samMode;

    const samPrefix = sam ? 'BOLD, VISUALLY STUNNING, aesthetically curated — ' : '';
    const targetSuffix = { general:'', image:' — photorealistic, high detail, dramatic lighting', writing:' — evocative language, narrative depth, vivid imagery', coding:' — structured, efficient, well-commented', design:' — composition-focused, color theory applied, print-ready' }[target] || '';

    const clean = input.replace(/\n+/g,' ').trim();

    this.variants = {
      short:    `${samPrefix}${clean.split(' ').slice(0,12).join(' ')}${targetSuffix}`,
      medium:   `${samPrefix}Create a ${target} output: ${clean.split(' ').slice(0,30).join(' ')}${targetSuffix}. Style: professional, cohesive, Lundy Creative aesthetic.`,
      detailed: `${samPrefix}Detailed request: ${clean}${targetSuffix}. Ensure: high quality, visually rich, consistent with a feminine paper craft aesthetic. Include depth, texture, and intentional color harmony.`,
      creative: `${samPrefix}Creative interpretation — ${clean}${targetSuffix}. Think outside the box. Unexpected angles, layered visual metaphors, a mood that feels handcrafted and intentional. Surprise me.`,
      technical: `Technical specification: ${clean}. Output requirements: ${target} format${targetSuffix}. Precision required. Consistent, reproducible, aligned with brand guidelines and print production standards.`
    };

    const variantsWrap = document.getElementById('ph-variants');
    if (variantsWrap) variantsWrap.style.display = 'block';
    this.renderActiveVariant();
    showToast('5 prompt variants ready', 'success');
  },

  renderActiveVariant() {
    const body = document.getElementById('ph-variant-body');
    if (!body || !this.variants) return;
    body.textContent = this.variants[this.activeVariant] || '';
  },

  renderSavedPrompts() {
    const d = this.getData();
    const list = document.getElementById('ph-saved-list');
    const countEl = document.getElementById('ph-saved-count');
    const prompts = d.savedPrompts || [];

    if (countEl) countEl.textContent = prompts.length;

    if (!list) return;
    if (prompts.length === 0) {
      list.innerHTML = '<p class="gen-empty-hint">No saved prompts yet.</p>';
      return;
    }

    list.innerHTML = prompts.map(p => `
      <div class="ph-saved-item" data-ph-id="${p.id}">
        <div class="ph-saved-item-header">
          <span class="ph-saved-title">${p.title}</span>
          <div style="display:flex;gap:4px;align-items:center">
            <span class="gen-ai-tag">${p.variant}</span>
            ${LCS && LCS.state && LCS.state.editMode ? `<button class="gen-delete-btn" data-del-ph="${p.id}"><i class="fas fa-times"></i></button>` : ''}
          </div>
        </div>
        <div class="ph-saved-preview">${p.content.substring(0, 100)}${p.content.length > 100 ? '...' : ''}</div>
        <button class="gen-filter-chip ph-load-btn" data-load-ph="${p.id}" style="margin-top:6px;font-size:0.7rem"><i class="fas fa-redo"></i> Load</button>
      </div>
    `).join('');

    // Load prompt
    list.querySelectorAll('[data-load-ph]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = prompts.find(x => x.id === btn.dataset.loadPh);
        if (!p) return;
        const input = document.getElementById('ph-input');
        if (input) input.value = p.title;
        this.variants = {};
        this.variants[p.variant] = p.content;
        this.activeVariant = p.variant;
        document.querySelectorAll('.ph-vtab').forEach(t => t.classList.toggle('active', t.dataset.vtab === p.variant));
        const variantsWrap = document.getElementById('ph-variants');
        if (variantsWrap) variantsWrap.style.display = 'block';
        this.renderActiveVariant();
        showToast('Prompt loaded', 'info');
      });
    });

    // Delete prompt
    list.querySelectorAll('[data-del-ph]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Delete this saved prompt?')) return;
        const d2 = this.getData();
        d2.savedPrompts = d2.savedPrompts.filter(p => p.id !== btn.dataset.delPh);
        this.saveData(d2);
        this.renderSavedPrompts();
        showToast('Prompt deleted', 'info');
      });
    });
  },

  /* ────────────────────────────────────────────
     SHARED HELPERS
  ──────────────────────────────────────────── */
  setupColorSwatches(rowId, callback) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.addEventListener('click', e => {
      const sw = e.target.closest('.ws-color-swatch');
      if (!sw) return;
      row.querySelectorAll('.ws-color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      callback(sw.dataset.color);
    });
  },

  resetColorSwatches(rowId, defaultColor) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.querySelectorAll('.ws-color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === defaultColor);
    });
  },

  lightenColor(hex, amount) {
    const num = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
    const b = Math.min(255, (num & 0xFF) + amount);
    return `#${((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}`;
  }
};
