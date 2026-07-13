import React, { useState, useLayoutEffect } from "react";
import hljs from "highlight.js";

// post/dev 코드블록이 스타일만 다르고 로직이 동일해 공유 컴포넌트로 통합.
// 각 변형은 자신의 styled 모듈(components.styles / devComponents.styles)을 styles로 주입한다.
export interface CodeStyles {
    CodeWrapC: React.ElementType;
    ClassWrap: React.ElementType;
    ClassLabel: React.ElementType;
    CodeBoxC: React.ElementType;
    Code: React.ElementType;
}

interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
    styles: CodeStyles;
}

export default function CodeBlock({ className, children, styles: S }: CodeBlockProps) {
    const language = className ? className.replace("language-", "") : "";
    const [highlightedCode, setHighlightedCode] = useState(children?.toString() || "");
    // 언어가 지정 안 됐거나 미지원이면 자동감지 → 감지된 언어를 라벨로 표시
    const [label, setLabel] = useState(language);

    useLayoutEffect(() => {
        const code = children?.toString() || "";
        if (language && hljs.getLanguage(language)) {
            setHighlightedCode(hljs.highlight(code, { language, ignoreIllegals: true }).value);
            setLabel(language);
        } else {
            const r = hljs.highlightAuto(code);
            setHighlightedCode(r.value);
            setLabel(r.language || "");
        }
    }, [children, language]);

    return (
        <S.CodeWrapC>
            {label && (
                <S.ClassWrap>
                    <S.ClassLabel>{label}</S.ClassLabel>
                </S.ClassWrap>
            )}
            <S.CodeBoxC>
                <S.Code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
            </S.CodeBoxC>
        </S.CodeWrapC>
    );
}
