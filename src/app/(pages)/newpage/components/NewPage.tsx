import React, { useState, useRef } from "react";
import * as tw from "./Newpage.styles";
import { GripDotsIcon, PlusIcon } from "@/components/ui/hover-header/svg/PostsSvg";

function blocksToMDX(blocks: Block[]) {
    return blocks
        .filter((b) => b.content.trim() !== "")
        .map((b) => {
            switch (b.type) {
                case "h1":
                    return `# ${b.content}`;
                case "h2":
                    return `## ${b.content}`;
                case "h3":
                    return `### ${b.content}`;
                default:
                    return b.content;
            }
        })
        .join("\n\n");
}

interface Block {
    type: string;
    content: string;
}

const ELEMENTS = [
    { label: "본문(P)", type: "p" },
    { label: "제목(H1)", type: "h1" },
    { label: "소제목(H2)", type: "h2" },
    { label: "소소제목(H3)", type: "h3" },
];

function TypeMenuModal({
    open,
    position,
    onSelect,
    onClose,
}: {
    open: boolean;
    position: { top: number; left: number } | null;
    onSelect: (type: string) => void;
    onClose: () => void;
}) {
    if (!open || !position) return null;
    return (
        <>
            {/* 오버레이: 다른 곳 클릭 방지 */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 999,
                }}
                onClick={onClose}
            />
            {/* 메뉴 */}
            <div
                style={{
                    position: "absolute",
                    top: position.top,
                    left: position.left,
                    zIndex: 1000,
                }}
            >
                <tw.Menu id="type-menu" style={{ minWidth: "120px" }}>
                    {ELEMENTS.map((el) => (
                        <tw.MenuButton key={el.type} onClick={() => onSelect(el.type)}>
                            {el.label}
                        </tw.MenuButton>
                    ))}
                </tw.Menu>
            </div>
        </>
    );
}

function getBlockComponent(type: string, children: React.ReactNode) {
    switch (type) {
        case "h1":
            return <tw.H1Block>{children}</tw.H1Block>;
        case "h2":
            return <tw.H2Block>{children}</tw.H2Block>;
        case "h3":
            return <tw.H3Block>{children}</tw.H3Block>;
        default:
            return <tw.PBlock>{children}</tw.PBlock>;
    }
}

