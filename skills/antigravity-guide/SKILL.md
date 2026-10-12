# Antigravity Guide

> Comprehensive guide for Google Antigravity CLI, subagents, and slash commands.

## Category
Workflows

## Installation
```bash
npx skills add dresar/SKILL-IA-AGENT -s antigravity-guide
```

## Demo Prompt
```text
Spawn specialized subagent for concurrent background task execution.
```

## Demo Output
```typescript
await invoke_subagent({
  Subagents: [{
    TypeName: "research",
    Role: "Codebase Researcher",
    Prompt: "Audit database schema relationships and verify foreign keys."
  }]
});
```
