import React, { useState } from "react";
import * as tw from "./Newpage.styles";

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

export default function NewPage({ collapsed }: { collapsed: boolean }) {
    const [blocks, setBlocks] = useState<Block[]>([{ type: "p", content: "" }]);
    const [menuIdx, setMenuIdx] = useState<number | null>(null);

    // 블록 타입 변경
    const changeBlockType = (idx: number, type: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].type = type;
        setBlocks(newBlocks);
        setMenuIdx(null);
    };

    // 입력 시 다음 p 블록 자동 추가
    const handleContentChange = (idx: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].content = value;
        setBlocks(newBlocks);

        // 마지막 블록이고 내용이 있으면 다음 p 블록 추가
        if (idx === blocks.length - 1 && value !== "") {
            setBlocks([...newBlocks, { type: "p", content: "" }]);
        }
    };

    return (
        <tw.Container
            style={{
                paddingLeft: collapsed ? 50 : 260,
                transition: "padding-left 0.2s",
            }}
        >
            <div className="w-full max-w-[712px]">
                {blocks.map((block, idx) => {
                    const Tag = block.type as keyof JSX.IntrinsicElements;
                    return (
                        <tw.BlockWrap key={idx} style={{ display: "flex", alignItems: "center" }}>
                            <tw.PlusButton style={{ marginRight: 8 }} onClick={() => setMenuIdx(menuIdx === idx ? null : idx)}>
                                +
                            </tw.PlusButton>
                            {menuIdx === idx && (
                                <tw.Menu style={{ left: 40, top: 0 }}>
                                    {ELEMENTS.map((el) => (
                                        <tw.MenuButton key={el.type} onClick={() => changeBlockType(idx, el.type)}>
                                            {el.label}
                                        </tw.MenuButton>
                                    ))}
                                </tw.Menu>
                            )}
                            <Tag style={{ flex: 1 }}>
                                <tw.Input
                                    type="text"
                                    value={block.content}
                                    onChange={(e) => handleContentChange(idx, e.target.value)}
                                    placeholder={`${block.type.toUpperCase()} 입력`}
                                />
                            </Tag>
                        </tw.BlockWrap>
                    );
                })}
            </div>
        </tw.Container>
    );
}
