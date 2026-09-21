import { ReactNode } from "react";
import { tone } from "./tokens";

/** 섹션 아래에 놓이는 "Task n." 카드. 한 일과 결과를 짧은 불릿으로 적는다. */
export function TaskCard({
    index,
    title,
    bullets,
    color = tone.task,
    className = "",
    children,
}: {
    index: number;
    title: ReactNode;
    bullets?: string[];
    color?: string;
    className?: string;
    children?: ReactNode;
}) {
    return (
        <div className={`bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden p-8 ${className}`}>
            <p className="text-sm font-medium" style={{ color }}>
                Task {index}.
            </p>
            <h3 className="text-lg font-bold text-[#191918] leading-tight break-keep">{title}</h3>
            {bullets && (
                <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 mt-2 break-keep">
                    {bullets.map((b) => (
                        <li key={b}>{b}</li>
                    ))}
                </ul>
            )}
            {children}
        </div>
    );
}
