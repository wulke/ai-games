---
description: Facilitate structured ideation and brainstorming sessions.
---

# Brainstorming Workflow

This workflow helps you capture ideas in a structured way and convert them into actionable tasks.

## 1. Start a Brainstorming Session

Run the brainstorming helper script:

```bash
chmod +x scripts/brainstorm.sh
./scripts/brainstorm.sh
```

The script will:
- Prompt you for a topic
- Create a timestamped markdown file in `docs/`
- Capture your ideas interactively
- Provide a template for converting ideas into action items

## 2. Alternative: AI-Assisted Brainstorming

You can also brainstorm with your AI assistant using this prompt:

> "Let's brainstorm about [TOPIC]. I'll share some initial thoughts, and I'd like you to help me explore different angles, identify potential challenges, and suggest creative solutions."

## 3. Review and Organize Ideas

After capturing ideas:

1. **Review the session file:**
   ```bash
   cat docs/brainstorming_[timestamp].md
   ```

2. **Identify patterns** - Group related ideas together

3. **Prioritize** - Mark high-impact or urgent ideas

## 4. Convert to Action Items

For ideas that need implementation:

1. **Add to action items:**
   - Edit `docs/action_items.md`
   - Create new numbered items with descriptions
   - Include suggested prompts for implementation

2. **Update project brief:**
   - If ideas represent new features, add them to `docs/project_brief.md`
   - Update the appropriate phase in the roadmap

## 5. Archive or Iterate

- Keep brainstorming files in `docs/` for reference
- Revisit old sessions for inspiration
- Run new sessions to explore ideas further

---

**Tips for Effective Brainstorming:**
- Don't filter ideas during capture - record everything
- Build on previous ideas rather than dismissing them
- Consider "what if" scenarios
- Think about edge cases and user perspectives
