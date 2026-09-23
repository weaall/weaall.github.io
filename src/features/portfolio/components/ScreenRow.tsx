/**
 * 앱 화면을 흐름 순서대로 늘어놓는다. 캡션에 순번과 단계 이름을 적는다.
 *
 * 이미지는 기기 프레임을 씌운 440px 폭 PNG 를 쓴다.
 * 본문 폭 1080px 에 한 줄 다섯 장이면 한 장이 약 200px 로 그려지므로 440px 은 2배에 해당한다.
 * 장수가 cols 를 넘으면 다음 줄로 넘어간다. 모바일에서는 두 장씩 끊어 글자가 읽히게 한다.
 */
export function ScreenRow({ shots, cols = 5 }: { shots: { src: string; label: string }[]; cols?: number }) {
    return (
        <div className="grid gap-x-5 gap-y-9 m:grid-cols-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {shots.map((s, i) => (
                <figure key={s.src} className="m-0 flex flex-col items-center gap-3">
                    <img className="w-full object-contain" src={s.src} alt={s.label} />
                    <figcaption className="text-center text-[13px] font-semibold leading-tight text-[#191918] break-keep">
                        <span className="mr-1.5 font-normal text-gray-400">{String(i + 1).padStart(2, "0")}</span>
                        {s.label}
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}
