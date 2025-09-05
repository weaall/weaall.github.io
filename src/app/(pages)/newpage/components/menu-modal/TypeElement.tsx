import {
    BulletedListIcon,
    CheckedListIcon,
    DividerIcon,
    H1BlockIcon,
    H2BlockIcon,
    H3BlockIcon,
    NumberedListIcon,
    TextBlockIcon,
} from "@/components/ui/hover-header/svg/TypeMenuSvg";

export const ELEMENTS = [
    { label: "텍스트", type: "p", icon: <TextBlockIcon color="#ffffffcf" /> },
    { label: "제목1", type: "h1", icon: <H1BlockIcon color="#ffffffcf" /> },
    { label: "제목2", type: "h2", icon: <H2BlockIcon color="#ffffffcf" /> },
    { label: "제목3", type: "h3", icon: <H3BlockIcon color="#ffffffcf" /> },
    { label: "글머리 기호 목록", type: "ul", icon: <BulletedListIcon color="#ffffffcf" /> },
    { label: "번호 매기기 목록", type: "numberedList", icon: <NumberedListIcon color="#ffffffcf" /> },
    { label: "할 일 목록", type: "checkedList", icon: <CheckedListIcon color="#ffffffcf" /> },
    { label: "구분선", type: "divider", icon: <DividerIcon color="#ffffffcf" /> },
];
