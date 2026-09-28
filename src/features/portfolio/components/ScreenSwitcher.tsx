"use client";

import { useEffect, useState } from "react";
import { tone } from "./tokens";

/**
 * 웹 화면 여러 장을 한 자리에서 돌려 보여준다.
 *
 * PROVE Lite 시스템 아키텍처와 같은 배치다. 왼쪽 3/4 에 큰 화면, 오른쪽 1/4 에 썸네일을 쌓는다.
 * 썸네일에 마우스를 올리거나 누르면 그 화면으로 바뀌고, 가만히 두면 interval 마다 다음 화면으로 넘어간다.
 * 마우스가 컴포넌트 위에 있는 동안은 자동 전환을 멈춘다.
 *
 * 큰 화면과 썸네일 모두 DiagramPanel 과 같은 처리다. 흰 상자는 왼쪽 · 위만 띄우고 오른쪽 · 아래는 카드 벽에 붙인다.
 *
 * 큰 화면은 모든 이미지를 겹쳐 두고 opacity 만 바꾼다. 그래서 이미지 비율을 모두 같게 맞춰 둬야 한다.
 * 오른쪽 열은 absolute 로 띄워 높이를 갖지 않게 하고, 왼쪽 높이에 맞춰 네 칸을 나눈다.
 * (flex 안의 img 는 flex-basis 를 콘텐츠 높이로 잡아서, 그냥 두면 오른쪽이 왼쪽보다 길어진다.)
 * 모바일에서는 다시 흐름 안으로 넣어 두 장씩 놓는다.
 */
export function ScreenSwitcher({ shots, color, interval = 2000 }: { shots: { src: string; label: string }[]; color: string; interval?: number }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = window.setInterval(() => setActive((i) => (i + 1) % shots.length), interval);
        return () => window.clearInterval(id);
    }, [paused, interval, shots.length]);

    return (
        <div className="grid grid-cols-4 gap-6 m:grid-cols-1" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="col-span-3 rounded-2xl overflow-hidden pl-8 pt-8 m:col-span-1 m:pl-4 m:pt-4" style={{ background: tone.card }}>
                <div
                    className="relative w-full rounded-tl-xl overflow-hidden shadow-lg border-2 border-b-0 border-r-0"
                    style={{ borderColor: tone.panelBorder, background: tone.panel }}
                >
                    {/* 첫 장이 자리를 잡고, 나머지는 그 위에 겹친다 */}
                    {shots.map((s, i) => (
                        <img
                            key={s.src}
                            className={`w-full object-contain transition-opacity duration-500 ${i === 0 ? "relative" : "absolute inset-0"}`}
                            style={{ opacity: i === active ? 1 : 0 }}
                            src={s.src}
                            alt={s.label}
                            aria-hidden={i !== active}
                        />
                    ))}
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex flex-col gap-4 m:static m:grid m:grid-cols-2">
                    {shots.map((s, i) => {
                        const on = i === active;
                        return (
                            <button
                                key={s.src}
                                type="button"
                                className="flex-1 min-h-0 flex flex-col gap-2 rounded-2xl overflow-hidden pl-4 pt-4 text-left border-2 transition-colors cursor-pointer"
                                style={{ background: tone.card, borderColor: on ? color : "transparent" }}
                                onMouseEnter={() => setActive(i)}
                                onClick={() => setActive(i)}
                                aria-pressed={on}
                            >
                                <span className="pr-4 text-[14px] font-bold leading-tight break-keep transition-colors" style={{ color: on ? color : tone.ink }}>
                                    {s.label}
                                </span>
                                <img
                                    className="w-full h-0 flex-1 min-h-0 rounded-tl-md border border-b-0 border-r-0 shadow-md object-cover object-left-top m:h-auto m:flex-none m:aspect-[16/9]"
                                    style={{ borderColor: tone.panelBorder, background: tone.panel }}
                                    src={s.src}
                                    alt=""
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
