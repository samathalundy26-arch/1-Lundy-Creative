/* ═══════════════════════════════════════════════════════════════
   DATA.JS — App State, Sample Data, Local Storage
   ═══════════════════════════════════════════════════════════════ */

const LCS = {
  // ── App State ──────────────────────────────────────────────
  state: {
    currentSection: 'collections',
    editMode: false,
    activeCollectionId: null,
    activeProjectId: null,
    selectedFiles: [],
    currentFilesCollectionId: null,
    currentFileCategory: 'Pattern Papers',
    currentFileFormat: 'SVG',
    currentFilePathway: 'A',
    newProjectStep: 1,
    newProjectWorkspaceType: 'guided',
    newProjectPalette: ['#F9D5D3','#F2B4C0','#CFA18D','#B8936A','#7A6055'],
    editingCollectionId: null,
    editingPaletteDotIndex: null,
    editingPalettePrefix: null,
    selectedFolderColor: '#F2B4C0',
    currentInspoFolder: null,
    currentTheme: 'default',
    studioTemplate: null,
    foilWorkflow: 'digital',
    foilTool: 'draw',
    foilBrushSize: 10,
    foilDrawing: false,
    foilLastX: 0,
    foilLastY: 0,
    unzip3dProject: null,
    unzipActiveTab: 'illustration',
    // Image upload tracking for new collection modal
    _ncCoverImage: null,
    _ncPatternImage: null,
  },

  // ── Collections ────────────────────────────────────────────
  collections: [],

  // ── Inspiration ────────────────────────────────────────────
  inspoItems: [],
  inspoFolders: [],

  // ── Projects ───────────────────────────────────────────────
  projects: [],

  // ── Unzip Projects ─────────────────────────────────────────
  unzipProjects: [],

  // ── Foil Projects ──────────────────────────────────────────
  foilProjects: [],

  // ── Default Component Types ────────────────────────────────
  componentTypes: [
    { id: 'pattern-papers', label: 'Pattern Papers', icon: 'fas fa-th' },
    { id: 'sticker-sheets', label: 'Sticker Sheets', icon: 'fas fa-star' },
    { id: 'ephemera', label: 'Ephemera/Cut-Aparts', icon: 'fas fa-scissors' },
    { id: 'die-cuts', label: 'Die Cuts', icon: 'fas fa-cut' },
    { id: 'stamps', label: 'Stamps', icon: 'fas fa-stamp' },
    { id: 'foiled-layers', label: 'Foiled Layers', icon: 'fas fa-star-of-life' },
    { id: 'journaling-cards', label: 'Journaling Cards', icon: 'fas fa-sticky-note' },
    { id: 'borders', label: 'Borders & Strips', icon: 'fas fa-minus' },
    { id: 'tags', label: 'Tags', icon: 'fas fa-tag' },
    { id: 'backgrounds', label: 'Backgrounds', icon: 'fas fa-image' },
    { id: 'washi', label: 'Washi Tape', icon: 'fas fa-tape' },
    { id: 'custom', label: 'Custom Section', icon: 'fas fa-plus-circle' },
  ],

  // ── Default Guided Project Sections ─────────────────────────
  guidedSections: [
    { id: 'overview',     title: 'Overview',         type: 'notes',  icon: 'fas fa-clipboard' },
    { id: 'inspiration',  title: 'Inspiration Refs', type: 'images', icon: 'fas fa-lightbulb' },
    { id: 'materials',    title: 'Materials Needed', type: 'list',   icon: 'fas fa-list' },
    { id: 'dimensions',   title: 'Dimensions',       type: 'notes',  icon: 'fas fa-ruler-combined' },
    { id: 'color-scheme', title: 'Color Scheme',     type: 'palette',icon: 'fas fa-palette' },
    { id: 'steps',        title: 'Steps / To-Do',    type: 'checklist', icon: 'fas fa-tasks' },
    { id: 'notes',        title: 'Notes',            type: 'notes',  icon: 'fas fa-sticky-note' },
    { id: 'files',        title: 'Files',            type: 'files',  icon: 'fas fa-folder' },
  ],

  // ── Studio Templates ────────────────────────────────────────
  studioTemplates: [
    {
      id: 'template-a',
      name: 'Starter Pack',
      icon: '🌸',
      badge: '15 pieces',
      items: '6 pattern papers, 2 sticker sheets, 3 ephemera, 4 journaling cards',
      prompt: 'Create a cohesive paper pad collection with 6 pattern papers, 2 sticker sheet pages, 3 ephemera/cut-apart pages, and 4 journaling cards. Style: [describe your style]. Color palette: [describe colors]. Theme: [describe theme].'
    },
    {
      id: 'template-b',
      name: 'Full Collection',
      icon: '🌷',
      badge: '30 pieces',
      items: '12 pattern papers, 4 sticker sheets, 6 ephemera, 8 journaling cards',
      prompt: 'Generate a full paper pad collection with 12 pattern papers, 4 sticker sheet pages, 6 ephemera pages, and 8 journaling cards. All pieces should be cohesive with a unified color palette. Style: [describe]. Theme: [describe].'
    },
    {
      id: 'template-c',
      name: 'Foil Edition',
      icon: '✨',
      badge: '18 pieces',
      items: '8 pattern papers, 2 sticker sheets, 1 foiled layer, 7 ephemera',
      prompt: 'Design a foil-accented paper pad with 8 pattern papers, 2 sticker sheets, 1 foil overlay layer, and 7 ephemera pieces. Include areas designated for gold/rose gold foil accents. Style: elegant, luxurious. Theme: [describe].'
    },
    {
      id: 'template-d',
      name: 'Pocket Page',
      icon: '📋',
      badge: '24 pieces',
      items: '6 pattern papers, 2 sticker sheets, 12 pocket page cards, 4 tags',
      prompt: 'Create a pocket-page style collection with 6 pattern papers, 2 sticker sheets, 12 journaling/pocket cards (3x4 and 4x6 sizes), and 4 tags. Style: [describe]. Theme: [describe].'
    },
    {
      id: 'template-e',
      name: 'Mini Album',
      icon: '📚',
      badge: '20 pieces',
      items: '4 pattern papers, 1 sticker sheet, 8 ephemera, 7 journal pages',
      prompt: 'Generate a mini album paper collection with 4 pattern papers, 1 sticker sheet page, 8 ephemera/cut-apart pieces, and 7 journal page backgrounds. Theme: [describe]. Style: [describe].'
    },
    {
      id: 'template-f',
      name: 'Die Cut Focus',
      icon: '✂️',
      badge: '22 pieces',
      items: '4 pattern papers, 1 sticker sheet, 2 die cut sheets, 8 ephemera, 7 borders',
      prompt: 'Create a die-cut focused collection with 4 pattern papers, 1 sticker sheet, 2 die cut sheets with intricate shapes, 8 ephemera pieces, and 7 border/strip designs. Theme: [describe]. Style: [describe].'
    },
  ],

  // ── Mockup Templates ────────────────────────────────────────
  mockupTemplates: [
    { id: 'flat-lay-1',    label: 'Flat Lay — Desk',       bg: '#F0E8E4' },
    { id: 'flat-lay-2',    label: 'Flat Lay — Linen',      bg: '#E8E4DF' },
    { id: 'spread-open',   label: 'Open Spread',           bg: '#FDF0EC' },
    { id: 'cover-front',   label: 'Cover — Front View',    bg: '#F5EAE6' },
    { id: 'cover-angle',   label: 'Cover — Angle View',    bg: '#EDE6E0' },
    { id: 'stacked',       label: 'Stacked Collection',    bg: '#F9F0ED' },
    { id: 'detail-stickers', label: 'Sticker Detail',      bg: '#FAEAE8' },
    { id: 'detail-papers', label: 'Papers Fanned',         bg: '#F2EBE7' },
    { id: 'scrapbook-page', label: 'In Use — Scrapbook',   bg: '#EBE3DE' },
    { id: 'journal-page',  label: 'In Use — Journal',      bg: '#F5EEE9' },
    { id: 'product-grid',  label: 'Product Grid',          bg: '#EDE7E3' },
    { id: 'lifestyle-1',   label: 'Lifestyle — Cozy',      bg: '#F0E4E0' },
  ],

  // ── Theme Presets ───────────────────────────────────────────
  themes: [
    {
      id: 'default',
      name: 'Blush Rose',
      sidebarBg: '#5A463E',
      accent: '#CFA18D',
      appBg: '#FDF5F3',
    },
    {
      id: 'mauve',
      name: 'Dusty Mauve',
      sidebarBg: '#5A4460',
      accent: '#B08AAB',
      appBg: '#FAF4FC',
    },
    {
      id: 'sage',
      name: 'Soft Sage',
      sidebarBg: '#3D5240',
      accent: '#7A9A7E',
      appBg: '#F3F7F3',
    },
    {
      id: 'navy',
      name: 'Midnight Navy',
      sidebarBg: '#1E2A3A',
      accent: '#6B92B8',
      appBg: '#F3F6FA',
    },
    {
      id: 'champagne',
      name: 'Champagne',
      sidebarBg: '#4A3D2A',
      accent: '#C8A660',
      appBg: '#FAF6EC',
    },
    {
      id: 'charcoal',
      name: 'Modern Charcoal',
      sidebarBg: '#2A2A2A',
      accent: '#888',
      appBg: '#F5F5F5',
    },
  ],

  // ── Helpers ────────────────────────────────────────────────
  generateId() {
    return 'lcs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  statusClass(status) {
    return (status || 'in-progress').toLowerCase().replace(/\s+/g, '-').replace('/', '-');
  },

  // ── Local Storage ──────────────────────────────────────────
  save() {
    try {
      localStorage.setItem('lcs_collections', JSON.stringify(this.collections));
      localStorage.setItem('lcs_inspoItems', JSON.stringify(this.inspoItems));
      localStorage.setItem('lcs_inspoFolders', JSON.stringify(this.inspoFolders));
      localStorage.setItem('lcs_projects', JSON.stringify(this.projects));
      localStorage.setItem('lcs_unzipProjects', JSON.stringify(this.unzipProjects));
      localStorage.setItem('lcs_foilProjects', JSON.stringify(this.foilProjects));
    } catch(e) { console.warn('Storage error:', e); }
  },

  load() {
    try {
      const c = localStorage.getItem('lcs_collections');
      const i = localStorage.getItem('lcs_inspoItems');
      const f = localStorage.getItem('lcs_inspoFolders');
      const p = localStorage.getItem('lcs_projects');
      const u = localStorage.getItem('lcs_unzipProjects');
      const fo= localStorage.getItem('lcs_foilProjects');
      if (c) this.collections   = JSON.parse(c);
      if (i) this.inspoItems    = JSON.parse(i);
      if (f) this.inspoFolders  = JSON.parse(f);
      if (p) this.projects      = JSON.parse(p);
      if (u) this.unzipProjects = JSON.parse(u);
      if (fo)this.foilProjects  = JSON.parse(fo);
    } catch(e) { console.warn('Load error:', e); }
  },

  // ── Sample Seed Data ─────────────────────────────────────────
  seedSampleData() {
    if (this.collections.length > 0) return; // Don't re-seed

    this.collections = [
      {
        id: 'col_001',
        name: 'Resilient Blooms',
        size: '12x12',
        type: 'Digital',
        status: 'In Progress',
        tags: ['floral', 'spring', 'feminine'],
        palette: ['#F2B4C0', '#EACBC0', '#D4A5A5', '#B8936A', '#7A6055', '#F9D5D3'],
        coverColor: '#F2B4C0',
        coverImage: null,
        patternImage: null,
        patternScale: 1,
        patternOpacity: 0.18,
        notes: '',
        quickNotes: '',
        createdAt: Date.now() - 7 * 86400000,
        updatedAt: Date.now() - 1 * 86400000,
        components: [
          { id: 'comp_001', type: 'pattern-papers', label: 'Pattern Papers', count: 12, items: [], icon: 'fas fa-th' },
          { id: 'comp_002', type: 'sticker-sheets', label: 'Sticker Sheets', count: 3,  items: [], icon: 'fas fa-star' },
          { id: 'comp_003', type: 'ephemera',       label: 'Ephemera',       count: 6,  items: [], icon: 'fas fa-scissors' },
          { id: 'comp_004', type: 'die-cuts',       label: 'Die Cuts',       count: 2,  items: [], icon: 'fas fa-cut' },
          { id: 'comp_005', type: 'journaling-cards', label: 'Journal Cards', count: 8, items: [], icon: 'fas fa-sticky-note' },
          { id: 'comp_006', type: 'foiled-layers',  label: 'Foiled Layers',  count: 1,  items: [], icon: 'fas fa-star-of-life' },
        ]
      },
      {
        id: 'col_002',
        name: 'Golden Harvest',
        size: '8.5x11',
        type: 'Print & Cut',
        status: 'Ready for Final',
        tags: ['autumn', 'gold', 'warm', 'harvest'],
        palette: ['#D4904A', '#C87A3A', '#A8622A', '#F0D890', '#5A3A1A', '#E8B870'],
        coverColor: '#D4904A',
        coverImage: null,
        patternImage: null,
        patternScale: 1,
        patternOpacity: 0.18,
        notes: '',
        quickNotes: '',
        createdAt: Date.now() - 14 * 86400000,
        updatedAt: Date.now() - 3 * 86400000,
        components: [
          { id: 'comp_010', type: 'pattern-papers', label: 'Pattern Papers', count: 8,  items: [], icon: 'fas fa-th' },
          { id: 'comp_011', type: 'sticker-sheets', label: 'Sticker Sheets', count: 2,  items: [], icon: 'fas fa-star' },
          { id: 'comp_012', type: 'ephemera',       label: 'Ephemera',       count: 4,  items: [], icon: 'fas fa-scissors' },
          { id: 'comp_013', type: 'stamps',         label: 'Stamps',         count: 5,  items: [], icon: 'fas fa-stamp' },
        ]
      },
      {
        id: 'col_003',
        name: 'Ocean Dreams',
        size: '12x12',
        type: 'Digital',
        status: 'Beginning',
        tags: ['ocean', 'blue', 'coastal', 'summer'],
        palette: ['#5B9AC0', '#3A7AA0', '#8DC5DC', '#C8E8F0', '#1A4060', '#A0D4E8'],
        coverColor: '#5B9AC0',
        coverImage: null,
        patternImage: null,
        patternScale: 1,
        patternOpacity: 0.18,
        notes: '',
        quickNotes: '',
        createdAt: Date.now() - 2 * 86400000,
        updatedAt: Date.now(),
        components: [
          { id: 'comp_020', type: 'pattern-papers', label: 'Pattern Papers', count: 0,  items: [], icon: 'fas fa-th' },
          { id: 'comp_021', type: 'sticker-sheets', label: 'Sticker Sheets', count: 0,  items: [], icon: 'fas fa-star' },
        ]
      },
      {
        id: 'col_004',
        name: 'Midnight Garden',
        size: '8.5x11',
        type: 'Digital',
        status: 'Needs Editing',
        tags: ['dark', 'floral', 'moody', 'purple', 'evening'],
        palette: ['#3D1A5A', '#6A2A8A', '#B08AB0', '#D4B8D4', '#1A0A28', '#8A5A8A'],
        coverColor: '#3D1A5A',
        coverImage: null,
        patternImage: null,
        patternScale: 1,
        patternOpacity: 0.18,
        notes: '',
        quickNotes: '',
        createdAt: Date.now() - 21 * 86400000,
        updatedAt: Date.now() - 5 * 86400000,
        components: [
          { id: 'comp_030', type: 'pattern-papers', label: 'Pattern Papers', count: 6,  items: [], icon: 'fas fa-th' },
          { id: 'comp_031', type: 'sticker-sheets', label: 'Sticker Sheets', count: 2,  items: [], icon: 'fas fa-star' },
          { id: 'comp_032', type: 'foiled-layers',  label: 'Foiled Layers',  count: 2,  items: [], icon: 'fas fa-star-of-life' },
          { id: 'comp_033', type: 'ephemera',       label: 'Ephemera',       count: 5,  items: [], icon: 'fas fa-scissors' },
        ]
      },
    ];

    this.inspoFolders = [
      { id: 'if_001', name: 'Vintage Florals', color: '#F2B4C0', count: 5 },
      { id: 'if_002', name: 'Bold Geometrics', color: '#A8C4DC', count: 3 },
      { id: 'if_003', name: 'Autumn Textures', color: '#D4904A', count: 7 },
    ];

    this.inspoItems = [
      { id: 'ii_001', type: 'image', x: 40,  y: 40,  w: 200, h: 160, src: null, folderId: 'if_001', label: 'Floral ref 1' },
      { id: 'ii_002', type: 'image', x: 260, y: 60,  w: 180, h: 140, src: null, folderId: 'if_001', label: 'Color study' },
      { id: 'ii_003', type: 'note',  x: 460, y: 40,  w: 160, h: 100, text: 'Use soft pastels with rose gold accents. Think spring morning light.', folderId: null },
    ];

    this.projects = [
      {
        id: 'proj_001',
        name: 'Spring Mini Album',
        status: 'In Progress',
        palette: ['#F9D5D3','#F2B4C0','#CFA18D','#B8936A','#7A6055'],
        workspaceType: 'guided',
        coverImage: null,
        dimensions: '6x6 album, 20 pages',
        createdAt: Date.now() - 5 * 86400000,
        updatedAt: Date.now() - 1 * 86400000,
        sections: [
          { id: 's1', title: 'Overview', type: 'notes', content: 'Creating a spring-themed mini album using Resilient Blooms collection.' },
          { id: 's2', title: 'Materials Needed', type: 'list', content: '- Resilient Blooms paper pad\n- Bone folder\n- Adhesive\n- Ribbon (blush pink)\n- Embellishments' },
          { id: 's3', title: 'Color Scheme', type: 'palette', palette: ['#F9D5D3','#F2B4C0','#CFA18D','#B8936A'] },
          { id: 's4', title: 'Steps / To-Do', type: 'checklist', items: [
            { text: 'Print all pages', done: true },
            { text: 'Cut to size', done: true },
            { text: 'Score and fold', done: false },
            { text: 'Assemble cover', done: false },
            { text: 'Add embellishments', done: false },
          ]},
          { id: 's5', title: 'Notes', type: 'notes', content: 'Remember to use the blush ribbon for the binding!' },
        ],
        progressPercent: 40,
      },
      {
        id: 'proj_002',
        name: 'Holiday Gift Tags',
        status: 'Beginning',
        palette: ['#C0392B','#E74C3C','#F0D890','#2C3E50','#FFFFFF'],
        workspaceType: 'guided',
        coverImage: null,
        dimensions: 'Various sizes',
        createdAt: Date.now() - 2 * 86400000,
        updatedAt: Date.now() - 1 * 86400000,
        sections: [
          { id: 's1', title: 'Overview', type: 'notes', content: 'Holiday gift tags for the upcoming season.' },
          { id: 's2', title: 'Materials Needed', type: 'list', content: '- Cardstock\n- Ribbon\n- Hole punch\n- Seasonal stamp set' },
          { id: 's3', title: 'Color Scheme', type: 'palette', palette: ['#C0392B','#E74C3C','#F0D890','#2C3E50'] },
          { id: 's4', title: 'Steps / To-Do', type: 'checklist', items: [
            { text: 'Choose tag designs', done: false },
            { text: 'Print templates', done: false },
            { text: 'Cut and punch', done: false },
            { text: 'Add ribbon', done: false },
          ]},
        ],
        progressPercent: 0,
      },
    ];

    this.save();
  }
};
