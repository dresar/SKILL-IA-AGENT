import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";
const siteUrl = rawSiteUrl.replace(/[\uFEFF\u200B\u00A0]/g, "").trim() || "https://skills-smoky.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" }
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AgenticSkills — AI Agent Skills Directory",
    template: "%s | AgenticSkills"
  },
  description: "Verified agent skills, microcopy standards, and MCP servers.",
  keywords: [
    "ai agent skills",
    "mcp server",
    "model context protocol",
    "antigravity",
    "agent directory",
    "prompt engineering",
    "claude code skills",
    "cursor rules",
    "agent skills directory",
    "llms.txt"
  ],
  authors: [{ name: "Eka Syarif Maulana", url: "https://github.com/dresar" }],
  creator: "Eka Syarif Maulana",
  publisher: "AgenticSkills",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AgenticSkills",
    title: "AgenticSkills — AI Agent Skills Directory",
    description: "Verified agent skills, microcopy standards, and MCP servers.",
    images: [
      {
        url: "/brand/logo.svg",
        width: 800,
        height: 600,
        alt: "AgenticSkills Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AgenticSkills — AI Agent Skills Directory",
    description: "Verified agent skills, microcopy standards, and MCP servers.",
    images: ["/brand/logo.svg"],
    creator: "@dresar"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      { url: "/brand/logo.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/brand/logo.svg" }
    ]
  }
};

const themeScript = `
  try {
    const stored = localStorage.getItem("skill_uiai_theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = stored === "light" || stored === "dark" ? stored : prefersLight ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch {}
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "AgenticSkills",
      "description": "Verified agent skills, microcopy standards, and MCP servers.",
      "publisher": {
        "@type": "Person",
        "name": "Eka Syarif Maulana"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      "name": "AgenticSkills",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Verified agent skills, microcopy standards, and MCP servers."
    }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="help" href="/llms.txt" title="LLM Context Specification" type="text/plain" />
        <link rel="alternate" type="application/json" href="/api/skills" title="Skills JSON API" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs Index" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Complete LLMs Specification" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-text-primary antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
