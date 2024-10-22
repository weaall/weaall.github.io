const withMDX = require("@next/mdx")()

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    output: "export",
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    reactStrictMode: false,
    
}

module.exports = withMDX(nextConfig)
