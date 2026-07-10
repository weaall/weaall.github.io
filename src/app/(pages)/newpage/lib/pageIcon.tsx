"use client";

// 페이지 아이콘 값: 이모지 문자열("😀") 또는 커스텀 이미지(webp data URL).
export function isImageIcon(icon?: string): boolean {
    return !!icon && icon.startsWith("data:");
}

// 아이콘 렌더러 (이모지는 텍스트, 커스텀은 img). 드로워·타이틀 공용.
export function PageIcon({ icon, size = 20 }: { icon?: string; size?: number }) {
    if (!icon) return null;
    if (isImageIcon(icon)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={icon} alt="" style={{ width: size, height: size, objectFit: "cover", borderRadius: size * 0.18, display: "block" }} />;
    }
    return (
        <span style={{ fontSize: Math.round(size * 0.92), lineHeight: 1, display: "inline-block" }} className="select-none">
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
