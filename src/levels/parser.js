/**
 * Level Loader - Parse and load level data
 * @version 1.0.0
 */

/**
 * Sokoban map symbols:
 * # - Wall
 * @ - Player
 * $ - Box
 * . - Target
 * * - Box on target
 * + - Player on target
 *   - Floor (empty space)
 */

const LEVELS = [
  {
    id: 1,
    name: '入门关卡',
    map: [
      '  #####',
      '###   #',
      '#.@$  #',
      '### $.#',
      '  #. #',
      '  #####'
    ]
  },
  {
    id: 2,
    name: '简单挑战',
    map: [
      '#####',
      '#   #',
      '# $ #',
      '#  @#',
      '#.. #',
      '#####'
    ]
  },
  {
    id: 3,
    name: '初试身手',
    map: [
      '#######',
      '#     #',
      '# .$. #',
      '#  $@ #',
      '#  .  #',
      '#######'
    ]
  },
  {
    id: 4,
    name: '进阶挑战',
    map: [
      '#######',
      '#  .  #',
      '#  $  #',
      '# .@$ #',
      '#  $  #',
      '#  .  #',
      '#######'
    ]
  },
  {
    id: 5,
    name: '高手试炼',
    map: [
      '########',
      '# . .  #',
      '# $ $  #',
      '#  @   #',
      '# $ $  #',
      '# . .  #',
      '########'
    ]
  }
];

/**
 * Level Loader Class
 */
export class LevelLoader {
  /**
   * Load level by ID
   * @param {number} levelId - Level ID
   * @returns {Object} Level data
   */
  loadLevel(levelId) {
    const level = LEVELS.find(l => l.id === levelId);
    
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }

    return this.parseMap(level.map);
  }

  /**
   * Parse map string to game objects
   * @param {Array<string>} map - Map lines
   * @returns {Object} Parsed level data
   */
  parseMap(map) {
    const walls = [];
    const boxes = [];
    const targets = [];
    let player = { x: 0, y: 0 };

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const char = map[y][x];

        switch (char) {
        case '#':
          walls.push({ x, y });
          break;
        case '@':
          player = { x, y };
          break;
        case '$':
          boxes.push({ x, y });
          break;
        case '.':
          targets.push({ x, y });
          break;
        case '*':
          boxes.push({ x, y });
          targets.push({ x, y });
          break;
        case '+':
          player = { x, y };
          targets.push({ x, y });
          break;
        case ' ':
        default:
          break;
        }
      }
    }

    return {
      width: Math.max(...map.map(line => line.length)),
      height: map.length,
      player,
      boxes,
      targets,
      walls
    };
  }

  /**
   * Get total level count
   * @returns {number} Level count
   */
  getLevelCount() {
    return LEVELS.length;
  }

  /**
   * Get all levels
   * @returns {Array} All levels
   */
  getAllLevels() {
    return LEVELS;
  }
}