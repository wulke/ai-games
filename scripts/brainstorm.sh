#!/bin/bash

# Brainstorming Session Helper Script
# Captures ideas and generates action items from brainstorming sessions

echo "=================================================="
echo "       BRAINSTORMING SESSION                      "
echo "=================================================="
echo ""

# Get topic
echo "What topic would you like to brainstorm about?"
read -p "Topic: " TOPIC

if [ -z "$TOPIC" ]; then
    echo "❌ No topic provided. Exiting."
    exit 1
fi

# Create session file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SESSION_FILE="docs/brainstorming_${TIMESTAMP}.md"

# Initialize session file
cat > "$SESSION_FILE" << EOF
# Brainstorming Session: $TOPIC

**Date:** $(date +"%Y-%m-%d %H:%M:%S")

## Ideas

EOF

echo ""
echo "✅ Session started: $TOPIC"
echo "📝 Recording to: $SESSION_FILE"
echo ""
echo "=================================================="
echo "Enter your ideas (one per line)"
echo "Type 'done' when finished"
echo "=================================================="
echo ""

# Capture ideas
IDEA_COUNT=0
while true; do
    read -p "Idea: " IDEA
    
    if [ "$IDEA" = "done" ]; then
        break
    fi
    
    if [ ! -z "$IDEA" ]; then
        echo "- $IDEA" >> "$SESSION_FILE"
        IDEA_COUNT=$((IDEA_COUNT + 1))
        echo "  ✓ Recorded ($IDEA_COUNT ideas so far)"
    fi
done

echo "" >> "$SESSION_FILE"
echo "## Potential Action Items" >> "$SESSION_FILE"
echo "" >> "$SESSION_FILE"
echo "_Review ideas above and add actionable tasks below:_" >> "$SESSION_FILE"
echo "" >> "$SESSION_FILE"

echo ""
echo "=================================================="
echo "         SESSION COMPLETE                         "
echo "=================================================="
echo ""
echo "✅ Captured $IDEA_COUNT ideas"
echo "📄 Session saved to: $SESSION_FILE"
echo ""
echo "Next steps:"
echo "1. Review the session file: cat $SESSION_FILE"
echo "2. Add potential action items to the file"
echo "3. Update docs/action_items.md with any new tasks"
echo ""
