# SKILL IA AGENT (Brand: SKILL UIAI)

Open-source AI-agent skill discovery platform with truthful previews, Neon PostgreSQL & Auth integration, and Model Context Protocol (MCP) server.

## Features

- **Skill Registry**: Search, filter, and inspect verified agent skills with category and tag facets.
- **Truthful Showcases**: Sandboxed interactive demos, verified terminal outputs, and screenshot galleries.
- **Install Center**: One-click install commands for Antigravity, Claude Code, and Cursor IDE.
- **Model Context Protocol (MCP)**: Native tools for AI coding agents (`search_skills`, `get_skill`, `get_skill_content`, `get_install_command`, `list_categories`, `get_skill_preview`).
- **Neon Backend**: PostgreSQL schema migrations with Drizzle ORM and Neon Auth identity provider.
- **Curator Studio**: Ingestion pipeline from upstream GitHub repositories and audit logging.

## Tech Stack

- **Framework**: Next.js App Router (TypeScript, React 19)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Auth**: Neon Auth (Managed Better Auth)
- **Styling**: Tailwind CSS with dark restrained developer palette
- **Protocol**: Model Context Protocol (MCP) TypeScript SDK

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

3. Push database schema to Neon:
```bash
npm run db:push
```

4. Seed initial skills:
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

## MCP Configuration

Connect your agent using stdio:
```json
{
  "mcpServers": {
    "skill-uiai": {
      "command": "npx",
      "args": ["tsx", "scripts/mcp-stdio.ts"]
    }
  }
}
```

Or connect via HTTP endpoint: `http://localhost:3000/api/mcp`.

## License

MIT License.
