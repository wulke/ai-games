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
```

**Commit Message Guidelines:**
- Use conventional commits format: `type: description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Keep messages concise but descriptive

## 6. Update Documentation

After completing a task:
- Update `docs/action_items.md` to mark the task as `[DONE]`
- Update `docs/project_brief.md` if new features were implemented

---

**Note:** This workflow ensures we always start fresh tasks from a clean commit state and maintain a stable `main` branch.
