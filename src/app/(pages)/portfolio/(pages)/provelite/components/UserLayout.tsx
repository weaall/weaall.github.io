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
                        className={`absolute top-1/2 left-1.5 w-1/2 h-[calc(100%-0.75rem)] rounded-full shadow-md transition-all duration-500 ease-in-out transform -translate-y-1/2 ${
                            isToggled ? 'translate-x-[90%] bg-[#416bac]' : 'translate-x-0 bg-gray-500'
                        }`}
                    ></div>
                    <button 
                        onClick={() => setIsToggled(false)}
                        className={`relative px-6 py-2 text-base font-semibold rounded-full transition-colors duration-500 w-24 ${
                            !isToggled ? 'text-white' : 'text-gray-500'
                        }`}
                    >
                        개선 전
                    </button>
                    <button 
                        onClick={() => setIsToggled(true)}
                        className={`relative px-6 py-2 text-base font-semibold rounded-full transition-colors duration-500 w-24 ${
                            isToggled ? 'text-white' : 'text-gray-500'
                        }`}
                    >
                        개선 후
                    </button>
                </div>
            </div>
            <div className="w-full h-1/2 py-4">
                {isToggled ? (
                     <div className="flex justify-between items-start">
                         {Array.from({ length: 5 }).map((_, index) => (
                             <img
                                 key={index}
                                 onMouseEnter={() => setHoveredIndex(index)}
                                 onMouseLeave={() => setHoveredIndex(null)}
                                 className={`object-contain w-1/5 rounded-xl bg-white transition-all duration-300 cursor-grab ${hoveredIndex === index ? 'grayscale' : ''}`}
                                 src={`/assets/portfolio/prove-lite/user_layout_new_${index + 1}.png`}
                                 alt=""
                             />
                         ))}
                     </div>
                ) : (
                    <div className="flex justify-between items-start">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <img
                                key={index}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`object-contain w-1/5 rounded-xl bg-white transition-all duration-300 grayscale cursor-pointer ${hoveredIndex === index ? 'grayscale-0' : ''}`}
                                src={`/assets/portfolio/prove-lite/user_layout_new_${index + 1}.png`}
                                alt=""
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
