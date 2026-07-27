"use client";

import React from "react";
import * as tw from "./components.styles";
import { makeCode } from "../makeCode";

export const Code = makeCode(tw);

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

    // 에디터 토글과 동일: 타입별 삼각형 크기 / 줄높이 / 글자 스타일
    const SIZES: { [k: string]: { arrow: number; lh: number; cls: string } } = {
        "": { arrow: 16, lh: 24, cls: "text-[16px]" },
        h3: { arrow: 19, lh: 28, cls: "text-[20px] font-medium" },
        h2: { arrow: 23, lh: 34, cls: "text-[24px] font-semibold" },
        h1: { arrow: 28, lh: 42, cls: "text-[30px] font-bold" },
    };
    const PAD = 3;
    const s = SIZES[heading || ""] ?? SIZES[""];

    // 삼각형 SVG를 인라인으로(컴포넌트로 감싸면 매 렌더마다 remount돼 회전 트랜지션이 안 먹음)
    const triangle = (o: boolean) => (
        <span
            className="flex shrink-0 items-center justify-center text-(--text-muted)"
            style={{ height: s.lh + PAD, paddingTop: PAD, width: s.arrow + 8 }}
        >
            <svg
                width={s.arrow}
                height={s.arrow}
                viewBox="0 0 20 20"
                fill="none"
                style={{ transform: o ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
            >
                <path
                    d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z"
                    fill="currentColor"
                />
            </svg>
        </span>
    );

    // 구버전 호환: text 없으면 children이 제목, 정적 표시
    if (text === undefined) {
        return (
            <div className="flex items-start">
                {triangle(true)}
                <span className="py-[3px] text-[16px] leading-[24px] text-(--text)">{children}</span>
            </div>
        );
    }

    let label = text;
    try {
        label = decodeURIComponent(text);
    } catch {
        /* 원문 유지 */
    }

    return (
        <div className="my-[2px]">
            <div className="flex items-start">
                <button type="button" className="cursor-pointer" onClick={() => setOpen((o) => !o)} aria-label="토글">
                    {triangle(open)}
                </button>
                <span className={`px-[2px] text-(--text) ${s.cls}`} style={{ color, lineHeight: `${s.lh}px`, paddingTop: PAD }}>
                    {label}
                </span>
            </div>
            {/* 자식: grid-rows 0fr↔1fr + opacity로 스르르 펼침/접힘 (내용 높이 몰라도 애니메이션됨) */}
            <div
                className="grid transition-all duration-200 ease-out"
                style={{ marginLeft: s.arrow + 8, gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
            >
                <div className="overflow-hidden">{children}</div>
            </div>
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

// 2열(컬럼) 레이아웃: 에디터의 2칸과 동일(50/50, gap-12, 각 칸 min-w-0 flex-1). 모바일은 세로 스택.
export function Columns({ children }: { children?: React.ReactNode }) {
    return <div className="my-2 flex gap-12 m:flex-col m:gap-2">{children}</div>;
}

export function Column({ children }: { children?: React.ReactNode }) {
    return <div className="min-w-0 flex-1">{children}</div>;
}

// 인용/근거 등 감싸는 콜아웃 박스 (코드블록처럼 은은한 박스)
export function Blockquote({ children }: { children?: React.ReactNode }) {
    return (
        <blockquote className="my-3 rounded-lg border border-[#d3d2ce] bg-[#f4f3f1] px-4 py-3 text-[14px] leading-relaxed text-(--text-muted) [&>p]:my-0">
            {children}
        </blockquote>
    );
}

export function Table({ children }: { children?: React.ReactNode }) {
    // 넓은 표는 페이지를 밀지 않고 자체 가로 스크롤 (모바일 오버플로우 방지)
    return (
        <div className="my-3 w-full max-w-full overflow-x-auto">
            <tw.Table>{children}</tw.Table>
        </div>
    );
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
