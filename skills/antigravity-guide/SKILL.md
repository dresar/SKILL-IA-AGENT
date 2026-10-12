# Antigravity Guide

> Panduan arsitektur Google Antigravity CLI, subagents, dan slash commands.

## Kategori
Workflows

## Instalasi
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
