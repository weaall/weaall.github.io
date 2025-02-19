import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.html"],
    theme: {
        extend: {
            zIndex: {
                "60": "60",
                "70": "70",
                "80": "80",
                "90": "90",
                "100": "100",
            },
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
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "grow-up": {
                    "0%": { maxHeight: "0", opacity: "0" },
                    "100%": { maxHeight: "500px", opacity: "1" },
                },
                "shrink-down": {
                    "0%": { maxHeight: "500px", opacity: "1" },
                    "100%": { maxHeight: "0", opacity: "0" },
                },
                rotate: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
                riseUp: {
                    "0%": { transform: "translateY(100%)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                riseUpDiagonal: {
                    "0%": { transform: "translate(-100%, 100%)", opacity: "0" },
                    "100%": { transform: "translate(100%, -100%)", opacity: "1" },
                },
                reveal: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fallBounce: {
                    "0%": { transform: "translateY(-100%)", opacity: "0", "animation-timing-function": "ease-in" },
                    "16%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "29%": { transform: "translateY(-70%)", opacity: "1", "animation-timing-function": "ease-in" },
                    "42%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "52%": { transform: "translateY(-45%)", "animation-timing-function": "ease-in" },
                    "62%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "68%": { transform: "translateY(-30%)", "animation-timing-function": "ease-in" },
                    "74%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "79%": { transform: "translateY(-19%)", "animation-timing-function": "ease-in" },
                    "84%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "88%": { transform: "translateY(-10%)", "animation-timing-function": "ease-in" },
                    "92%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "94%": { transform: "translateY(-5%)", "animation-timing-function": "ease-in" },
                    "96%": { transform: "translateY(0)", "animation-timing-function": "ease-out" },
                    "98%": { transform: "translateY(-2%)", "animation-timing-function": "ease-in" },
                    "100%": { transform: "translateY(0)", opacity: "1", "animation-timing-function": "ease-out" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.5s ease-out forwards",
                "grow-up": "grow-up 0.3s ease-in-out forwards",
                "shrink-down": "shrink-down 0.3s ease-in-out forwards",
                rotate: "rotate 4s linear infinite",
                riseUp: "riseUp 1s ease-out forwards",
                riseUpDiagonal: "riseUpDiagonal 1s ease-out forwards",
                reveal: "reveal 0.5s ease-out forwards",
                fallBounce: "fallBounce 2.5s ease-out forwards",
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
                ".text-gradient-gray": {
                    background: "linear-gradient(75deg,rgb(100, 100, 100),rgb(110, 110, 110),rgb(120, 120, 120))",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                },
            };
            addUtilities(newUtilities);
        },
    ],
};

export default config;
