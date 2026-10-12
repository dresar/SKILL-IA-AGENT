# Neon Postgres

> Migrasi PostgreSQL serverless, connection pooling, dan branching schema.

## Kategori
Database

## Instalasi
```bash
npx skills add dresar/SKILL-IA-AGENT -s neon-postgres
```

## Demo Prompt
```text
Configure Neon serverless pooled connection with Drizzle ORM.
```

## Demo Output
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```
