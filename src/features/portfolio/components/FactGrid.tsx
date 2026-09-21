/** 숫자 중심 요약 4칸. 값이 크게, 설명이 작게 들어간다. */
export function FactGrid({ facts, color }: { facts: { value: string; label: string }[]; color: string }) {
    return (
        <div className="grid gap-4 grid-cols-4 m:grid-cols-2">
            {facts.map((f) => (
                <div key={f.label} className="bg-[#f6f5f4] rounded-2xl p-6 flex flex-col gap-1">
                    <span className="text-[1.75rem] font-bold tracking-tight leading-none break-keep" style={{ color }}>
                        {f.value}
                    </span>
                    <span className="text-sm text-gray-600 break-keep">{f.label}</span>
                </div>
            ))}
        </div>
    );
}
