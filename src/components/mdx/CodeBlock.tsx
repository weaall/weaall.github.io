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
    const rawCode = children?.toString() || "";
    const [highlightedCode, setHighlightedCode] = useState(rawCode);
    // 언어가 지정 안 됐거나 미지원이면 자동감지 → 감지된 언어를 라벨로 표시
    const [label, setLabel] = useState(language);
    const [copied, setCopied] = useState(false);

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

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(rawCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            /* 클립보드 접근 불가 무시 */
        }
    };

    return (
        <S.CodeWrapC className="group">
            {/* 우측 상단: 언어 라벨 + 호버 시 복사 버튼 */}
            <div className="absolute right-0 top-0 z-20 flex items-center gap-2 px-3 py-2">
                {label && <S.ClassLabel>{label}</S.ClassLabel>}
                <button
                    type="button"
                    onClick={copy}
                    aria-label="코드 복사"
                    title="코드 복사"
                    className="flex items-center text-(--text-muted) opacity-0 transition-opacity hover:text-(--text) group-hover:opacity-100"
                >
                    {copied ? (
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M3.5 8.5l3 3 6-6.5" stroke="#22863a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                            <path d="M3.25 1.375c-1.036 0-1.875.84-1.875 1.875v6c0 1.036.84 1.875 1.875 1.875h1.625v1.625c0 1.036.84 1.875 1.875 1.875h6c1.036 0 1.875-.84 1.875-1.875v-6c0-1.036-.84-1.875-1.875-1.875h-1.625V3.25c0-1.036-.84-1.875-1.875-1.875zM2.625 3.25c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v1.625H6.75c-1.036 0-1.875.84-1.875 1.875v3.125H3.25a.625.625 0 0 1-.625-.625zm3.5 3.5c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v6c0 .345-.28.625-.625.625h-6a.625.625 0 0 1-.625-.625z" />
                        </svg>
                    )}
                </button>
            </div>
            <S.CodeBoxC>
                <S.Code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
            </S.CodeBoxC>
        </S.CodeWrapC>
    );
}
