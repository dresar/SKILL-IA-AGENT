import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import {
  getPublishedSkills,
  getSkillDetailBySlug,
  getAllCategories
} from "@/server/services/skills";
import { db } from "@/lib/db/client";
import { installRecipes, showcases } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export function createMcpServer() {
  const server = new Server(
    {
      name: "skillagent-registry",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search_skills",
          description: "Search published AI agent skills by keyword, category, or type.",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search keyword" },
              category: { type: "string", description: "Category slug filter" },
              skill_type: { type: "string", description: "Skill type filter" },
              limit: { type: "number", description: "Max results (1-50)" }
            }
          }
        },
        {
          name: "get_skill",
          description: "Retrieve comprehensive metadata for a specific published AI skill by slug.",
          inputSchema: {
            type: "object",
            properties: {
              slug: { type: "string", description: "Skill unique slug" }
            },
            required: ["slug"]
          }
        },
        {
          name: "get_skill_content",
          description: "Retrieve the primary documentation or instructions of a published skill.",
          inputSchema: {
            type: "object",
            properties: {
              slug: { type: "string", description: "Skill unique slug" },
              max_chars: { type: "number", description: "Maximum character length" }
            },
            required: ["slug"]
          }
        },
        {
          name: "get_install_command",
          description: "Get validated installation command recipe for a target agent (e.g. antigravity, claude-code, cursor).",
          inputSchema: {
            type: "object",
            properties: {
              slug: { type: "string", description: "Skill unique slug" },
              target: { type: "string", description: "Target environment identifier" }
            },
            required: ["slug"]
          }
        },
        {
          name: "list_categories",
          description: "List all public skill categories.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "get_skill_preview",
          description: "Retrieve preview and showcase metadata for a published skill.",
          inputSchema: {
            type: "object",
            properties: {
              slug: { type: "string", description: "Skill unique slug" }
            },
            required: ["slug"]
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const typedArgs = (args || {}) as Record<string, unknown>;

    if (name === "search_skills") {
      const query = typeof typedArgs.query === "string" ? typedArgs.query : undefined;
      const category = typeof typedArgs.category === "string" ? typedArgs.category : undefined;
      const skillType = typeof typedArgs.skill_type === "string" ? typedArgs.skill_type : undefined;
      const limit = typeof typedArgs.limit === "number" ? Math.min(typedArgs.limit, 50) : 20;

      const items = await getPublishedSkills({
        query,
        category,
        skillType,
        limit
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              items.map((i) => ({
                slug: i.slug,
                name: i.name,
                summary: i.summary,
                skillType: i.skillType,
                author: i.authorDisplay,
                license: i.licenseSpdx,
                sourceUrl: i.sourceUrl,
                verificationStatus: i.verificationStatus,
                categories: i.categories.map((c: { name: string }) => c.name),
                primaryInstallCommand: i.primaryRecipe?.command
              })),
              null,
              2
            )
          }
        ]
      };
    }

    if (name === "get_skill") {
      const slug = String(typedArgs.slug || "");
      if (!slug) {
        return {
          isError: true,
          content: [{ type: "text", text: "Missing required argument: slug" }]
        };
      }

      const detail = await getSkillDetailBySlug(slug);
      if (!detail) {
        return {
          isError: true,
          content: [{ type: "text", text: `Skill not found: ${slug}` }]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(detail, null, 2)
          }
        ]
      };
    }

    if (name === "get_skill_content") {
      const slug = String(typedArgs.slug || "");
      const maxChars = typeof typedArgs.max_chars === "number" ? typedArgs.max_chars : 8000;

      const detail = await getSkillDetailBySlug(slug);
      if (!detail) {
        return {
          isError: true,
          content: [{ type: "text", text: `Skill not found: ${slug}` }]
        };
      }

      let text = detail.description;
      let truncated = false;
      if (text.length > maxChars) {
        text = text.slice(0, maxChars);
        truncated = true;
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                slug: detail.slug,
                name: detail.name,
                content: text,
                truncated,
                sourceUrl: detail.sourceUrl
              },
              null,
              2
            )
          }
        ]
      };
    }

    if (name === "get_install_command") {
      const slug = String(typedArgs.slug || "");
      const target = typeof typedArgs.target === "string" ? typedArgs.target : "antigravity";

      const detail = await getSkillDetailBySlug(slug);
      if (!detail) {
        return {
          isError: true,
          content: [{ type: "text", text: `Skill not found: ${slug}` }]
        };
      }

      const matched =
        detail.recipes.find((r) => r.target.toLowerCase() === target.toLowerCase()) ||
        detail.recipes[0];

      if (!matched) {
        return {
          isError: true,
          content: [{ type: "text", text: `No install recipe available for target: ${target}` }]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                slug: detail.slug,
                target: matched.target,
                displayLabel: matched.displayLabel,
                command: matched.command,
                verificationStatus: matched.verificationStatus,
                sourceUrl: matched.sourceUrl
              },
              null,
              2
            )
          }
        ]
      };
    }

    if (name === "list_categories") {
      const cats = await getAllCategories();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(cats, null, 2)
          }
        ]
      };
    }

    if (name === "get_skill_preview") {
      const slug = String(typedArgs.slug || "");
      const detail = await getSkillDetailBySlug(slug);
      if (!detail) {
        return {
          isError: true,
          content: [{ type: "text", text: `Skill not found: ${slug}` }]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                slug: detail.slug,
                showcases: detail.showcases,
                assets: detail.assets
              },
              null,
              2
            )
          }
        ]
      };
    }

    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${name}` }]
    };
  });

  return server;
}
