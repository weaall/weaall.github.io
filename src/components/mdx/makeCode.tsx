"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { CodeStyles } from "./CodeBlock";

// hljs + useLayoutEffect를 쓰는 CodeBlock은 클라이언트 전용이라 ssr:false로 지연 로드한다.
const CodeBlock = dynamic(() => import("./CodeBlock"), { ssr: false });

// post/dev 코드블록은 스타일 모듈만 다르므로, styles를 주입해 동일 로직을 공유한다.
export function makeCode(styles: CodeStyles) {
    return function Code(props: { className?: string; children?: React.ReactNode }) {
        return <CodeBlock {...props} styles={styles} />;
    };
}
