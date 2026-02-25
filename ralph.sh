#!/bin/bash
# Ralph Loop 自动化脚本
# 持续运行直到所有用户故事完成

set -e

PROJECT_DIR="/Users/appweb/.openclaw/workspace/sokoban-web"
PRD_FILE="$PROJECT_DIR/ralph/prd.json"
PROGRESS_FILE="$PROJECT_DIR/ralph/progress.txt"
MAX_ITERATIONS=20
CURRENT_ITERATION=0

echo "🎮 Ralph Loop - Sokoban Web Game"
echo "===================================="
echo ""

cd "$PROJECT_DIR"

while [ $CURRENT_ITERATION -lt $MAX_ITERATIONS ]; do
    CURRENT_ITERATION=$((CURRENT_ITERATION + 1))
    echo "📍 迭代 $CURRENT_ITERATION/$MAX_ITERATIONS"
    
    # 检查是否全部完成
    REMAINING=$(jq '.userStories[] | select(.passes == false) | .id' "$PRD_FILE" | wc -l | tr -d ' ')
    
    if [ "$REMAINING" -eq 0 ]; then
        echo "✅ 所有的用户故事已完成！"
        echo ""
        jq '.userStories[] | {id, title, passes}' "$PRD_FILE"
        echo ""
        echo "🎉 项目完成！"
        exit 0
    fi
    
    echo "⏳ 剩余 $REMAINING 个故事待完成"
    echo ""
    
    # 找下一个任务
    NEXT_STORY=$(jq '.userStories[] | select(.passes == false) | sort_by(.priority) | .[0] | {
        id: .id,
        title: .title,
        priority: .priority,
        acceptanceCriteria: .acceptanceCriteria
    }' "$PRD_FILE")
    
    STORY_ID=$(echo "$NEXT_STORY" | jq -r '.id')
    STORY_TITLE=$(echo "$NEXT_STORY" | jq -r '.title')
    STORY_PRIORITY=$(echo "$NEXT_STORY" | jq -r '.priority')
    
    echo "📋 下一个任务:"
    echo "   ID: $STORY_ID"
    echo "   标题: $STORY_TITLE"
    echo "   优先级: $STORY_PRIORITY"
    echo ""
    
    # 这里应该是调用子代理实现任务
    # 但由于 OpenClaw 的限制，我们需要手动触发
    echo "⚠️  请在 OpenClaw 中执行以下任务："
    echo ""
    echo "   任务: 实现 $STORY_ID - $STORY_TITLE"
    echo "   验收标准:"
    echo "$NEXT_STORY" | jq -r '.acceptanceCriteria[]' | sed 's/^/     - /'
    echo ""
    echo "   实现后需要："
    echo "     1. 运行质量检查 (npm run lint && npm test)"
    echo "     2. Git 提交代码"
    echo "     3. 更新 ralph/prd.json 的 passes: true"
    echo "     4. 追加记录到 ralph/progress.txt"
    echo ""
    
    # 等待用户完成
    read -p "完成后按 Enter 继续，或输入 'quit' 退出: " INPUT
    
    if [ "$INPUT" = "quit" ]; then
        echo "👋 用户手动退出"
        exit 0
    fi
    
    echo ""
    echo "✓ 迭代 $CURRENT_ITERATION 完成"
    echo "----------------------------------------"
    echo ""
    
    sleep 2
done

echo "⚠️  达到最大迭代次数 $MAX_ITERATIONS"
echo "📊 当前进度："
jq '.userStories[] | select(.passes == true) | .id' "$PRD_FILE"