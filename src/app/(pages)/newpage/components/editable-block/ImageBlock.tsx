"use client";

import { useEffect, useRef, useState } from "react";
import { parseImageContent } from "../../lib/imageContent";

// 이미지 블록. content = {src(dataURL), width} JSON. 드래그앤드롭으로 생성.
// 우측 가장자리 핸들을 끌어 크기를 조절하고, 놓는 순간 newpage:setimagewidth로 저장한다.
export default function ImageBlock({ id, content }: { id: string; content: string }) {
    const { src, width } = parseImageContent(content);
    const [w, setW] = useState<number | undefined>(width);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setW(parseImageContent(content).width);
    }, [content]);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startW = imgRef.current?.getBoundingClientRect().width || 320;
        const onMove = (ev: MouseEvent) => setW(Math.max(80, Math.round(startW + (ev.clientX - startX))));
        const onUp = (ev: MouseEvent) => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            const finalW = Math.max(80, Math.round(startW + (ev.clientX - startX)));
            window.dispatchEvent(new CustomEvent("newpage:setimagewidth", { detail: { id, width: finalW } }));
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    if (!src) return null;

    return (
        <div id={id} className="flex flex-col items-center py-2">
            <div className="group/img relative w-fit max-w-full" style={{ width: w ? `${w}px` : undefined }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} src={src} alt="" className="block max-w-full rounded-lg" draggable={false} />
                {/* 리사이즈 핸들 (우측 가장자리) */}
                <div
                    onMouseDown={startResize}
                    className="absolute right-0 top-1/2 h-12 w-1.5 -translate-y-1/2 translate-x-1/2 cursor-ew-resize rounded-full bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100"
                />
            </div>
        </div>
    );
}
