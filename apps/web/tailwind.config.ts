import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FFFFFF",
          subtle: "rgb(250 250 250 / 0.3)",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          border: "rgb(228 228 231)",
        },
        text: {
          primary: "rgb(24 24 27)",
          secondary: "rgb(113 113 122)",
        },
        accent: {
          primary: "rgb(79 70 229)",
        },
        status: {
          success: {
            bg: "rgb(236 253 245)",
            text: "rgb(4 120 87)",
          },
          error: {
            bg: "rgb(255 241 242)",
            text: "rgb(190 18 60)",
          },
          pending: {
            bg: "rgb(254 249 195)",
            text: "rgb(161 98 7)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [],
};

export default config;

