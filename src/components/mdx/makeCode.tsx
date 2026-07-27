"use client";

import React from "react";
import CodeBlock, { type CodeStyles } from "./CodeBlock";

// CodeBlock은 순수 컴포넌트(hljs는 useMemo에서 동기 실행, 브라우저 API는 복사 onClick 안에만)라
// SSR로 렌더해도 안전하다. 이전엔 dynamic(ssr:false)로 지연 로드해 코드가 정적 HTML에 담기지 않았고,
// 클라이언트 청크 로드에 의존해 (특히 코드블록이 많은 글에서) 간헐적으로 빈 화면이 되곤 했다.
// → 정적 import로 서버 렌더링해 코드가 항상 HTML에 들어가게 한다.
export function makeCode(styles: CodeStyles) {
    return function Code(props: { className?: string; children?: React.ReactNode }) {
        return <CodeBlock {...props} styles={styles} />;
    };
}
