import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold active:scale-[0.98]",
      secondary: "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 active:scale-[0.98]",
      outline: "bg-transparent text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-850 active:scale-[0.98]",
      ghost: "bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98]",
      danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98]"
    }[variant];

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-[4px] gap-1.5",
      md: "h-9 px-4 text-xs font-semibold rounded-[4px] gap-2 tracking-wider",
      lg: "h-10 px-5 text-sm font-semibold rounded-[5px] gap-2.5 tracking-wide"
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
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