export default function NewPage({ collapsed }: { collapsed: boolean }) {
    const [title, setTitle] = useState<string>("시작하기");
    const [blocks, setBlocks] = useState<Block[]>([{ type: "p", content: "" }]);
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<{ top: number; left: number } | null>(null);
    const [menuIdx, setMenuIdx] = useState<number | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const plusRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleExport = () => {
        const mdx = blocksToMDX(blocks);
        alert(mdx);
    };

    // 블록 타입 변경
    const changeBlockType = (idx: number, type: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].type = type;
        setBlocks(newBlocks);
        setMenuIdx(null);
        setMenuPos(null);
    };

    // 입력 시 해당 블록 내용 변경 및 마지막 블록이 채워지면 새 블록 추가
    const handleContentChange = (idx: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].content = value;
        setBlocks(newBlocks);

        if (idx === blocks.length - 1 && value !== "" && blocks.filter((b) => b.content === "").length < 3) {
            setBlocks([...newBlocks, { type: "p", content: "" }]);
        }
    };

    // 해당 줄 호버 시 버튼 위치 계산
    const handleHover = (idx: number, e: React.MouseEvent) => {
        setHoverIdx(idx);
        const blockRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
        setHoverPos({
            top: blockRect.top - (parentRect?.top ?? 0),
            left: -56,
        });
    };

    // 버튼 클릭 시 메뉴 위치 계산
    const handlePlusClick = (idx: number) => {
        setMenuIdx(idx);
        const btn = plusRefs.current[idx];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const parentRect = btn.parentElement?.parentElement?.getBoundingClientRect();
            setMenuPos({
                top: rect.top - (parentRect?.top ?? 0),
                left: rect.left - (parentRect?.left ?? 0) + rect.width - 210,
            });
        }
    };

    return (
        <tw.Container
            style={{
                paddingLeft: collapsed ? 50 : 260,
                transition: "padding-left 0.2s",
            }}
        >
            <div className="w-full max-w-[712px]" style={{ position: "relative" }}>
                <tw.BlockWrap>
                    <tw.H1Block>
                        <tw.Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </tw.H1Block>
                </tw.BlockWrap>
                {/* 호버 시 버튼만 앱솔루트로 렌더링 */}
                {hoverIdx !== null && hoverPos && (
                    <div
                        style={{
                            position: "absolute",
                            left: hoverPos.left,
                            top: hoverPos.top,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            zIndex: 10,
                        }}
                        onMouseEnter={() => setHoverIdx(hoverIdx)}
                        onMouseLeave={() => setHoverIdx(null)}
                    >
                        <tw.PlusButton
                            ref={(el) => (plusRefs.current[hoverIdx] = el)}
                            className="opacity-100 pointer-events-auto bg-[#252525]"
                            onClick={() => handlePlusClick(hoverIdx)}
                        >
                            <PlusIcon color={"#616161"} />
                        </tw.PlusButton>
                        <tw.PlusButton
                            ref={(el) => (plusRefs.current[hoverIdx] = el)}
                            className="opacity-100 pointer-events-auto bg-[#252525]"
                            onClick={() => handlePlusClick(hoverIdx)}
                        >
                            <GripDotsIcon color={"#616161"} />
                        </tw.PlusButton>
                    </div>
                )}
                {/* 메뉴는 버튼 클릭 시에만 앱솔루트로 렌더링 */}
                <TypeMenuModal
                    open={menuIdx !== null}
                    position={menuPos}
                    onSelect={(type) => {
                        if (menuIdx !== null) changeBlockType(menuIdx, type);
                    }}
                    onClose={() => {
                        setMenuIdx(null);
                        setMenuPos(null);
                    }}
                />
                {blocks.map((block, idx) => (
    <tw.BlockWrap
        key={idx}
        className="group"
        style={{ position: "relative" }}
        // BlockWrap 전체에 호버 이벤트 적용
        onMouseEnter={e => handleHover(idx, e)}
        onMouseLeave={() => setHoverIdx(null)}
    >
        {/* 버튼: 호버 또는 메뉴 활성화 시에만 렌더링 */}
        {(hoverIdx === idx || menuIdx === idx) && (
            <div
                style={{
                    position: "absolute",
                    left: -56,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    zIndex: 10,
                    width: 56, // 버튼 영역 넓이 지정(필요시)
                    height: "100%", // BlockWrap 전체 높이
                }}
            >
                <tw.PlusButton
                    ref={el => (plusRefs.current[idx] = el)}
                    className={`bg-[#252525] ${menuIdx === idx ? "" : ""}`}
                    onClick={() => handlePlusClick(idx)}
                >
                    <PlusIcon color={"#616161"} />
                </tw.PlusButton>
                <tw.PlusButton
                    ref={el => (plusRefs.current[idx] = el)}
                    className={`bg-[#252525] ${menuIdx === idx ? "" : ""}`}
                    onClick={() => handlePlusClick(idx)}
                >
                    <GripDotsIcon color={"#616161"} />
                </tw.PlusButton>
            </div>
        )}
        <tw.InputWrap className={menuIdx === idx ? "bg-gray-800" : ""}>
            {getBlockComponent(
                block.type,
                <tw.Input type="text" value={block.content} onChange={(e) => handleContentChange(idx, e.target.value)} />,
            )}
        </tw.InputWrap>
    </tw.BlockWrap>
))}
            </div>
            <div className="fixed bottom-8 right-8 z-50">
                <button className="px-6 py-3 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition" onClick={handleExport}>
                    내보내기
                </button>
            </div>
        </tw.Container>
    );
}
