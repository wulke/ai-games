#!/bin/bash

echo "=================================================="
echo "          PROJECT CONTEXT SUMMARY                 "
echo "=================================================="
echo ""
echo "Timestamp: $(date)"
echo ""

echo "--- GIT STATUS ---"
git status -s
echo ""

echo "--- REMOTE STATUS ---"
git remote -v
git status -uno | grep "Your branch is" || echo "Local branch is up to date with remote."
echo ""

echo "--- UPCOMING ACTION ITEMS ---"
# Naive extraction of the first non-done item or specific markers. 
# For now, just printing the first few lines of the Action Items doc or looking for 'IN PROGRESS'
grep -A 5 "\[IN PROGRESS\]" docs/action_items.md || grep -A 5 "## Active Task List" docs/action_items.md

echo ""
echo "--- RECENT CHANGES (Last 3 commits) ---"
git log -n 3 --oneline 2>/dev/null || echo "No commits yet."

echo ""
echo "=================================================="
