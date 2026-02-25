/**
 * Game Engine - Core Game Logic
 * @version 1.0.0
 */

/**
 * Game Engine Class
 */
export class GameEngine {
  /**
   * Initialize game engine with level data
   * @param {Object} levelData - Level configuration
   */
  constructor(levelData) {
    this.player = { ...levelData.player };
    this.boxes = levelData.boxes.map(box => ({ ...box }));
    this.targets = levelData.targets.map(target => ({ ...target }));
    this.walls = levelData.walls.map(wall => ({ ...wall }));
    this.moves = 0;
    this.won = false;
    this.history = [];
    this.historyLimit = 10;
  }

  /**
   * Get current game state
   * @returns {Object} Game state
   */
  getState() {
    return {
      player: { ...this.player },
      boxes: this.boxes.map(box => ({ ...box })),
      targets: [...this.targets],
      walls: [...this.walls],
      moves: this.moves,
      won: this.won
    };
  }

  /**
   * Move player in direction
   * @param {string} direction - Direction (up, down, left, right)
   * @returns {Object} Move result
   */
  move(direction) {
    if (this.won) {
      return { moved: false, moves: this.moves, won: this.won };
    }

    const deltas = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 }
    };

    const delta = deltas[direction];
    if (!delta) {
      return { moved: false, moves: this.moves, won: this.won };
    }

    const newX = this.player.x + delta.dx;
    const newY = this.player.y + delta.dy;

    // Check if hitting wall
    if (this.isWall(newX, newY)) {
      return { moved: false, moves: this.moves, won: this.won };
    }

    // Check if pushing box
    const boxIndex = this.getBoxIndexAt(newX, newY);
    if (boxIndex !== -1) {
      const boxNewX = newX + delta.dx;
      const boxNewY = newY + delta.dy;

      // Can't push box into wall or another box
      if (this.isWall(boxNewX, boxNewY) || this.getBoxIndexAt(boxNewX, boxNewY) !== -1) {
        return { moved: false, moves: this.moves, won: this.won };
      }

      // Save state for undo
      this.saveState();

      // Push box
      this.boxes[boxIndex].x = boxNewX;
      this.boxes[boxIndex].y = boxNewY;
    } else {
      // Save state for undo
      this.saveState();
    }

    // Move player
    this.player.x = newX;
    this.player.y = newY;
    this.moves++;

    // Check win condition
    this.won = this.checkWin();

    return { moved: true, moves: this.moves, won: this.won };
  }

  /**
   * Undo last move
   * @returns {Object} Undo result
   */
  undo() {
    if (this.history.length === 0) {
      return { undone: false, moves: this.moves };
    }

    const state = this.history.pop();
    this.player = { ...state.player };
    this.boxes = state.boxes.map(box => ({ ...box }));
    this.moves = state.moves;
    this.won = false;

    return { undone: true, moves: this.moves };
  }

  /**
   * Check if position is a wall
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} Is wall
   */
  isWall(x, y) {
    return this.walls.some(wall => wall.x === x && wall.y === y);
  }

  /**
   * Get box index at position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {number} Box index or -1
   */
  getBoxIndexAt(x, y) {
    return this.boxes.findIndex(box => box.x === x && box.y === y);
  }

  /**
   * Save current state to history
   */
  saveState() {
    const state = {
      player: { ...this.player },
      boxes: this.boxes.map(box => ({ ...box })),
      moves: this.moves
    };

    this.history.push(state);

    // Limit history size
    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }
  }

  /**
   * Check win condition
   * @returns {boolean} Is won
   */
  checkWin() {
    return this.targets.every(target => 
      this.boxes.some(box => box.x === target.x && box.y === target.y)
    );
  }
}