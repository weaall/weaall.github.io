import createMDX from "@next/mdx";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: process.env.NEXT_DIST_DIR || ".next",
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    reactStrictMode: false,
};

export default withMDX(nextConfig);
