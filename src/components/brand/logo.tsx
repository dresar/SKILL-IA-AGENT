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
      <span className={cn("relative flex items-center justify-center shrink-0", iconDimensions)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="h-full w-full" fill="none">
          <rect width="40" height="40" rx="10" fill="#141513" stroke="#2A2B28" strokeWidth="1.5"/>
          <path d="M12 28L20 12L28 28" stroke="#CFCBFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 23H25" stroke="#CFCBFF" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="12" r="2.5" fill="#B7B1FF"/>
          <circle cx="12" cy="28" r="2.2" fill="#B7B1FF"/>
          <circle cx="28" cy="28" r="2.2" fill="#B7B1FF"/>
          <path d="M28 10L30 13L33 13.5L30.5 15.5L31.5 18.5L28.5 17L25.5 18.5L26.5 15.5L24 13.5L27 13Z" fill="#CFCBFF" opacity="0.9"/>
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
