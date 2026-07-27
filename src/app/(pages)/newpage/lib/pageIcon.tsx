"use client";

// 페이지 아이콘 값: 이모지 문자열("😀") 또는 커스텀 이미지(webp data URL).
export function isImageIcon(icon?: string): boolean {
    return (
        !!icon &&
        (icon.startsWith("data:") || icon.startsWith("/") || icon.startsWith("http") || /\.(png|jpe?g|webp|svg|ico|gif)$/i.test(icon))
    );
}

// 아이콘 모양을 따라 흰색 테두리를 만드는 필터(이모지 글리프/이미지 알파 외곽선).
// 커버 위에 올릴 때 하얀 배경 박스 대신 아이콘을 감싸는 흰 테두리로 분리감을 준다.
function whiteOutline(w = 2): string {
    return [
        `drop-shadow(${w}px 0 0 #fff)`,
        `drop-shadow(-${w}px 0 0 #fff)`,
        `drop-shadow(0 ${w}px 0 #fff)`,
        `drop-shadow(0 -${w}px 0 #fff)`,
        `drop-shadow(${w}px ${w}px 0 #fff)`,
        `drop-shadow(-${w}px -${w}px 0 #fff)`,
        `drop-shadow(${w}px -${w}px 0 #fff)`,
        `drop-shadow(-${w}px ${w}px 0 #fff)`,
    ].join(" ");
}

// 아이콘 렌더러 (이모지는 텍스트, 커스텀은 img). 드로워·타이틀 공용.
// outline=true 면 아이콘 둘레에 흰 테두리를 그린다(커버 위 오버레이용).
export function PageIcon({ icon, size = 20, outline = false }: { icon?: string; size?: number; outline?: boolean }) {
    if (!icon) return null;
    const filter = outline ? whiteOutline(Math.max(1, Math.round(size * 0.022))) : undefined;
    if (isImageIcon(icon)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={icon} alt="" style={{ width: size, height: size, objectFit: "cover", borderRadius: size * 0.18, display: "block", filter }} />;
    }
    return (
        <span style={{ fontSize: Math.round(size * 0.92), lineHeight: 1, display: "inline-block", filter }} className="select-none">
            {icon}
        </span>
    );
}

// 이미지 파일(png/jpeg/svg/webp) → 지정 최대변 크기의 webp data URL로 변환.
export async function fileToWebp(file: File, max = 128): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
    });
    const iw = img.width || max;
    const ih = img.height || max;
    const scale = Math.min(1, max / Math.max(iw, ih));
    const w = Math.max(1, Math.round(iw * scale));
    const h = Math.max(1, Math.round(ih * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/webp", 0.9);
}
