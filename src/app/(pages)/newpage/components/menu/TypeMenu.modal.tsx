import { ColorPainterIcon, FontIcon, LoopIcon, RightIcon } from "@/components/ui/hover-header/svg/TypeMenuSvg";
import * as tw from "./TypeMenu.modal.styles";
import { ReactNode, useState } from "react";

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
    const [showDrawer, setShowDrawer] = useState<"전환" | "색" | null>(null);

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

    if (!open || !position) return null;
    return (
        <>
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 999,
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: "absolute",
                    top: position.top,
                    left: position.left,
                    zIndex: 1000,
                    display: "flex",
                }}
            >
                <tw.Menu id="type-menu" style={{ minWidth: "120px", position: "relative" }}>
                    <tw.Label>텍스트</tw.Label>
                    <tw.MenuButton
                        onMouseEnter={() => handleMenuButtonMouseEnter("전환")}
                        className={showDrawer === "전환" ? "bg-gray-800" : ""}
                    >
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
                    <tw.MenuButton
                        onMouseEnter={() => handleMenuButtonMouseEnter("색")}
                        className={showDrawer === "색" ? "bg-gray-800" : ""}
                    >
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
                    <tw.MenuButton onMouseEnter={() => handleMenuButtonMouseEnter("옮기기")}>옮기기</tw.MenuButton>
                    <tw.MenuButton onMouseEnter={() => handleMenuButtonMouseEnter("삭제")} onClick={onDeleteBlock}>삭제</tw.MenuButton>
                </tw.Menu>
                {/* 전환 드로워 */}
                {showDrawer === "전환" && (
                    <tw.DrawerMenu
                        onMouseEnter={() => setShowDrawer("전환")}
                        onMouseLeave={handleDrawerMouseLeave}
                    >
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
                    <tw.DrawerMenu
                        onMouseEnter={() => setShowDrawer("색")}
                        onMouseLeave={handleDrawerMouseLeave}
                    >
                        <tw.Label>텍스트 색상</tw.Label>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#ffffffcf")}> {/* 기본 텍스트 */}
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#ffffffcf" />
                                </tw.SvgWrap>
                                기본 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#e65b58")}> {/* 빨간색 텍스트 */}
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#e65b58" />
                                </tw.SvgWrap>
                                빨간색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#529e72")}> {/* 초록색 텍스트 */}
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#529e72" />
                                </tw.SvgWrap>
                                초록색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                        <tw.MenuButton onClick={() => onColorSelect && onColorSelect("#379ad3")}> {/* 파랑색 텍스트 */}
                            <tw.LabelWrap>
                                <tw.SvgWrap>
                                    <FontIcon color="#379ad3" />
                                </tw.SvgWrap>
                                파랑색 텍스트
                            </tw.LabelWrap>
                        </tw.MenuButton>
                    </tw.DrawerMenu>
                )}
            </div>
        </>
    );
}