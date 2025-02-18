import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.html"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            boxShadow: {
                custom: "0px 7px 0px 0px #F3F2F1",
                "custom-hover": "0px 1px 0px 0px #F3F2F1",
            },
            colors: {
                main: "#222222",
                "t-main": "#F3F2F1",
                "text-main": "#dddddd",
            },
            screens: {
                mobile: { max: "640px" },
                tablet: { min: "641px", max: "1024px" },
            },
            fontSize: {
                "5xl": "0.7rem",
                "6xl": "0.8rem",
            },
            animation: {
                "grow-up": "grow-up 0.3s ease-in-out forwards",
                "shrink-down": "shrink-down 0.3s ease-in-out forwards",
            },
            keyframes: {
                "grow-up": {
                    "0%": { maxHeight: "0", opacity: "0" },
                    "100%": { maxHeight: "500px", opacity: "1" },
                },
                "shrink-down": {
                    "0%": { maxHeight: "500px", opacity: "1" },
                    "100%": { maxHeight: "0", opacity: "0" },
                },
            },
        },
    },
    plugins: [
        function (api: PluginAPI) {
            const { addUtilities } = api;
            const newUtilities = {
                ".text-shadow-custom": {
                    "text-shadow": "-1px 0px #F3F2F1, 0px 1px #F3F2F1, 1px 0px white, 0px -1px #F3F2F1",
                },
                ".custom-border-radius": {
                    "border-radius": "12px",
                },
                ".text-gradient": {
                    background: "linear-gradient(75deg, #000000,rgb(74, 74, 74),rgb(195, 195, 195))",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                },
            };
            addUtilities(newUtilities);
        },
    ],
};

export default config;
