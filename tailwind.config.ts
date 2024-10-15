import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            boxShadow: {
                custom: "0px 7px 0px 0px #eeeeee",
                "custom-hover": "0px 1px 0px 0px #eeeeee",
            },
            colors: {
                "main": "#222222",
                "t-main": "#F3F2F1",
            },
            screens: {
                mobile: { max: "640px" },
                tablet: { min: "641px", max: "1024px" },
            },
            fontSize: {
                '5xl': '0.7rem',
                '6xl': '0.8rem'
            }
        },
    },
    plugins: [],
}
export default config
