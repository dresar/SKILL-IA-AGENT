"use client";

import React, { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Code,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Showcase {
  id: string;
  showcaseType: string;
  title: string;
  description?: string | null;
  status: string;
  externalUrl?: string | null;
  staticArtifactRef?: string | null;
  viewportConfig?: unknown;
}

interface ShowcaseViewerProps {
  showcases: Showcase[];
  skillName: string;
}

export function ShowcaseViewer({ showcases, skillName }: ShowcaseViewerProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeIndex, setActiveIndex] = useState(0);

  if (!showcases || showcases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-surface border border-border text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-text-muted" />
        <h4 className="font-semibold text-sm text-text-primary">Preview Unavailable</h4>
        <p className="text-xs text-text-muted max-w-sm">
          No live interactive showcase has been verified for this skill yet.
        </p>
      </div>
    );
  }

  const current = showcases[activeIndex] || showcases[0];

  const viewportWidths = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto",
    mobile: "max-w-[375px] mx-auto"
  }[viewport];

  return (
    <div className="rounded-xl bg-surface border border-border overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface-raised/40">
        <div className="flex items-center gap-2">
          {showcases.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                activeIndex === i
                  ? "bg-accent/15 text-accent font-semibold"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {sc.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {current.showcaseType === "live_demo" && (
            <div className="hidden sm:flex items-center bg-background rounded-lg border border-border p-0.5">
              <button
                onClick={() => setViewport("desktop")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewport === "desktop" ? "bg-surface-raised text-accent" : "text-text-muted hover:text-text-primary"
                )}
                aria-label="Desktop viewport"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewport === "tablet" ? "bg-surface-raised text-accent" : "text-text-muted hover:text-text-primary"
                )}
                aria-label="Tablet viewport"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewport === "mobile" ? "bg-surface-raised text-accent" : "text-text-muted hover:text-text-primary"
                )}
                aria-label="Mobile viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {current.externalUrl && (
            <a
              href={current.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md border border-border hover:bg-surface-raised transition-colors"
            >
              <span>Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-background/50 min-h-[380px] flex items-center justify-center">
        {current.showcaseType === "live_demo" && current.externalUrl ? (
          <div className={cn("transition-all duration-300 w-full h-[420px] rounded-lg border border-border overflow-hidden bg-background", viewportWidths)}>
            <iframe
              src={current.externalUrl}
              title={`${skillName} Preview`}
              sandbox="allow-scripts allow-forms"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        ) : current.showcaseType === "sample_output" || current.showcaseType === "documentation" ? (
          <div className="w-full max-w-3xl rounded-lg bg-surface border border-border p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-text-muted text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-accent" />
                Verified Artifact Output
              </span>
              <Badge variant="accent">Standard Output</Badge>
            </div>
            <pre className="text-text-primary leading-relaxed whitespace-pre-wrap overflow-x-auto">
              <code>{current.description || "Sample output demonstrated by skill execution."}</code>
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-text-muted" />
            <p className="text-sm font-medium text-text-primary">{current.title}</p>
            {current.description && (
              <p className="text-xs text-text-muted max-w-md">{current.description}</p>
            )}
          </div>
        )}
      </div>

      {current.description && current.showcaseType !== "sample_output" && (
        <div className="px-4 py-3 border-t border-border bg-surface text-xs text-text-secondary">
          {current.description}
        </div>
      )}
    </div>
  );
}
