/**
 * 단색 PNG 를 마스크로 찍어 원하는 색으로 보여준다.
 *
 * 네이버 클라우드 서비스 마크처럼 벡터가 없고 검정 한 가지로만 있는 아이콘을
 * 카드 아이콘 자리에 쓸 때, 다른 아이콘과 색을 맞추기 위해 쓴다.
 * 원본에 알파 채널이 있어야 모양만 남고 색이 바뀐다.
 */
export function MaskIcon({ src, color = "#000", width = "100%", height = "100%" }: { src: string; color?: string; width?: string; height?: string }) {
    return (
        <span
            aria-hidden
            style={{
                display: "block",
                width,
                height,
                backgroundColor: color,
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
            }}
        />
    );
}
