"use client";

// 이미지 블록. content = data URL(base64). 드래그앤드롭으로 생성된다.
// 포스트의 Img 컴포넌트와 유사하게 가운데 정렬로 표시.
export default function ImageBlock({ id, content }: { id: string; content: string }) {
    if (!content) return null;
    return (
        <div id={id} className="flex flex-col py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content} alt="" className="mx-auto max-w-full rounded-lg" />
        </div>
    );
}
