"use client";

import { tone } from "./tokens";

/**
 * 흐름도의 단계 사이 화살표.
 * 데스크톱은 오른쪽 화살표, 모바일(m:)은 세로로 쌓이므로 아래 화살표로 바꾼다.
 * compact(카드 미리보기)에서는 모바일에서도 가로를 유지한다.
 */
export function Connector({ compact = false }: { compact?: boolean }) {
    return (
        <>
            <div className={`shrink-0 ${compact ? "" : "m:hidden"}`}>
                <ArrowRight />
            </div>
            {!compact && (
                <div className="hidden m:block shrink-0">
                    <ArrowDown />
                </div>
            )}
        </>
    );
}

function ArrowRight() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 10h13M11 5l5 5-5 5" stroke={tone.arrow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowDown() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 3v13M5 11l5 5 5-5" stroke={tone.arrow} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
