import { ColorPainterIcon, FontIcon, LoopIcon, RightIcon, TrashBinIcon } from "@/components/ui/hover-header/svg/TypeMenuSvg";
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
                    <tw.MenuButton onMouseEnter={() => handleMenuButtonMouseEnter("전환")} className={showDrawer === "전환" ? "bg-[#313131]" : ""}>
                        <tw.LabelWrap>
                            <tw.SvgWrap>
                                <LoopIcon color="#ffffffcf" />
                            </tw.SvgWrap>
                            전환
                        </tw.LabelWrap>
                        <tw.SvgWrap>
                            <RightIcon color="#ffffffcf" />
                        </tw.SvgWrap>
                    </tw.MenuButton>
                    <tw.MenuButton onMouseEnter={() => handleMenuButtonMouseEnter("색")} className={showDrawer === "색" ? "bg-[#313131]" : ""}>
                        <tw.LabelWrap>
                            <tw.SvgWrap>
                                <ColorPainterIcon color="#ffffffcf" />
                            </tw.SvgWrap>
                            색
                        </tw.LabelWrap>
                        <tw.SvgWrap>
                            <RightIcon color="#ffffffcf" />
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
                                <TrashBinIcon color={deleteHover ? "#e65b58" : "#ffffffcf"} />
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
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#ffffffcf")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#ffffffcf" />
                                </tw.SvgWrap>
                                기본 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#b5b5b5")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#b5b5b5" />
                                </tw.SvgWrap>
                                회색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#e9bfa8")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#e9bfa8" />
                                </tw.SvgWrap>
                                갈색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#ffb86b")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#ffb86b" />
                                </tw.SvgWrap>
                                주황색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#ffe066")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#ffe066" />
                                </tw.SvgWrap>
                                노란색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#b6e3b6")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#b6e3b6" />
                                </tw.SvgWrap>
                                초록색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#8ecae6")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#8ecae6" />
                                </tw.SvgWrap>
                                파란색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#cbb7f0")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#cbb7f0" />
                                </tw.SvgWrap>
                                보라색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#f7b7d7")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#f7b7d7" />
                                </tw.SvgWrap>
                                분홍색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#ff7b7b")}>
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#ff7b7b" />
                                </tw.SvgWrap>
                                빨간색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                    </tw.DrawerMenu>
                )}
            </div>
        </>
    );
}
