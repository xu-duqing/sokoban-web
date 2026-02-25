/**
 * UI Controller - Handle user interface interactions
 * @version 1.0.0
 */

/**
 * UI Controller Class
 */
export class UIController {
  /**
   * Initialize UI controller
   * @param {SokobanGame} game - Game instance
   */
  constructor(game) {
    this.game = game;
    this.initEventListeners();
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Button controls
    document.getElementById('resetBtn')?.addEventListener('click', () => this.game.reset());
    document.getElementById('undoBtn')?.addEventListener('click', () => this.game.undo());
    document.getElementById('menuBtn')?.addEventListener('click', () => this.showMenu());

    // Mobile controls
    document.getElementById('upBtn')?.addEventListener('click', () => this.game.move('up'));
    document.getElementById('downBtn')?.addEventListener('click', () => this.game.move('down'));
    document.getElementById('leftBtn')?.addEventListener('click', () => this.game.move('left'));
    document.getElementById('rightBtn')?.addEventListener('click', () => this.game.move('right'));
  }

  /**
   * Handle keyboard input
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      'W': 'up',
      's': 'down',
      'S': 'down',
      'a': 'left',
      'A': 'left',
      'd': 'right',
      'D': 'right'
    };

    const direction = keyMap[e.key];

    if (direction) {
      e.preventDefault();
      this.game.move(direction);
    } else if (e.key === 'r' || e.key === 'R') {
      this.game.reset();
    } else if (e.key === 'z' && e.ctrlKey) {
      this.game.undo();
    }
  }

  /**
   * Update move count display
   * @param {number} moves - Current move count
   */
  updateMoves(moves) {
    const moveCountEl = document.getElementById('moveCount');
    if (moveCountEl) {
      moveCountEl.textContent = moves;
    }
  }

  /**
   * Update level number display
   * @param {number} level - Current level number
   */
  updateLevel(level) {
    const levelNumberEl = document.getElementById('levelNumber');
    if (levelNumberEl) {
      levelNumberEl.textContent = level;
    }
  }

  /**
   * Show win message
   */
  showWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.className = 'win-message';
    winMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      text-align: center;
      z-index: 1000;
    `;
    winMessage.innerHTML = `
      <h2 style="color: #28a745; margin-bottom: 15px;">🎉 恭喜通关！</h2>
      <p style="margin-bottom: 15px;">你用了 ${this.game.moves} 步完成本关</p>
      <button id="nextLevelBtn" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
      ">下一关</button>
    `;
    document.body.appendChild(winMessage);

    document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
      document.body.removeChild(winMessage);
      this.game.nextLevel();
    });
  }

  /**
   * Show menu
   */
  showMenu() {
    if (this.game.levelMenu) {
      this.game.levelMenu.show();
    }
  }
}