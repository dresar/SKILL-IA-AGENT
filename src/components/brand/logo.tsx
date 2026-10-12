import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const iconDimensions = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-9 w-9"
  }[size];

  const textStyles = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  }[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 rounded-md",
        className
      )}
    >
      <span className={cn("relative flex items-center justify-center shrink-0 text-text-primary", iconDimensions)}>
        <svg viewBox="0 0 32 32" className="h-full w-full" fill="none" aria-hidden="true">
          <path
            d="M16 3L27.25 9.5V22.5L16 29L4.75 22.5V9.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16L16 3M16 16L4.75 22.5M16 16L27.25 22.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="3" r="1.6" fill="currentColor" />
          <circle cx="27.25" cy="9.5" r="1.6" fill="currentColor" />
          <circle cx="27.25" cy="22.5" r="1.6" fill="currentColor" />
          <circle cx="16" cy="29" r="1.6" fill="currentColor" />
          <circle cx="4.75" cy="22.5" r="1.6" fill="currentColor" />
          <circle cx="4.75" cy="9.5" r="1.6" fill="currentColor" />
          <circle cx="16" cy="16" r="1.8" fill="currentColor" />
        </svg>
      </span>
      {showText && (
        <span className={cn("font-bold tracking-tight text-text-primary flex items-baseline gap-0.5", textStyles)}>
          <span>SkillAgent</span>
          <span className="text-[10px] font-normal text-text-muted leading-none">™</span>
        </span>
      )}
    </Link>
  );
}
