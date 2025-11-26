import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          secondary: "var(--background-secondary)",
          deep: "var(--background-deep)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          bright: "var(--foreground-bright)",
          secondary: "var(--foreground-secondary)",
          disabled: "var(--foreground-disabled)",
        },
        divider: "var(--divider)",
        accent: {
          primary: "var(--accent-primary)",
          success: "var(--accent-success)",
          warning: "var(--accent-warning)",
          error: "var(--accent-error)",
          info: "var(--accent-info)",
        },
      },
    },
  },
  plugins: [],
};
export default config;

