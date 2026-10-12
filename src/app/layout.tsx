import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dresar.github.io";

export const viewport: Viewport = {
  themeColor: "#0A0B0E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SKILL UIAI — AI Agent Skills Directory",
    template: "%s | SKILL UIAI"
  },
  description: "Open source AI agent skills directory with Model Context Protocol server.",
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
    "llms.txt",
    "generative ai tools"
  ],
  authors: [{ name: "Eka Syarif Maulana", url: "https://github.com/dresar" }],
  creator: "Eka Syarif Maulana",
  publisher: "SKILL UIAI",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SKILL UIAI",
    title: "SKILL UIAI — AI Agent Skills Directory",
    description: "Open source AI agent skills directory with Model Context Protocol server.",
    images: [
      {
        url: "/brand/logo.svg",
        width: 800,
        height: 600,
        alt: "SKILL UIAI Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SKILL UIAI — AI Agent Skills Directory",
    description: "Open source AI agent skills directory with Model Context Protocol server.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "SKILL UIAI",
      "description": "Open source AI agent skills directory with Model Context Protocol server.",
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
      "name": "SKILL UIAI",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Open source AI agent skills directory with Model Context Protocol server."
    }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
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
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
