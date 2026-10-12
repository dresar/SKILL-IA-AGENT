# SKILL IA AGENT (Brand: SKILL UIAI)

Open-source AI-agent skill discovery platform with truthful previews, Neon PostgreSQL & Auth integration, and Model Context Protocol (MCP) server.

## Features

- **Skill Registry**: Search, filter, and inspect verified agent skills with category and tag facets.
- **Truthful Showcases**: Sandboxed interactive demos, verified terminal outputs, and screenshot galleries.
- **Install Center**: One-click install commands for Antigravity, Claude Code, and Cursor IDE.
- **Model Context Protocol (MCP)**: Native tools for AI coding agents (`search_skills`, `get_skill`, `get_skill_content`, `get_install_command`, `list_categories`, `get_skill_preview`).
- **Neon Backend**: PostgreSQL schema migrations with Drizzle ORM and Neon Auth identity provider.
- **Curator Studio**: Ingestion pipeline from upstream GitHub repositories and audit logging.
- **AI-Agent Discovery & SEO**: Native support for `llms.txt`, `llms-full.txt`, OpenAPI endpoints, and Schema.org structured data.

## AI Agent Quick-Install & Skill Catalog Index

| Skill Name | Category | Direct Install / Slash Command | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Design** | Frontend | `npx skills add dresar/SKILL-IA-AGENT -s frontend-design` | Tactile dark UI components & responsive layout systems. |
| **UI/UX Text** | Design Systems | `/ui-ux-text` | Ultra-minimalist microcopy standard (max 1 sentence). |
| **Nokomen** | Code Quality | `/nokomen` | Strict zero-comment & clean self-documenting code standard. |
| **Neon Postgres** | Database | `npx skills add neondatabase/agent-skills -s neon-postgres` | Serverless PostgreSQL schema migrations & pooling ops. |
| **Antigravity Guide** | Workflows | `/antigravity-guide` | Comprehensive manual for Google Antigravity & subagents. |
| **Minimalist UI** | Frontend | `npx skills add dresar/SKILL-IA-AGENT -s minimalist-ui` | Editorial web layouts & gapless bento grid architectures. |
| **Superpowers TDD** | Code Quality | `npx skills add obra/superpowers -s superpowers-tdd` | Disciplined test-driven development & coverage verification. |
| **Caveman Compress** | Workflows | `/caveman-compress` | Token compression protocol reducing agent verbosity by 65%. |
| **Taste Filter** | Design Systems | `/taste-filter` | Aesthetic filter blocking generic AI templates & clichés. |
| **Security Audit** | Code Quality | `/security-audit` | Automated AST vulnerability & secret token detection. |
| **Git Workflow** | Workflows | `/git-workflow` | Conventional commits & atomic feature branching. |
| **Docker DevOps** | Workflows | `npx skills add dresar/SKILL-IA-AGENT -s docker-devops` | Ephemeral container sandboxing for autonomous agents. |

## AI Agent Discovery Endpoints

- **LLM Context**: [`https://dresar.github.io/llms.txt`](https://dresar.github.io/llms.txt)
- **Full LLM Prompts & Specs**: [`https://dresar.github.io/llms-full.txt`](https://dresar.github.io/llms-full.txt)
- **Skills Catalog JSON**: [`https://dresar.github.io/api/skills`](https://dresar.github.io/api/skills)
- **MCP Endpoint**: [`https://dresar.github.io/api/mcp`](https://dresar.github.io/api/mcp)
- **MCP Discovery**: [`https://dresar.github.io/.well-known/mcp.json`](https://dresar.github.io/.well-known/mcp.json)


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
