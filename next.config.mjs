import createMDX from "@next/mdx";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    reactStrictMode: false,
};

export default withMDX(nextConfig);
