---
description: Task implementation workflow ensuring proper branching, testing, and committing.
---

# Task Implementation Workflow

This workflow should be followed for **every task** to ensure code quality and proper version control.

## 1. Create Feature Branch (REQUIRED)

**IMPORTANT:** Always create a feature branch BEFORE starting any work. Never commit directly to `main`.

```bash
# Check current branch
git branch

# If on main, create a new feature branch
git checkout -b feature/descriptive-name

# Examples:
# git checkout -b feature/solitaire-core-models
# git checkout -b feature/move-validation
# git checkout -b fix/card-flip-bug
```

**Branch Naming Convention:**
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Optional: Use Task Check Script

```bash
chmod +x scripts/task_check.sh
./scripts/task_check.sh
```

The script will:
- Check your current branch
- If on `main`: prompt you to create a new feature branch
- If on a feature branch: ask if you want to continue or switch branches

## 2. Implement Your Changes

Make your code changes following the task requirements.

## 3. Run Tests

The `task_check.sh` script automatically runs tests if a test script exists in `package.json`.

To manually run tests:
```bash
npm test
```

## 4. Create Pull Request Document

Before committing, create a PR document to review all changes:

**Create PR file:**
```bash
# Create PR directory if it doesn't exist
mkdir -p docs/pull_requests

# Create PR document (increment number for each PR)
touch docs/pull_requests/pr_XXX_description.md
```

**PR Document Template:**
```markdown
# Pull Request: [Task Name]

**Branch:** `feature/branch-name` → `main`
**Date:** YYYY-MM-DD

## 📋 Task Description
[Brief description of what was implemented]

## 🔨 Changes Implemented
### New Files Created
- List new files and their purpose

### Modified Files
- List modified files and what changed

## ✅ Test Cases
- Test summary (X passed)
- Key test scenarios
- How to run tests

## 🎯 Impact Assessment
- Risk level
- Breaking changes (if any)
- Benefits

## ✍️ Review Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Ready to merge
```

## 5. Commit Your Changes

Once tests pass, commit your work:

```bash
git add .
git commit -m "feat: descriptive commit message"

# REQUIRED: Push to origin
git push -u origin feature/your-branch-name
```

**Commit Message Guidelines:**
- Use conventional commits format: `type: description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Keep messages concise but descriptive

## 6. Create GitHub Pull Request

Instead of merging locally, always create a Pull Request on GitHub.

**Option A: Using GitHub CLI (Recommended)**
```bash
# This will create a PR and give you the link
gh pr create --fill
```

**Option B: Using GitHub Website**
1. Push your branch (Step 5).
2. Visit `https://github.com/wulke/ai-games`.
3. Click "Compare & pull request".
4. Review your changes and submit.

## 7. Merge to Main (After PR Review)

Once the PR is approved on GitHub:
1. Use the GitHub UI to perform a **Squash and Merge**.
2. Alternatively, use the CLI:
   ```bash
   gh pr merge --squash
   ```

3. Locally, clean up your branches:
   ```bash
   # Switch to main and pull latest changes
   git checkout main
   git pull origin main

   # Delete the local feature branch
   git branch -D feature/your-branch-name
   ```

**Why Squash Merge?**
- Keeps main branch history clean with one commit per feature
- Preserves detailed commit history in feature branch (until deleted)
- Makes it easier to revert entire features if needed

## 8. Update Documentation

After merging to main:
- Update `docs/action_items.md` to mark the task as `[DONE]`
- Update `docs/project_brief.md` if new features were implemented
- Review existing workflows in `.agent/workflows/` and documentation in `docs/` to ensure any changes from the task are reflected correctly.
- Create new feature branch for next task

---

**Note:** This workflow ensures we always start fresh tasks from a clean commit state and maintain a stable `main` branch.
