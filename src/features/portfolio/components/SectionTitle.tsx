import { ReactNode } from "react";

/** 포트폴리오 페이지의 큰 섹션 제목. */
export function SectionTitle({ children, center = false, className = "" }: { children: ReactNode; center?: boolean; className?: string }) {
    return (
        <h2
            className={`text-[2.625rem] text-[#191918] font-bold tracking-[-0.09375rem] pb-4 m:text-[1.9rem] break-keep ${
                center ? "text-center" : "text-left"
            } ${className}`}
        >
            {children}
        </h2>
    );
}
