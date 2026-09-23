/**
 * 앱 화면을 한 줄로 늘어놓는다. 캡션으로 각 화면이 무슨 단계인지 적는다.
 *
 * 이미지는 기기 프레임을 씌운 440px 폭 PNG 를 쓴다.
 * 본문 폭 1080px 에 다섯 장이면 한 장이 약 200px 로 그려지므로 440px 은 2배에 해당한다.
 * 모바일에서는 두 장씩 끊어 글자가 읽히게 한다.
 */
export function ScreenRow({ shots }: { shots: { src: string; label: string }[] }) {
    return (
        <div className="grid gap-5 m:grid-cols-2" style={{ gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))` }}>
            {shots.map((s) => (
                <figure key={s.src} className="m-0 flex flex-col items-center gap-3">
                    <img className="w-full object-contain" src={s.src} alt={s.label} />
                    <figcaption className="text-center text-[13px] font-semibold leading-tight text-[#191918] break-keep">{s.label}</figcaption>
                </figure>
            ))}
        </div>
    );
}
