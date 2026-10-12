import type { Config } from "tailwindcss";

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
        background: "#090A09",
        surface: {
          DEFAULT: "#141513",
          raised: "#1B1C1A",
          hover: "#222320"
        },
        border: "#2A2B28",
        text: {
          primary: "#F1F1EE",
          secondary: "#A5A79F",
          muted: "#777A72"
        },
        accent: {
          DEFAULT: "#CFCBFF",
          strong: "#B7B1FF",
          foreground: "#181724"
        },
        status: {
          success: "#8DD8B1",
          warning: "#E8C17D",
          danger: "#F09A9A"
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
