import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dresar.github.io";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/login", "/login/", "/api/admin/"]
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "cohere-ai",
          "Amazonbot",
          "Bytespider",
          "Diffbot"
        ],
        allow: ["/", "/skills/", "/categories/", "/library/", "/llms.txt", "/llms-full.txt", "/api/skills", "/api/mcp"],
        disallow: ["/admin", "/admin/", "/login", "/login/", "/api/admin/"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
