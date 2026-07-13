// Prettier 자동 포맷. 지원 언어만 동적 import로 로드 → 편집 화면(/newpage)에서만,
// 그것도 포맷할 때만 불러오므로 포스트 페이지 번들에는 영향이 없다.
// Prettier가 지원하지 않는 언어(python/go/rust 등)는 canFormat=false → 원본 유지.

type Loaded = { parser: string; plugins: unknown[] };

// 언어명 → { prettier parser, 필요한 플러그인 모듈 } 로더
const LOADERS: Record<string, () => Promise<Loaded>> = {
    javascript: async () => ({
        parser: "babel",
        plugins: [await import("prettier/plugins/babel"), await import("prettier/plugins/estree")],
    }),
    jsx: async () => ({
        parser: "babel",
        plugins: [await import("prettier/plugins/babel"), await import("prettier/plugins/estree")],
    }),
    typescript: async () => ({
        parser: "typescript",
        plugins: [await import("prettier/plugins/typescript"), await import("prettier/plugins/estree")],
    }),
    tsx: async () => ({
        parser: "typescript",
        plugins: [await import("prettier/plugins/typescript"), await import("prettier/plugins/estree")],
    }),
    json: async () => ({
        parser: "json",
        plugins: [await import("prettier/plugins/babel"), await import("prettier/plugins/estree")],
    }),
    css: async () => ({ parser: "css", plugins: [await import("prettier/plugins/postcss")] }),
    scss: async () => ({ parser: "scss", plugins: [await import("prettier/plugins/postcss")] }),
    less: async () => ({ parser: "less", plugins: [await import("prettier/plugins/postcss")] }),
    html: async () => ({ parser: "html", plugins: [await import("prettier/plugins/html")] }),
    markdown: async () => ({ parser: "markdown", plugins: [await import("prettier/plugins/markdown")] }),
    yaml: async () => ({ parser: "yaml", plugins: [await import("prettier/plugins/yaml")] }),
    graphql: async () => ({ parser: "graphql", plugins: [await import("prettier/plugins/graphql")] }),
};

export function canFormat(lang: string): boolean {
    return !!lang && lang in LOADERS;
}

export async function formatCode(code: string, lang: string): Promise<string> {
    const loader = LOADERS[lang];
    if (!loader || !code.trim()) return code;
    try {
        const { parser, plugins } = await loader();
        const prettier = await import("prettier/standalone");
        const out = await prettier.format(code, {
            parser,
            plugins,
            printWidth: 100,
            tabWidth: 2,
            semi: true,
        } as Parameters<typeof prettier.format>[1]);
        return out.replace(/\n+$/, ""); // 끝 개행 정리
    } catch {
        // 구문 오류 등으로 파싱 실패하면 원본 유지
        return code;
    }
}
