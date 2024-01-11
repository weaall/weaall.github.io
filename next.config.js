const withMDX = require("@next/mdx")()

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '',
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
}