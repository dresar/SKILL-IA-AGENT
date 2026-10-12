# Nokomen

> Standar zero-comment mutlak yang melarang segala komentar dan docstring.

## Kategori
Code Quality

## Instalasi
```bash
npx skills add dresar/SKILL-IA-AGENT -s nokomen
```

## Demo Prompt
```text
Enforce zero comments policy across TypeScript codebase.
```

## Demo Output
```typescript
export interface SkillPayload {
  id: string;
  slug: string;
  name: string;
}

export function validateSkillPayload(payload: SkillPayload): boolean {
  return Boolean(payload.id && payload.slug && payload.name.trim().length > 0);
}
```
