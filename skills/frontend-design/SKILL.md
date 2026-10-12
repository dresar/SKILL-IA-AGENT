# Frontend Design

> Komponen UI berkualitas agency tinggi dan estetika gelap taktil.

## Kategori
Frontend

## Instalasi
```bash
npx skills add dresar/SKILL-IA-AGENT -s frontend-design
```

## Demo Prompt
```text
Design responsive landing page hero with double-bezel cards and kinetic hover.
```

## Demo Output
```typescript
export function HeroBanner() {
  return (
    <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
      <div className="p-8 rounded-[calc(2rem-0.375rem)] bg-[#0B0D13] shadow-inner">
        <h1 className="text-4xl font-bold tracking-tight text-white">Obsidian Interface</h1>
        <p className="text-sm text-neutral-400 mt-2">Precision typography and haptic depth.</p>
      </div>
    </div>
  );
}
```
