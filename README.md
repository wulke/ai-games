# Alpine.js Card Games

A lightweight, browser-based application to play card games using a standard 52-card deck, built with Alpine.js and TypeScript.

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

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS
- **Logic:** TypeScript
- **Framework:** Alpine.js
- **Build Tool:** Vite

## 📖 Workflows

- **`/resume`** - Get project context and current status
- **`/task_implementation`** - Guidelines for implementing tasks with proper branching and testing

---

**Note:** This project is designed to work seamlessly with AI assistants. Use the workflows above to maintain context and follow best practices.
