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

// className을 전달해야 remark-gfm이 붙인 contains-task-list / task-list-item 클래스가 DOM에 남아
// 태스크리스트(체크박스)와 일반 목록을 CSS로 구분할 수 있다.
export function Ul({ className, children }: { className?: string; children?: React.ReactNode }) {
    return <tw.Ul className={className}>{children}</tw.Ul>;
}

export function Ol({ className, children }: { className?: string; children?: React.ReactNode }) {
    return <tw.Ol className={className}>{children}</tw.Ol>;
}

export function Li({ className, children }: { className?: string; children?: React.ReactNode }) {
    return <tw.Li className={className}>{children}</tw.Li>;
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

// 토글: 삼각형 클릭으로 접기/펼치기. 새 형식은 text(제목)+children(본문)을 받고,
// 구버전(플랫) 형식은 children만 요약으로 렌더(접기 없음).
export function ToggleText({
    text,
    heading,
    color,
    children,
}: {
    text?: string;
    heading?: string;
    color?: string;
    children?: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(true);
    const Triangle = ({ open: o }: { open: boolean }) => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            className="mt-[5px] mr-[6px] shrink-0 text-(--text-muted)"
            style={{ transform: o ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .15s" }}
        >
            <path
                d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z"
                fill="currentColor"
            />
        </svg>
    );

    // 구버전 호환: text 없으면 children이 제목, 정적 표시
    if (text === undefined) {
        return (
            <div className="flex items-start text-[16px] leading-[1.4] text-(--text)">
                <Triangle open />
                <span className="py-[3px]">{children}</span>
            </div>
        );
    }

    let label = text;
    try {
        label = decodeURIComponent(text);
    } catch {
        /* 원문 유지 */
    }
    const size = heading === "h1" ? "text-[30px] font-bold" : heading === "h2" ? "text-[24px] font-semibold" : heading === "h3" ? "text-[20px] font-medium" : "text-[16px]";

    return (
        <div className="my-[2px]">
            <button type="button" className="flex w-full items-start text-left" onClick={() => setOpen((o) => !o)}>
                <Triangle open={open} />
                <span className={`py-[3px] leading-[1.4] text-(--text) ${size}`} style={{ color }}>
                    {label}
                </span>
            </button>
            {open && <div className="ml-6">{children}</div>}
        </div>
    );
}

export function Img({
    title,
    src,
    width,
    children,
}: {
    title?: string;
    src?: string;
    width?: string | number;
    children?: React.ReactNode;
}) {
    return (
        <tw.ImgWrap>
            <tw.Img src={src} loading="lazy" style={width ? { width: `${width}px`, maxWidth: "100%" } : undefined}>
                {children}
            </tw.Img>
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
