# 推箱子 Web 游戏 - 产品需求文档 (PRD)

## 项目概述

**项目名称**: Sokoban Web Game
**类型**: 2D 益智网页游戏
**技术栈**: HTML5 + CSS3 + JavaScript (无框架)
**目标平台**: 桌面浏览器 (Chrome, Firefox, Safari)

---

## 功能需求

### 核心功能

1. **游戏逻辑引擎**
   - 玩家移动（上、下、左、右）
   - 箱子推动逻辑
   - 碰撞检测（墙壁、箱子）
   - 胜利条件判断（所有箱子推到目标位置）

2. **关卡系统**
   - 内置至少 5 个关卡
   - 关卡选择界面
   - 关卡进度保存
   - 难度递增

3. **UI 界面**
   - 游戏主界面
   - 游戏画布
   - 操作说明
   - 步数计数器
   - 重置关卡按钮
   - 下一关按钮

4. **渲染引擎**
   - 2D 网格渲染
   - 平滑动画（可选）
   - 响应式布局

5. **辅助功能**
   - 撤销功能（保存最近 10 步）
   - 暂停功能
   - 键盘快捷键支持

---

## 非功能需求

- **性能**: 游戏运行流畅，帧率 ≥ 60 FPS
- **兼容性**: 支持主流浏览器（Chrome 90+, Firefox 88+, Safari 14+）
- **可访问性**: 支持键盘操作
- **代码质量**: 遵循 ESLint 规则，代码覆盖率 ≥ 80%

---

## 游戏规则

1. **基本规则**
   - 玩家控制角色在网格中移动
   - 可以推动箱子（不能拉）
   - 一次只能推动一个箱子
   - 箱子不能推到墙壁或其他箱子上

2. **胜利条件**
   - 将所有箱子推到指定的目标位置
   - 所有箱子必须在目标位置上

3. **失败条件**
   - 无经典失败条件，可以无限重试

---

## 关卡设计规范

**地图元素**:
- `#` - 墙壁
- `@` - 玩家
- `$` - 箱子
- `.` - 目标位置
- `*` - 箱子在目标位置上
- `+` - 玩家在目标位置上
- ` ` - 空地

**关卡 1** (入门):
```
  #####
###   #
#.@$  #
### $.#
  #. #
  #####
```

**关卡 2**:
```
#####
#   #
# $ #
#  @#
#.. #
#####
```

---

## 用户故事优先级

| ID | 优先级 | 用户故事 | 预计迭代 |
|----|-------|---------|---------|
| US-001 | 1 | 项目初始化和基础结构 | Iteration 1 |
| US-002 | 2 | 关卡数据结构和解析 | Iteration 2 |
| US-003 | 3 | 游戏逻辑引擎（移动、碰撞）| Iteration 3 |
| US-004 | 4 | 渲染引擎（2D 网格绘制）| Iteration 4 |
| US-005 | 5 | UI 界面和控制 | Iteration 5 |
| US-006 | 6 | 关卡选择界面 | Iteration 6 |
| US-007 | 7 | 撤销功能 | Iteration 7 |
| US-008 | 8 | 5 个关卡设计 | Iteration 8 |
| US-009 | 9 | 进度保存和加载 | Iteration 9 |
| US-010 | 10 | 测试和优化 | Iteration 10 |

---

## 技术设计

### 文件结构

```
sokoban-web/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── images/          # 游戏素材（可选）
├── src/
│   ├── game/
│   │   ├── engine.js    # 游戏核心逻辑
│   │   ├── state.js     # 游戏状态管理
│   │   └── rules.js     # 游戏规则
│   ├── renderer/
│   │   ├── canvas.js    # Canvas 渲染
│   │   └── grid.js      # 网格计算
│   ├── levels/
│   │   ├── data.js      # 关卡数据
│   │   └── parser.js    # 地图解析
│   ├── ui/
│   │   ├── controls.js  # UI 控制
│   │   └── display.js   # 界面显示
│   └── main.js          # 入口文件
├── tests/
│   ├── engine.test.js
│   ├── parser.test.js
│   └── e2e.test.js
├── ralph/
│   ├── prd.json
│   └── progress.txt
└── package.json
```

### 数据结构

```javascript
// 游戏状态
{
  level: 1,              // 当前关卡
  player: {x, y},        // 玩家位置
  boxes: [{x, y}],       // 箱子位置
  targets: [{x, y}],     // 目标位置
  walls: [{x, y}],       // 墙壁位置
  moves: 0,              // 步数
  history: [],           // 撤销历史
  won: false             // 胜利状态
}

// 关卡数据
{
  id: 1,
  name: "入门关卡",
  width: 10,
  height: 10,
  map: [
    "#####",
    "#@$.#",
    "#####"
  ]
}
```

---

## 验收标准

### 每个用户故事必须包含：
1. **Typecheck passes**（使用 JSDoc 或 TypeScript）
2. **Tests pass**（Jest 测试）
3. **ESLint pass**
4. **Verify in browser**（使用 browser tool 验证）

### 集成测试
- [ ] 玩家可以正常移动
- [ ] 箱子可以正确推动
- [ ] 碰撞检测准确
- [ ] 胜利条件正确判断
- [ ] UI 响应流畅

---

## 已知风险

1. **关卡设计复杂度**: 关卡数量多，设计难度大
   - 缓解措施: 使用开源关卡数据或关卡编辑器

2. **浏览器兼容性**: 不同浏览器渲染可能有差异
   - 缓解措施: 使用标准 Canvas API，测试主流浏览器

3. **性能优化**: 大关卡可能导致性能问题
   - 缓解措施: 按需渲染，使用 requestAnimationFrame

---

## 参考资料

- [Sokoban Wiki](https://en.wikipedia.org/wiki/Sokoban)
- [经典关卡库](http://www.sokobano.de/wiki/index.php?title=Level)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

*PRD 版本: 1.0*
*创建日期: 2026-02-25*
*负责人: OpenClaw AI Agent*