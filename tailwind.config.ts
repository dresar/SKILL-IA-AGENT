import type { Config } from "tailwindcss";

const withOpacity = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity("--background"),
        surface: {
          DEFAULT: withOpacity("--surface"),
          raised: withOpacity("--surface-raised"),
          hover: withOpacity("--surface-hover")
        },
        border: withOpacity("--border"),
        text: {
          primary: withOpacity("--text-primary"),
          secondary: withOpacity("--text-secondary"),
          muted: withOpacity("--text-muted")
        },
        accent: {
          DEFAULT: withOpacity("--accent"),
          strong: withOpacity("--accent-strong"),
          foreground: withOpacity("--accent-foreground")
        },
        status: {
          success: withOpacity("--success"),
          warning: withOpacity("--warning"),
          danger: withOpacity("--danger")
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
