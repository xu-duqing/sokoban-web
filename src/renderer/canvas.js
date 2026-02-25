/**
 * Canvas Renderer - Render game to HTML5 Canvas
 * @version 1.0.0
 */

export class CanvasRenderer {
  /**
   * Initialize renderer
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = 50;
    this.colors = {
      wall: '#343a40',
      player: '#667eea',
      box: '#ffc107',
      boxOnTarget: '#28a745',
      target: '#dc3545',
      floor: '#f8f9fa'
    };
  }

  /**
   * Render game state
   * @param {Object} state - Game state
   */
  render(state) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.renderFloor(state);
    this.renderTargets(state.targets);
    this.renderBoxes(state.boxes, state.targets);
    this.renderPlayer(state.player);
  }

  /**
   * Render floor background
   * @param {Object} state - Game state
   */
  renderFloor(state) {
    const { walls, player, boxes, targets } = state;
    const allElements = [...walls, player, ...boxes, ...targets];
    
    const maxX = Math.max(...allElements.map(el => el.x)) + 1;
    const maxY = Math.max(...allElements.map(el => el.y)) + 1;

    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        this.drawTile(x, y, this.colors.floor);
      }
    }
  }

  /**
   * Render a single tile
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Tile color
   */
  drawTile(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  /**
   * Render targets
   * @param {Array} targets - Target positions
   */
  renderTargets(targets) {
    targets.forEach(target => {
      this.drawCircle(target.x, target.y, this.colors.target, 0.3);
    });
  }

  /**
   * Render boxes
   * @param {Array} boxes - Box positions
   * @param {Array} targets - Target positions
   */
  renderBoxes(boxes, targets) {
    boxes.forEach(box => {
      const onTarget = targets.some(t => t.x === box.x && t.y === box.y);
      const color = onTarget ? this.colors.boxOnTarget : this.colors.box;
      this.drawBox(box.x, box.y, color);
    });
  }

  /**
   * Render player
   * @param {Object} player - Player position
   */
  renderPlayer(player) {
    this.drawCircle(player.x, player.y, this.colors.player, 0.5);
  }

  /**
   * Draw a box
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Box color
   */
  drawBox(x, y, color) {
    const padding = 5;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.tileSize + padding,
      y * this.tileSize + padding,
      this.tileSize - padding * 2,
      this.tileSize - padding * 2
    );

    // Add border
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      x * this.tileSize + padding,
      y * this.tileSize + padding,
      this.tileSize - padding * 2,
      this.tileSize - padding * 2
    );
  }

  /**
   * Draw a circle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Circle color
   * @param {number} ratio - Size ratio
   */
  drawCircle(x, y, color, ratio) {
    const centerX = x * this.tileSize + this.tileSize / 2;
    const centerY = y * this.tileSize + this.tileSize / 2;
    const radius = (this.tileSize / 2) * ratio;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  }
}