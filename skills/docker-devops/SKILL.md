# Docker DevOps

> Eksekusi container sandbox efemeral untuk evaluasi kode agent mandiri.

## Kategori
Workflows

## Instalasi
```bash
npx skills add dresar/SKILL-IA-AGENT -s docker-devops
```

## Demo Prompt
```text
Spin up ephemeral Linux container for unprivileged agent execution.
```

## Demo Output
```typescript
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
USER node
CMD ["npm", "start"]
```
