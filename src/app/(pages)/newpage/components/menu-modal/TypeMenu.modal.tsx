import { ColorPainterIcon, FontIcon, LoopIcon, RightIcon, TrashBinIcon } from "@/components/ui/icons/TypeMenuSvg";
import * as tw from "./TypeMenu.modal.styles";
import { ReactNode, useEffect, useState } from "react";

interface TypeMenuModalProps {
    open: boolean;
    position: { top: number; left: number } | null;
    onSelect: (type: string) => void;
    onColorSelect?: (color: string) => void;
    onDeleteBlock?: () => void;
    onClose: () => void;
    elements: {
        icon: React.ReactNode;
        label: string;
        type: string;
    }[];
}

const TEXT_COLORS = [
    { color: "#37352f", label: "기본 텍스트" },
    { color: "#b5b5b5", label: "회색 텍스트" },
    { color: "#e9bfa8", label: "갈색 텍스트" },
    { color: "#ffb86b", label: "주황색 텍스트" },
    { color: "#ffe066", label: "노란색 텍스트" },
    { color: "#b6e3b6", label: "초록색 텍스트" },
    { color: "#8ecae6", label: "파란색 텍스트" },
    { color: "#cbb7f0", label: "보라색 텍스트" },
    { color: "#f7b7d7", label: "분홍색 텍스트" },
    { color: "#ff7b7b", label: "빨간색 텍스트" },
];

export default function TypeMenuModal({ open, position, onSelect, onColorSelect, onDeleteBlock, onClose, elements }: TypeMenuModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete" && onDeleteBlock) {
                e.preventDefault();
                onDeleteBlock();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onDeleteBlock]);
    const [showDrawer, setShowDrawer] = useState<"전환" | "색" | null>(null);
    const [deleteHover, setDeleteHover] = useState(false);

    const handleMenuButtonMouseEnter = (type: string) => {
        if (type === "전환" || type === "색") {
            setShowDrawer(type as "전환" | "색");
        } else {
            setShowDrawer(null);
        }
    };

    const handleDrawerMouseLeave = () => {
        setShowDrawer(null);
    };

    const handleClose = () => {
        setShowDrawer(null);
        onClose();
    };

    if (!open || !position) return null;
    return (
        <>
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 999,
                }}
                onClick={handleClose}
            />
            <div
                style={{
                    position: "fixed",
                    top: position.top,
                    left: position.left,
                    zIndex: 1000,
                    display: "flex",
                }}
            >
                <tw.Menu id="type-menu" style={{ minWidth: "120px", position: "relative" }}>
                    <tw.Label>텍스트</tw.Label>
                    <tw.MenuButton onMouseEnter={() => handleMenuButtonMouseEnter("전환")} className={showDrawer === "전환" ? "bg-(--menu-hover-bg)" : ""}>
                        <tw.LabelWrap>
                            <tw.SvgWrap>
                                <LoopIcon color="#5f5e5b" />
                            </tw.SvgWrap>
                            전환
                        </tw.LabelWrap>
                        <tw.SvgWrap>
                            <RightIcon color="#5f5e5b" />
                        </tw.SvgWrap>
                    </tw.MenuButton>
                    <tw.MenuButton onMouseEnter={() => handleMenuButtonMouseEnter("색")} className={showDrawer === "색" ? "bg-(--menu-hover-bg)" : ""}>
                        <tw.LabelWrap>
                            <tw.SvgWrap>
                                <ColorPainterIcon color="#5f5e5b" />
                            </tw.SvgWrap>
                            색
                        </tw.LabelWrap>
                        <tw.SvgWrap>
                            <RightIcon color="#5f5e5b" />
                        </tw.SvgWrap>
                    </tw.MenuButton>
                    <tw.MenuButton
                        onMouseEnter={() => {
                            handleMenuButtonMouseEnter("삭제");
                            setDeleteHover(true);
                        }}
                        onMouseLeave={() => setDeleteHover(false)}
                        onClick={onDeleteBlock}
                        style={{ color: deleteHover ? "#e65b58" : undefined }}
                    >
                        <tw.LabelWrap>
                            <tw.SvgWrap>
                                <TrashBinIcon color={deleteHover ? "#e65b58" : "#5f5e5b"} />
                            </tw.SvgWrap>
                            삭제
                        </tw.LabelWrap>
                        <tw.ExpLabel>Del</tw.ExpLabel>
                    </tw.MenuButton>
                </tw.Menu>
                {/* 전환 드로워 */}
                {showDrawer === "전환" && (
                    <tw.DrawerMenu onMouseEnter={() => setShowDrawer("전환")} onMouseLeave={handleDrawerMouseLeave}>
                        {elements.map((el) => (
                            <tw.MenuButton key={el.type + "-drawer"} onClick={() => onSelect(el.type)}>
                                <tw.LabelWrap>
                                    <tw.SvgWrap>{el.icon}</tw.SvgWrap>
                                    {el.label}
                                </tw.LabelWrap>
                            </tw.MenuButton>
                        ))}
                    </tw.DrawerMenu>
                )}
                {/* 색 드로워 */}
                {showDrawer === "색" && (
                    <tw.DrawerMenu onMouseEnter={() => setShowDrawer("색")} onMouseLeave={handleDrawerMouseLeave}>
                        <tw.Label>텍스트 색상</tw.Label>
                        {TEXT_COLORS.map(({ color, label }) => (
                            <tw.MenuButton
                                key={color}
                                onClick={() => onColorSelect?.(color)}
                            >
                                <tw.LabelWrap>
                                    <tw.SvgWrap>
                                        <FontIcon color={color} />
                                    </tw.SvgWrap>
                                    {label}
                                </tw.LabelWrap>
                            </tw.MenuButton>
                        ))}
                    </tw.DrawerMenu>
                )}
            </div>
        </>
    );
}
