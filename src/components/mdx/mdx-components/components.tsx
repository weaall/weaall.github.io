"use client";

import React from "react";
import * as tw from "./components.styles";
import { useEffect, useState } from "react";

export function H1({ children }: { children?: React.ReactNode }) {
    return <tw.H1>{children}</tw.H1>;
}

export function H2({ children }: { children?: React.ReactNode }) {
    return (
        <tw.H2>
            <a href={`#${children || ""}`}>{children}</a>
        </tw.H2>
    );
}

export function H3({ children }: { children?: React.ReactNode }) {
    return <tw.H3>{children}</tw.H3>;
}

export function CheckBoxT({ children }: { children?: React.ReactNode }) {
    return (
        <tw.CheckBoxWrap>
            <tw.H4 type="checkbox" defaultChecked={true} disabled />
            <tw.CheckBoxLabel>{children}</tw.CheckBoxLabel>
        </tw.CheckBoxWrap>
    );
}

export function CheckBoxF({ children }: { children?: React.ReactNode }) {
    return (
        <tw.CheckBoxWrap>
            <tw.H4 type="checkbox" defaultChecked={false} disabled />
            <tw.CheckBoxLabel>{children}</tw.CheckBoxLabel>
        </tw.CheckBoxWrap>
    );
}

export function P({ children }: { children?: React.ReactNode }) {
    return <tw.P>{children}</tw.P>;
}

export function A({ href, children }: { href?: string; children?: React.ReactNode }) {
    return (
        <tw.A target="_blank" href={href}>
            {children}
        </tw.A>
    );
}

export function Li({ children }: { children?: React.ReactNode }) {
    return <tw.Li>{children}</tw.Li>;
}

export function Hr({ children }: { children?: React.ReactNode }) {
    return <tw.Hr>{children}</tw.Hr>;
}

export function Code({ className, children }: { className?: string; children?: React.ReactNode }) {
    const language = className ? className.replace("language-", "") : "";
    const [highlightedCode, setHighlightedCode] = useState(children?.toString() || "");

    useEffect(() => {
        // 리로드 여부를 확인하기 위해 sessionStorage 사용
        if (!sessionStorage.getItem('reloaded')) {
            // 페이지 로드 시 캐시 초기화 및 새로 고침
            if (window.localStorage) {
                window.localStorage.clear();
            }
            if (window.sessionStorage) {
                window.sessionStorage.clear();
            }

            // 브라우저 캐시 비우기
            if ('caches' in window) {
                caches.keys().then((cacheNames) => {
                    cacheNames.forEach((cacheName) => {
                        caches.delete(cacheName); // 캐시 삭제
                    });
                });
            }

            // 리로드 상태를 sessionStorage에 저장
            sessionStorage.setItem('reloaded', 'true');

            // 페이지를 리로드
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        async function loadHighlight() {
            if (language) {
                try {
                    const hljs = (await import("highlight.js")).default;
                    if (hljs.getLanguage(language)) {
                        setHighlightedCode(
                            hljs.highlight(children?.toString() || "", { language }).value
                        );
                    }
                } catch (error) {
                    console.error("Highlight.js 로딩 중 에러:", error);
                    setHighlightedCode(children?.toString() || "");
                }
            }
        }
        loadHighlight();
    }, [children, language]);

    return (
        <tw.CodeWrapC className="hljs">
            {language && (
                <tw.ClassWrap>
                    <tw.ClassLabel>{language}</tw.ClassLabel>
                </tw.ClassWrap>
            )}
            <tw.CodeBoxC>
                <tw.Code dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
            </tw.CodeBoxC>
        </tw.CodeWrapC>
    );
}

export function Pre({ className, children }: { className?: string; children?: React.ReactNode }) {
    return <tw.Pre>{children}</tw.Pre>;
}

export function Strong({ children }: { children?: React.ReactNode }) {
    return <tw.Strong>{children}</tw.Strong>;
}

export function Em({ children }: { children?: React.ReactNode }) {
    return <tw.Em>{children}</tw.Em>;
}

export function Img({ title, src, children }: { title?: string; src?: string; children?: React.ReactNode }) {
    return (
        <tw.ImgWrap>
            <tw.Img src={src}>{children}</tw.Img>
            <tw.ImgTitle>{title}</tw.ImgTitle>
        </tw.ImgWrap>
    );
}

export function Table({ children }: { children?: React.ReactNode }) {
    return <tw.Table>{children}</tw.Table>;
}

export function Thead({ children }: { children?: React.ReactNode }) {
    return <tw.Thead>{children}</tw.Thead>;
}

export function Tbody({ children }: { children?: React.ReactNode }) {
    return <tw.Tbody>{children}</tw.Tbody>;
}

export function Tr({ children }: { children?: React.ReactNode }) {
    return <tw.Tr>{children}</tw.Tr>;
}

export function Th({ children }: { children?: React.ReactNode }) {
    return <tw.Th>{children}</tw.Th>;
}

export function Td({ children }: { children?: React.ReactNode }) {
    return <tw.Td>{children}</tw.Td>;
}
