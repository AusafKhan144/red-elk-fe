import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    // Ensure Tailwind has higher specificity than Mantine
    important: true,
    // Tailwind v4 compatibility
    future: {
        hoverOnlyWhenSupported: true,
    },
};

export default config;
