# Action Items

## Active Task List

### 1. Project Initialization [DONE]
**Description:** Set up the codebase with the required technology stack.
**Status:** Completed. Project initialized with Vite, TypeScript, and Alpine.js.

### 2. Create "Resume Work" Workflow [DONE]
**Description:** Create a workflow file to help restore context when returning to the project.
**Status:** Completed. Workflow created at `.agent/workflows/resume.md` with helper script `scripts/context_summary.sh`.

### 3. Create "Task Implementation" Workflow [DONE]
**Description:** Create a workflow to guide task execution, ensuring proper branching, testing, and committing.
**Status:** Completed. Workflow created at `.agent/workflows/task_implementation.md` with helper script `scripts/task_check.sh`.

### 4. Create "Brainstorming" Workflow
**Description:** Create a workflow to facilitate structured ideation sessions.
**Suggested Prompt:**
> "Create a workflow file at `.agent/workflows/brainstorming.md`. This workflow should prompt me for a topic, and then guide me through a structured brainstorming process, recording ideas and potential action items."

### 5. Establish TDD Framework
**Description:** Set up the testing environment to support Test Driven Development.
**Suggested Prompt:**
> "Install and configure a testing framework (e.g., Vitest) compatible with Vite and TypeScript. Create a sample test file to verify the configuration and document how to run the tests in watch mode."

### 6. TDD: Deck Implementation
**Description:** Implement the Deck logic using the new TDD framework.
**Suggested Prompt:**
> "Using TDD, implement the `Card` and `Deck` classes. Start by writing a test for a `Card` having a suit and rank, then implement the class to pass. Continue by writing tests for `Deck` shuffling and drawing, then implement."
