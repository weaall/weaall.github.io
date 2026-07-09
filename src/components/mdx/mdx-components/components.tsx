"use client";

import React from "react";
import dynamic from "next/dynamic"; 
import * as tw from "./components.styles";

export const Code = dynamic(() => import("./Code"), { ssr: false });

export function H1({ children }: { children?: React.ReactNode }) {
    return <tw.H1>{children}</tw.H1>;
}

export function H2({ children }: { children?: React.ReactNode }) {
    return (
        <tw.H2>{children}</tw.H2>
    );
}

export function H3({ children }: { children?: React.ReactNode }) {
    return <tw.H3>{children}</tw.H3>;
}

export function H4({ children }: { children?: React.ReactNode }) {
    return <tw.H4>{children}</tw.H4>;
}

export function P({ children }: { children?: React.ReactNode }) {
    return <tw.P>{children}</tw.P>;
}

export function Span({ children }: { children?: React.ReactNode }) {
    return <tw.Span>{children}</tw.Span>;
}

export function A({ href, children }: { href?: string; children?: React.ReactNode }) {
    return (
        <tw.A target="_blank" href={href}>
            {children}
        </tw.A>
    );
}

export function Ul({ children }: { children?: React.ReactNode }) {
    return <tw.Ul>{children}</tw.Ul>;
}

export function Ol({ children }: { children?: React.ReactNode }) {
    return <tw.Ol>{children}</tw.Ol>;
}

export function Li({ children }: { children?: React.ReactNode }) {
    return <tw.Li>{children}</tw.Li>;
}

export function Hr({ children }: { children?: React.ReactNode }) {
    return <tw.Hr>{children}</tw.Hr>;
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

// 에디터가 토글 목록을 <ToggleText>로 내보냄 → 포스트에서 크래시 방지 + 에디터와 유사하게 삼각형 표시
export function ToggleText({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 py-[3px] text-[16px] text-(--text)">
            <span className="mt-[4px] select-none text-[11px] text-(--text-muted)">▶</span>
            <span>{children}</span>
        </div>
    );
}

export function Img({ title, src, children }: { title?: string; src?: string; children?: React.ReactNode }) {
    return (
        <tw.ImgWrap>
            <tw.Img src={src} loading="lazy">{children}</tw.Img>
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
