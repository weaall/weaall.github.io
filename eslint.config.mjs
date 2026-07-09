import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...nextCoreWebVitals,
    {
        ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"],
    },
    {
        rules: {
            // 이 사이트는 output:"export" 정적 배포라 next/image가 unoptimized로만 동작(최적화 X).
            // <img> 대비 실이득이 없어 no-img-element 경고를 끈다.
            "@next/next/no-img-element": "off",
        },
    },
];
