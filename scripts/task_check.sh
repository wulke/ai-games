#!/bin/bash

# Task Implementation Helper Script
# This script ensures proper branch management and testing before committing

echo "=================================================="
echo "       TASK IMPLEMENTATION CHECKLIST              "
echo "=================================================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ -z "$CURRENT_BRANCH" ]; then
    echo "❌ Not in a git repository. Please initialize git first."
    exit 1
fi

echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Branch management
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo "⚠️  You are on the main branch!"
    echo ""
    echo "Please provide a branch name for this task:"
    read -p "Branch name: " BRANCH_NAME
    
    if [ -z "$BRANCH_NAME" ]; then
        echo "❌ No branch name provided. Exiting."
        exit 1
    fi
    
    echo "Creating and switching to branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"
    echo "✅ Now on branch: $BRANCH_NAME"
else
    echo "✅ Working on feature branch: $CURRENT_BRANCH"
    echo ""
    read -p "Continue on this branch? (y/n): " CONTINUE
    
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        echo ""
        read -p "Enter new branch name (or 'main' to switch back): " NEW_BRANCH
        
        if [ "$NEW_BRANCH" = "main" ] || [ "$NEW_BRANCH" = "master" ]; then
            git checkout main 2>/dev/null || git checkout master
        else
            git checkout -b "$NEW_BRANCH"
        fi
        echo "✅ Switched to: $(git rev-parse --abbrev-ref HEAD)"
    fi
fi

echo ""
echo "=================================================="
echo "         RUNNING TESTS                            "
echo "=================================================="
echo ""

# Check if package.json has a test script
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    npm test
    TEST_EXIT_CODE=$?
    
    if [ $TEST_EXIT_CODE -ne 0 ]; then
        echo ""
        echo "❌ Tests failed! Please fix before committing."
        exit 1
    fi
    echo "✅ All tests passed!"
else
    echo "⚠️  No test script found in package.json. Skipping tests."
fi

echo ""
echo "=================================================="
echo "         READY TO COMMIT                          "
echo "=================================================="
echo ""
echo "✅ Branch check complete"
echo "✅ Tests passed (or skipped)"
echo ""
echo "You can now commit your changes with:"
echo "  git add ."
echo "  git commit -m 'Your commit message'"
