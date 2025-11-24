"use client";

import { useState } from "react";

export default function UserLayout() {
    const [isToggled, setIsToggled] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem]">사용자 웹 레이아웃</h2>
                <div className="relative flex items-center rounded-full bg-gray-100 p-1.5">
                    <div
                        className={`absolute top-1/2 left-1.5 w-1/2 h-10 rounded-full shadow-md transition-all duration-500 ease-in-out transform -translate-y-1/2 ${isToggled ? 'translate-x-[5.5rem] bg-[#416bac]' : 'translate-x-0 bg-gray-500'
                            } ${isToggled ? 'translate-x-[5.5rem] bg-[#416bac]' : 'translate-x-0 bg-[#4da38d]'}`}
                    ></div>
                    <button
                        onClick={() => setIsToggled(false)}
                        className={`relative flex justify-center pr-5 pl-7 text-base font-semibold rounded-full transition-colors duration-500 w-22 ${!isToggled ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        개선 전
                    </button>
                    <button
                        onClick={() => setIsToggled(true)}
                        className={`relative flex justify-center pr-7 pl-5 py-2 text-base font-semibold rounded-full transition-colors duration-500 w-22 ${isToggled ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        개선 후
                    </button>
                </div>
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
