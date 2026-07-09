import React, { useState, useLayoutEffect } from "react";
import hljs from "highlight.js";

// post/dev 코드블록이 스타일만 다르고 로직이 동일해 공유 컴포넌트로 통합.
// 각 변형은 자신의 styled 모듈(components.styles / devComponents.styles)을 styles로 주입한다.
interface CodeStyles {
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

    useLayoutEffect(() => {
        if (language && hljs.getLanguage(language)) {
            setHighlightedCode(hljs.highlight(children?.toString() || "", { language }).value);
        } else {
            setHighlightedCode(children?.toString() || "");
        }
    }, [children, language]);

    return (
        <S.CodeWrapC>
            {language && (
                <S.ClassWrap>
                    <S.ClassLabel>{language}</S.ClassLabel>
                </S.ClassWrap>
            )}
            <S.CodeBoxC>
                <S.Code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
            </S.CodeBoxC>
        </S.CodeWrapC>
    );
}
