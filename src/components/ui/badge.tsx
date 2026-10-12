import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200/80 dark:border-neutral-700/80",
    accent: "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-transparent font-bold",
    outline: "bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase font-medium rounded-[3px] border transition-colors",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
