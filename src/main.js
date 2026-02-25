/**
 * Sokoban Game - Main Entry Point
 * @version 1.0.0
 * @author OpenClaw AI Agent
 */

import { GameEngine } from './game/engine.js';
import { CanvasRenderer } from './renderer/canvas.js';
import { LevelLoader } from './levels/parser.js';
import { UIController } from './ui/controls.js';

/**
 * Main game class that orchestrates all components
 */
class SokobanGame {
  /**
   * Initialize the game
   */
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.levelLoader = new LevelLoader();
    this.engine = null;
    this.renderer = null;
    this.uiController = null;
    this.currentLevel = 1;
    this.moves = 0;

    this.init();
  }

  /**
   * Initialize game components
   */
  init() {
    console.log('🎮 Initializing Sokoban Game...');

    try {
      // Load level
      const levelData = this.levelLoader.loadLevel(this.currentLevel);
      
      // Initialize engine
      this.engine = new GameEngine(levelData);
      
      // Initialize renderer
      this.renderer = new CanvasRenderer(this.canvas);
      
      // Initialize UI controller
      this.uiController = new UIController(this);

      // Setup canvas size
      this.setupCanvas();

      // Start game loop
      this.gameLoop();

      console.log('✅ Game initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize game:', error);
      this.showError(error.message);
    }
  }

  /**
   * Setup canvas dimensions
   */
  setupCanvas() {
    const levelData = this.levelLoader.loadLevel(this.currentLevel);
    const tileSize = 50;
    const width = levelData.width * tileSize;
    const height = levelData.height * tileSize;
    
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Game loop
   */
  gameLoop() {
    const animate = () => {
      this.renderer.render(this.engine.getState());
      requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Handle player move
   * @param {string} direction - Direction to move (up, down, left, right)
   */
  move(direction) {
    const result = this.engine.move(direction);
    
    if (result.moved) {
      this.moves = result.moves;
      this.uiController.updateMoves(this.moves);
      
      if (result.won) {
        this.handleWin();
      }
    }
  }

  /**
   * Handle win condition
   */
  handleWin() {
    console.log('🎉 Level completed!');
    // Note: confetti is loaded from CDN
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    this.uiController.showWinMessage();
  }

  /**
   * Reset current level
   */
  reset() {
    console.log('🔄 Resetting level...');
    const levelData = this.levelLoader.loadLevel(this.currentLevel);
    this.engine = new GameEngine(levelData);
    this.moves = 0;
    this.uiController.updateMoves(0);
  }

  /**
   * Undo last move
   */
  undo() {
    console.log('↩️ Undoing last move...');
    const result = this.engine.undo();
    
    if (result.undone) {
      this.moves = result.moves;
      this.uiController.updateMoves(this.moves);
    }
  }

  /**
   * Load next level
   */
  nextLevel() {
    this.currentLevel++;
    console.log(`➡️ Loading level ${this.currentLevel}...`);
    
    try {
      const levelData = this.levelLoader.loadLevel(this.currentLevel);
      this.engine = new GameEngine(levelData);
      this.moves = 0;
      this.uiController.updateMoves(0);
      this.uiController.updateLevel(this.currentLevel);
    } catch (error) {
      console.warn('No more levels available');
      this.currentLevel--;
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    const container = document.querySelector('.game-container');
    container.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SokobanGame();
});