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
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  }[size];

  const textStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  }[size];

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div className={cn("relative flex items-center justify-center rounded-lg bg-surface border border-border group-hover:border-accent/40 transition-colors", iconDimensions)}>
        <svg viewBox="0 0 40 40" className="w-full h-full p-1" fill="none">
          <path d="M12 28L20 12L28 28" stroke="#CFCBFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 23H25" stroke="#CFCBFF" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="12" r="2.2" fill="#B7B1FF"/>
          <circle cx="12" cy="28" r="2.2" fill="#B7B1FF"/>
          <circle cx="28" cy="28" r="2.2" fill="#B7B1FF"/>
          <path d="M28 8L29.5 11L32.5 11.5L30 13.5L31 16.5L28 15L25 16.5L26 13.5L23.5 11.5L26.5 11Z" fill="#CFCBFF"/>
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight text-text-primary group-hover:text-white transition-colors", textStyles)}>
          SKILL <span className="text-accent">UIAI</span>
        </span>
      )}
    </Link>
  );
}
