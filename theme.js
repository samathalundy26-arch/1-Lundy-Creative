/* ═══════════════════════════════════════════════════════════════
   THEME.JS — Color Theme Management, Per-Collection Theming
   ═══════════════════════════════════════════════════════════════ */

const ThemeMgr = {
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.renderThemePresets();
    this.setupThemeModal();
    this.applyTheme(LCS.state.currentTheme);
  },

  renderThemePresets() {
    const container = $('#theme-presets');
    if (!container) return;
    container.innerHTML = '';

    LCS.themes.forEach(theme => {
      const item = document.createElement('div');
      item.className = `theme-preset-item${LCS.state.currentTheme === theme.id ? ' active' : ''}`;
      item.title = theme.name;
      item.style.cssText = `position:relative;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color 0.15s;background:linear-gradient(135deg, ${theme.sidebarBg} 0%, ${theme.accent} 100%);height:52px`;
      item.dataset.themeId = theme.id;
      if (LCS.state.currentTheme === theme.id) item.style.borderColor = 'var(--accent)';

      const label = document.createElement('div');
      label.style.cssText = `position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.48);color:white;font-size:0.6rem;font-weight:700;text-align:center;padding:3px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`;
      label.textContent = theme.name;
      item.appendChild(label);

      item.addEventListener('click', () => {
        LCS.state.currentTheme = theme.id;
        $$('.theme-preset-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.applyTheme(theme.id);
        showToast(`Theme: ${theme.name}`, 'success', 1800);
      });

      container.appendChild(item);
    });
  },

  setupThemeModal() {
    const applyBtn = $('#apply-theme-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const accent = $('#custom-accent-color')?.value;
        const bg = $('#custom-bg-color')?.value;
        if (accent) document.documentElement.style.setProperty('--accent', accent);
        if (accent) document.documentElement.style.setProperty('--accent-hover', accent);
        if (bg)     document.documentElement.style.setProperty('--app-bg', bg);
        closeModal('modal-theme');
        showToast('Custom theme applied!', 'success');
      });
    }
  },

  applyTheme(themeId) {
    const theme = LCS.themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', this.darkenColor(theme.accent, 15));
    root.style.setProperty('--sidebar-bg', theme.sidebarBg);
    root.style.setProperty('--app-bg', theme.appBg);

    // Update custom color inputs to match current theme
    const accentInput = $('#custom-accent-color');
    const bgInput = $('#custom-bg-color');
    if (accentInput) accentInput.value = theme.accent;
    if (bgInput) bgInput.value = theme.appBg;
  },

  applyCollectionTheme(palette) {
    if (!palette || palette.length === 0) return;
    const accent = palette[palette.length > 2 ? 2 : 0];
    document.documentElement.style.setProperty('--accent', accent);
    showToast('Collection theme applied', 'success', 1800);
  },

  darkenColor(hex, amount) {
    // Simple hex darkening
    if (!hex || hex.length < 4) return hex;
    let col = hex.replace('#', '');
    if (col.length === 3) col = col.split('').map(c => c+c).join('');
    const num = parseInt(col, 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
};
