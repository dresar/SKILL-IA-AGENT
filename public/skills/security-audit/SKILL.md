# Security Audit

> Pemindaian kerentanan AST otomatis, deteksi bocoran rahasia, dan audit input.

## Kategori
Code Quality

## Instalasi
```bash
npx skills add dresar/SKILL-IA-AGENT -s security-audit
```

## Demo Prompt
```text
Scan codebase for hardcoded connection strings and AST injection risks.
```

## Demo Output
```typescript
export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, (char) => `&#${char.charCodeAt(0)};`);
}
```
