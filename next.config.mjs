import createMDX from "@next/mdx";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // 정적 export는 프로덕션 빌드에서만. 개발(next dev)에선 끄면 동적 라우트(/post/[slug])가
    // generateStaticParams에 없어도 요청 시 즉시 렌더돼서, 새로 저장한 mdx가 바로 열린다.
    output: process.env.NODE_ENV === "production" ? "export" : undefined,
    distDir: process.env.NEXT_DIST_DIR || ".next",
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    reactStrictMode: true,
};

export default withMDX(nextConfig);
