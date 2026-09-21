"use client";

import { ReactNode } from "react";

type IconComponent = (props: { color?: string; width?: string; height?: string }) => ReactNode;

/**
 * 프로젝트 오버뷰 카드. 클릭하면 해당 섹션으로 스크롤한다.
 * 위 절반은 아이콘·제목·설명, 아래 절반은 미리보기.
 * 미리보기 상자는 PROVE Lite 와 같이 왼쪽만 띄우고 오른쪽·아래는 카드 벽에 붙는다.
 */
export function OverviewCard({
    icon: Icon,
    color,
    title,
    description,
    preview,
    onClick,
}: {
    icon: IconComponent;
    color: string;
    title: string;
    description: string;
    preview: ReactNode;
    onClick?: () => void;
}) {
    return (
        <div onClick={onClick} className="h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group">
            <div className="w-full h-1/2 flex flex-col p-8">
                <div className="w-8 h-8 mb-2">
                    <Icon color={color} />
                </div>
                <h3 className="text-lg font-bold mb-1 text-[#191918]">{title}</h3>
                <p className="text-[#191918] text-base break-keep">{description}</p>
            </div>
            <div className="pl-8 w-full h-1/2 overflow-hidden">
                <div className="w-full h-full rounded-tl-xl border-2 border-[#ededeb] bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 origin-top-left overflow-hidden p-5 flex items-center justify-center">
                    <div className="w-full">{preview}</div>
                </div>
            </div>
        </div>
    );
}
