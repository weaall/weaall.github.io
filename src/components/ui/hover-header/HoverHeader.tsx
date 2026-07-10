import * as tw from "./HoverHeader.styles";
import { useEffect, useState } from "react";

interface HoverHeaderProps {
    visible: boolean;
    collapsed: boolean;
    onEdit?: () => void; // 게시물 페이지에서 "편집" 클릭 시 수정 진입
}

export default function HoverHeader({ visible, collapsed, onEdit }: HoverHeaderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return (
        <tw.Container
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s, padding-left 0.2s",
                transform: visible ? "translateY(0)" : "translateY(-60px)",
                opacity: visible ? 1 : 0,
                paddingLeft: collapsed ? 50 : 260,
            }}
        >
            <tw.LeftWrap>{onEdit && <tw.LabelBtn onClick={onEdit}>편집</tw.LabelBtn>}</tw.LeftWrap>
            <tw.RightWrap>
                <tw.LabelBtn onClick={() => window.dispatchEvent(new Event("newpage:share"))}>공유</tw.LabelBtn>
            </tw.RightWrap>
        </tw.Container>
    );
}
