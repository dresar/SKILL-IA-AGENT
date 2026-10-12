# Superpowers TDD

> Framework rekayasa software agentik dengan siklus test-driven development.

## Kategori
Code Quality

## Instalasi
```bash
npx skills add dresar/SKILL-IA-AGENT -s superpowers-tdd
```

## Demo Prompt
```text
Enforce red-green-refactor testing loop before writing production implementation.
```

## Demo Output
```typescript
describe("AuthenticationService", () => {
  it("rejects unauthorized token signature", async () => {
    const res = await verifyAuthToken("invalid-token");
    expect(res.isValid).toBe(false);
  });
});
```
