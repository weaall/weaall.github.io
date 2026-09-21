import { ReactNode } from "react";

/**
 * 다이어그램·이미지를 담는 회색 카드.
 *
 * PROVE Lite 의 이미지 패널과 같은 처리를 쓴다.
 * 흰 상자는 왼쪽만 카드 안쪽으로 띄우고(pl-8) 오른쪽·아래는 카드 벽에 붙인다.
 * 그래서 좌상단만 둥글고(rounded-tl-xl) 나머지 모서리는 카드 라운딩에 잘린다.
 */
export function DiagramPanel({
    title,
    desc,
    children,
    className = "",
}: {
    title?: ReactNode;
    desc?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`w-full bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden ${className}`}>
            {title && (
                <div className="w-full flex flex-col p-8 pb-4">
                    <h3 className="text-lg font-bold text-[#191918] break-keep">{title}</h3>
                    {desc && <p className="text-[15px] text-gray-600 break-keep mt-1">{desc}</p>}
                </div>
            )}
            <div className={`w-full pl-8 ${title ? "" : "pt-8"}`}>
                <div className="w-full rounded-tl-xl bg-white shadow-lg p-6 border-2 border-[#ededeb] m:p-4">{children}</div>
            </div>
        </div>
    );
}
