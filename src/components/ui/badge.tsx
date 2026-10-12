import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-raised text-text-secondary border-border",
    accent: "bg-accent/10 text-accent border-accent/20",
    outline: "bg-transparent text-text-muted border-border",
    success: "bg-status-success/10 text-status-success border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/20"
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border transition-colors",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
