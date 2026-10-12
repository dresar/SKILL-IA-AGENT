"use client";

import React, { useState, useMemo } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Code,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  images?: string[];
}

interface ShowcaseViewerProps {
  showcases: Showcase[];
  skillName: string;
  defaultPreviewUrl?: string;
}

export function ShowcaseViewer({
  showcases,
  skillName,
  defaultPreviewUrl
}: ShowcaseViewerProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const normalizedShowcases = useMemo(() => {
    const list: Showcase[] = [];

    if (defaultPreviewUrl) {
      list.push({
        id: "default-preview",
        showcaseType: "image_gallery",
        title: "Visual Preview",
        description: `Visual artifact and interactive architecture diagram for ${skillName}.`,
        status: "ready",
        staticArtifactRef: defaultPreviewUrl,
        images: [
          defaultPreviewUrl,
          defaultPreviewUrl.replace(".svg", ".svg")
        ]
      });
    }

    if (showcases && showcases.length > 0) {
      showcases.forEach((sc) => {
        list.push(sc);
      });
    }

    return Array.from(new Map(list.map((item) => [item.title.toLowerCase(), item])).values());
  }, [showcases, defaultPreviewUrl, skillName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryImgIndex, setGalleryImgIndex] = useState(0);

  const current = normalizedShowcases[activeIndex] || normalizedShowcases[0];

  const galleryImages = useMemo(() => {
    if (!current) return [];
    if (current.images && current.images.length > 0) return current.images;
    if (current.staticArtifactRef) return [current.staticArtifactRef];
    if (defaultPreviewUrl) return [defaultPreviewUrl];
    return [];
  }, [current, defaultPreviewUrl]);

  const viewportWidths = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto",
    mobile: "max-w-[375px] mx-auto"
  }[viewport];

  if (normalizedShowcases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-surface border border-border text-center space-y-2">
        <ImageIcon className="w-8 h-8 text-text-muted" />
        <h4 className="font-semibold text-sm text-text-primary">Preview Verified</h4>
        <p className="text-xs text-text-muted max-w-sm">
          Aset pratinjau arsitektur dan dokumentasi resmi untuk {skillName}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface border border-border overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface-raised/40">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {normalizedShowcases.map((sc, i) => (
            <button
              key={sc.id || sc.title}
              onClick={() => {
                setActiveIndex(i);
                setGalleryImgIndex(0);
              }}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
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

      <div className="p-4 md:p-6 bg-background/50 min-h-[360px] flex flex-col items-center justify-center">
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
        ) : galleryImages.length > 0 ? (
          <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-[16/9] rounded-lg border border-border overflow-hidden bg-neutral-950 flex items-center justify-center">
              <img
                src={galleryImages[galleryImgIndex] || galleryImages[0]}
                alt={`${skillName} Preview ${galleryImgIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setGalleryImgIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryImgIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGalleryImgIndex(idx)}
                    className={cn(
                      "h-12 w-20 rounded border overflow-hidden shrink-0 transition-all",
                      galleryImgIndex === idx
                        ? "border-accent ring-2 ring-accent/30"
                        : "border-border opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
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
