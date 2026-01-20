# Alpine.js Card Games

A lightweight, browser-based card games platform using a standard 52-card deck, built with Alpine.js and TypeScript. Currently implementing Klondike Solitaire as the first game.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Testing
```bash
# Run tests once
npm test -- --run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

See [Testing Guide](docs/testing.md) for more details on writing and running tests.

## 📋 Project Management

This project uses AI-assisted workflows to maintain context and ensure quality.

### Getting the Latest State

To see the current project status and what's been completed:

```bash
/resume
```

Or manually run:
```bash
./scripts/context_summary.sh
```

This will show:
- Current git status
- Active action items
- Recent commits

### Starting the Next Task

To begin working on the next task:

1. **Check what's next:**
   ```bash
   cat docs/action_items.md
   ```

2. **Use the suggested prompt** from the action items document, or ask:
   > "What's the next action item? Let's work on it."

3. **Follow the task implementation workflow:**
   ```bash
   /task_implementation
   ```
   
   Or manually:
   ```bash
   ./scripts/task_check.sh
   ```

## 📚 Documentation

- **[Project Brief](docs/project_brief.md)** - Overview, tech stack, and feature roadmap
- **[Action Items](docs/action_items.md)** - Active task list with suggested prompts
- **[Bug Tracker](docs/bug_tracker.md)** - Track and manage discovered issues
- **[Testing Guide](docs/testing.md)** - How to write and run tests with Vitest

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS
- **Logic:** TypeScript
- **Framework:** Alpine.js
- **Build Tool:** Vite
- **Testing:** Vitest

## 📖 Workflows

- **`/resume`** - Get project context and current status
- **`/task_implementation`** - Guidelines for implementing tasks with proper branching and testing

---

**Note:** This project is designed to work seamlessly with AI assistants. Use the workflows above to maintain context and follow best practices.
