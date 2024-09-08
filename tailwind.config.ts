import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["retro", "coffee", "pastel"],
  },
  safelist: [
    {
      pattern: /^text-(primary|secondary|accent|neutral|info|success|warning|error)$/, 
      variants: ['hover', 'focus'], // Add variants if necessary
    },
    {
      pattern: /^btn-(primary|secondary|accent|neutral|info|success|warning|error)$/,
    }
  ]
};
export default config;