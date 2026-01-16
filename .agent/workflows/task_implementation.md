---
description: Task implementation workflow ensuring proper branching, testing, and committing.
---

# Task Implementation Workflow

This workflow should be followed for **every task** to ensure code quality and proper version control.

## 1. Branch Check & Management

Before starting work, ensure you're on a feature branch (not `main`).

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

## 4. Commit Your Changes

Once tests pass, commit your work:

```bash
git add .
git commit -m "feat: descriptive commit message"
```

**Commit Message Guidelines:**
- Use conventional commits format: `type: description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Keep messages concise but descriptive

## 5. Update Documentation

After completing a task:
- Update `docs/action_items.md` to mark the task as `[DONE]`
- Update `docs/project_brief.md` if new features were implemented

---

**Note:** This workflow ensures we always start fresh tasks from a clean commit state and maintain a stable `main` branch.
