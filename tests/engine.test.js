/**
 * Game Engine Tests
 */

import { GameEngine } from '../src/game/engine.js';

describe('GameEngine', () => {
  let engine;
  const mockLevelData = {
    player: { x: 2, y: 2 },
    boxes: [{ x: 3, y: 2 }],
    targets: [{ x: 4, y: 2 }],
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 1, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }
    ]
  };

  beforeEach(() => {
    engine = new GameEngine(mockLevelData);
  });

  test('should initialize with correct state', () => {
    const state = engine.getState();
    expect(state.player).toEqual({ x: 2, y: 2 });
    expect(state.boxes).toHaveLength(1);
    expect(state.targets).toHaveLength(1);
    expect(state.moves).toBe(0);
    expect(state.won).toBe(false);
  });

  test('should move player to valid position', () => {
    const result = engine.move('right');
    expect(result.moved).toBe(true);
    expect(result.moves).toBe(1);
    
    const state = engine.getState();
    expect(state.player).toEqual({ x: 3, y: 2 });
  });

  test('should not move player into wall', () => {
    const result = engine.move('up');
    expect(result.moved).toBe(false);
    expect(result.moves).toBe(0);
    
    const state = engine.getState();
    expect(state.player).toEqual({ x: 2, y: 2 });
  });

  test('should push box when moving towards it', () => {
    const result = engine.move('right');
    expect(result.moved).toBe(true);
    
    const state = engine.getState();
    expect(state.boxes[0]).toEqual({ x: 4, y: 2 });
  });

  test('should not push box into wall', () => {
    // Move box to position (3,2) then try to push it right again
    engine.move('right');
    const result = engine.move('right');
    
    expect(result.moved).toBe(false);
    expect(result.moves).toBe(1);
  });

  test('should detect win condition', () => {
    // Move box to target
    engine.move('right');
    const state = engine.getState();
    expect(state.won).toBe(true);
  });

  test('should undo last move', () => {
    engine.move('right');
    const undoResult = engine.undo();
    
    expect(undoResult.undone).toBe(true);
    expect(undoResult.moves).toBe(0);
    
    const state = engine.getState();
    expect(state.player).toEqual({ x: 2, y: 2 });
    expect(state.boxes[0]).toEqual({ x: 3, y: 2 });
  });

  test('should limit undo history to 10 moves', () => {
    // Create a more open level for testing
    const openLevel = {
      player: { x: 1, y: 1 },
      boxes: [{ x: 2, y: 1 }],
      targets: [{ x: 10, y: 1 }],
      walls: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
        { x: 0, y: 1 }, { x: 11, y: 1 },
        { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }
      ]
    };
    
    const testEngine = new GameEngine(openLevel);
    
    // Make 15 moves by moving back and forth
    for (let i = 0; i < 15; i++) {
      testEngine.move(i % 2 === 0 ? 'right' : 'left');
    }
    
    expect(testEngine.history.length).toBe(10);
  });
});