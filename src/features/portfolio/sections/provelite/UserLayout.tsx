"use client";

import { useState } from "react";

export default function UserLayout() {
    const [isToggled, setIsToggled] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <div className="flex justify-between items-center m:flex-col m:items-start m:gap-4">
                <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem] m:text-[1.9rem]">사용자 웹 레이아웃</h2>
                {/* 데스크톱: 개선 전/후 슬라이딩 토글.
                    두 버튼은 완전히 같은 크기·여백을 쓰고, 알약만 자기 너비만큼 옆으로 움직인다. */}
                <div className="relative flex items-center rounded-full bg-gray-100 p-1.5 m:hidden">
                    <span
                        aria-hidden
                        className={`absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-full bg-[#416bac] shadow-md transition-transform duration-500 ease-in-out ${
                            isToggled ? "translate-x-full" : "translate-x-0"
                        }`}
                    />
                    {(["개선 전", "개선 후"] as const).map((label, i) => {
                        const isAfter = i === 1;
                        const active = isToggled === isAfter;
                        return (
                            <button
                                key={label}
                                onClick={() => setIsToggled(isAfter)}
                                aria-pressed={active}
                                className={`relative z-10 w-28 rounded-full py-2 text-center text-base font-semibold transition-colors duration-500 ${
                                    active ? "text-white" : "text-gray-500"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                {/* 모바일: 단일 활성화 버튼 (탭하면 개선 전/후 전환) */}
                <button
                    onClick={() => setIsToggled((v) => !v)}
                    className="hidden m:inline-flex items-center gap-1.5 rounded-full bg-[#416bac] px-5 py-2.5 text-sm font-semibold text-white transition active:scale-95"
                >
                    {isToggled ? "개선 후" : "개선 전"}
                    <span className="text-white/70">⇄</span>
                </button>
            </div>
            <div className="w-full h-1/2 py-10">
                <div className="flex justify-between items-start">
                    {Array.from({ length: 5 }).map((_, index) => {
                        const isHovered = hoveredIndex === index;
                        const baseImage = isToggled ? 'new' : 'old';
                        const hoverImage = isToggled ? 'old' : 'new';
                        const imageName = isHovered ? hoverImage : baseImage;

                        return (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative w-1/5 cursor-grab"
                            >
                                <img
                                    className="object-contain w-full rounded-xl bg-white"
                                    src={`/assets/portfolio/prove-lite/user_layout_${imageName}_${index + 1}.png`}
                                    alt={`User Layout ${imageName} ${index + 1}`}
                                />
                                {imageName === 'old' && (
                                    <div className="absolute bottom-3 right-3 bg-white text-gray-600 text-xs font-bold px-2.5 py-1 rounded-xl shadow-md border border-gray-100">
                                        개선 전
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
