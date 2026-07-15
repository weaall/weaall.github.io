import {
    BarChartVIcon,
    BulletedListIcon,
    CheckedListIcon,
    CodeBlockIcon,
    ColumnsIcon,
    DividerIcon,
    H1BlockIcon,
    H2BlockIcon,
    H3BlockIcon,
    NumberedListIcon,
    TableIcon,
    TextBlockIcon,
} from "@/components/ui/icons/TypeMenuSvg";
import { ReactNode } from "react";

// 전환 메뉴 항목. divider:true 인 항목은 메뉴에서 구분선으로 렌더된다.
export type TypeMenuElement =
    | { divider: true }
    | { label: string; type: string; icon: ReactNode };

export const ELEMENTS: TypeMenuElement[] = [
    { label: "텍스트", type: "p", icon: <TextBlockIcon color="#5f5e5b" /> },
    { label: "제목1", type: "h1", icon: <H1BlockIcon color="#5f5e5b" /> },
    { label: "제목2", type: "h2", icon: <H2BlockIcon color="#5f5e5b" /> },
    { label: "제목3", type: "h3", icon: <H3BlockIcon color="#5f5e5b" /> },
    { label: "글머리 기호 목록", type: "ul", icon: <BulletedListIcon color="#5f5e5b" /> },
    { label: "번호 매기기 목록", type: "numberedList", icon: <NumberedListIcon color="#5f5e5b" /> },
    { label: "할 일 목록", type: "checkedList", icon: <CheckedListIcon color="#5f5e5b" /> },
    { label: "구분선", type: "divider", icon: <DividerIcon color="#5f5e5b" /> },
    { label: "토글 목록", type: "toggleText", icon: <TextBlockIcon color="#5f5e5b" /> },
    { label: "토글 제목1", type: "toggleH1", icon: <H1BlockIcon color="#5f5e5b" /> },
    { label: "토글 제목2", type: "toggleH2", icon: <H2BlockIcon color="#5f5e5b" /> },
    { label: "토글 제목3", type: "toggleH3", icon: <H3BlockIcon color="#5f5e5b" /> },
    { divider: true },
    { label: "코드", type: "code", icon: <CodeBlockIcon color="#5f5e5b" /> },
    { label: "표", type: "table", icon: <TableIcon color="#5f5e5b" /> },
    { label: "그래프", type: "chart", icon: <BarChartVIcon color="#5f5e5b" /> },
    { divider: true },
    { label: "2열", type: "columns", icon: <ColumnsIcon color="#5f5e5b" /> },
];
