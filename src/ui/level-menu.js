/**
 * Level Menu - 关卡选择菜单
 * @version 1.0.0
 */

export class LevelMenu {
  /**
   * Initialize level menu
   * @param {LevelLoader} levelLoader - Level loader instance
   * @param {Function} onLevelSelect - Callback when level selected
   */
  constructor(levelLoader, onLevelSelect) {
    this.levelLoader = levelLoader;
    this.onLevelSelect = onLevelSelect;
    this.container = null;
    this.completedLevels = this.loadCompletedLevels();
  }

  /**
   * Load completed levels from localStorage
   * @returns {Set<number>} Set of completed level IDs
   */
  loadCompletedLevels() {
    const saved = localStorage.getItem('sokoban-completed-levels');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  }

  /**
   * Save completed levels to localStorage
   */
  saveCompletedLevels() {
    localStorage.setItem('sokoban-completed-levels', 
      JSON.stringify(Array.from(this.completedLevels)));
  }

  /**
   * Mark level as completed
   * @param {number} levelId - Level ID
   */
  markCompleted(levelId) {
    this.completedLevels.add(levelId);
    this.saveCompletedLevels();
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.completedLevels.clear();
    localStorage.removeItem('sokoban-completed-levels');
  }

  /**
   * Create and render level menu
   * @returns {HTMLElement} Level menu container
   */
  create() {
    this.container = document.createElement('div');
    this.container.className = 'level-menu';
    this.container.innerHTML = `
      <div class="level-menu-content">
        <h2>🎮 选择关卡</h2>
        <div class="level-list" id="levelList"></div>
        <div class="menu-actions">
          <button class="btn-reset" id="resetProgressBtn">重置进度</button>
        </div>
      </div>
    `;

    this.renderLevelList();
    this.attachEventListeners();

    return this.container;
  }

  /**
   * Render level list
   */
  renderLevelList() {
    const levelList = this.container.querySelector('#levelList');
    const levels = this.levelLoader.getAllLevels();
    const totalLevels = levels.length;

    levelList.innerHTML = levels.map((level, _index) => {
      const isCompleted = this.completedLevels.has(level.id);
      const statusClass = isCompleted ? 'completed' : 'locked';
      const statusIcon = isCompleted ? '✅' : '🔒';
      
      return `
        <div class="level-item ${statusClass}" data-level="${level.id}">
          <div class="level-number">${level.id} / ${totalLevels}</div>
          <div class="level-info">
            <div class="level-name">${level.name}</div>
            <div class="level-status">${statusIcon} ${isCompleted ? '已完成' : '未完成'}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Level selection
    this.container.addEventListener('click', (e) => {
      const levelItem = e.target.closest('.level-item');
      if (levelItem) {
        const levelId = parseInt(levelItem.dataset.level);
        this.selectLevel(levelId);
      }
    });

    // Reset progress button
    const resetBtn = this.container.querySelector('#resetProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('确定要重置所有关卡进度吗？')) {
          this.resetProgress();
          this.renderLevelList();
        }
      });
    }
  }

  /**
   * Select a level
   * @param {number} levelId - Level ID to select
   */
  selectLevel(levelId) {
    if (this.onLevelSelect) {
      this.onLevelSelect(levelId);
    }
    this.hide();
  }

  /**
   * Show menu
   */
  show() {
    this.container.style.display = 'flex';
    document.body.appendChild(this.container);
  }

  /**
   * Hide menu
   */
  hide() {
    if (this.container && this.container.parentNode) {
      this.container.style.display = 'none';
    }
  }

  /**
   * Destroy menu and remove from DOM
   */
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}