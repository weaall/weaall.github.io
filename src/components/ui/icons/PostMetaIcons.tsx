// 페이지/포스트 메타(카테고리·날짜·커버·부제목·태그·아이콘) 버튼/칩용 모노크롬 라인 아이콘.
// 색은 currentColor를 따르므로 칩/버튼의 텍스트색(회색)과 동일하게 보인다(테마 안전).

interface IconProps {
    size?: number;
}

const base = (size: number) => ({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    xmlns: "http://www.w3.org/2000/svg",
});

export const FolderIcon = ({ size = 16 }: IconProps) => (
    <svg {...base(size)}>
        <path d="M3 7a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.4.6L11.4 7H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
);

export const CalendarIcon = ({ size = 16 }: IconProps) => (
    <svg {...base(size)}>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
);

export const CoverImageIcon = ({ size = 16 }: IconProps) => (
    <svg {...base(size)}>
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M20.5 15l-4.5-4.5L6 21" />
    </svg>
);

export const SubtitleIcon = ({ size = 16 }: IconProps) => (
    <svg {...base(size)}>
        <path d="M4 6.5h16M4 12h16M4 17.5h10" />
    </svg>
);

export const TagIcon = ({ size = 16 }: IconProps) => (
    <svg {...base(size)}>
        <path d="M3.5 11.8V5.5a2 2 0 0 1 2-2h6.3a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8l-6.1 6.1a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1-.8-1.2Z" />
        <circle cx="7.8" cy="7.8" r="1.2" />
    </svg>
);

export const FaceIcon = ({ size = 16 }: IconProps) => (
    <svg {...base(size)}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.5 14.2c.9 1.1 2.1 1.7 3.5 1.7s2.6-.6 3.5-1.7" />
        <path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.4} />
    </svg>
);
