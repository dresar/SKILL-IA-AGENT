import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-accent text-accent-foreground hover:bg-accent-strong active:opacity-90 font-medium",
      secondary: "bg-surface-raised text-text-primary hover:bg-surface-hover border border-border",
      outline: "bg-transparent text-text-primary border border-border hover:bg-surface-raised hover:border-text-muted",
      ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised",
      danger: "bg-status-danger/10 text-status-danger border border-status-danger/20 hover:bg-status-danger/20"
    }[variant];

    const sizeStyles = {
      sm: "h-8 px-2.5 text-xs rounded-md gap-1.5",
      md: "h-9 px-3.5 text-sm rounded-lg gap-2",
      lg: "h-11 px-5 text-base rounded-lg gap-2.5"
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-colors select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
