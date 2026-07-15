export const ColorPainterIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11 16C11 15.0681 11 14.6022 11.1522 14.2346C11.3552 13.7446 11.7446 13.3552 12.2346 13.1522C12.6022 13 13.0681 13 14 13H16.8C17.9201 13 18.4802 13 18.908 12.782C19.2843 12.5903 19.5903 12.2843 19.782 11.908C20 11.4802 20 10.9201 20 9.8V9.2C20 8.07989 20 7.51984 19.782 7.09202C19.5903 6.71569 19.2843 6.40973 18.908 6.21799C18.4802 6 17.9201 6 16.8 6H16M16 6C16 6.93188 16 7.39782 15.8478 7.76537C15.6448 8.25542 15.2554 8.64477 14.7654 8.84776C14.3978 9 13.9319 9 13 9H7C6.06812 9 5.60218 9 5.23463 8.84776C4.74458 8.64477 4.35523 8.25542 4.15224 7.76537C4 7.39782 4 6.93188 4 6C4 5.06812 4 4.60218 4.15224 4.23463C4.35523 3.74458 4.74458 3.35523 5.23463 3.15224C5.60218 3 6.06812 3 7 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6448 3.74458 15.8478 4.23463C16 4.60218 16 5.06812 16 6ZM10.6 21H11.4C11.9601 21 12.2401 21 12.454 20.891C12.6422 20.7951 12.7951 20.6422 12.891 20.454C13 20.2401 13 19.9601 13 19.4V17.6C13 17.0399 13 16.7599 12.891 16.546C12.7951 16.3578 12.6422 16.2049 12.454 16.109C12.2401 16 11.9601 16 11.4 16H10.6C10.0399 16 9.75992 16 9.54601 16.109C9.35785 16.2049 9.20487 16.3578 9.10899 16.546C9 16.7599 9 17.0399 9 17.6V19.4C9 19.9601 9 20.2401 9.10899 20.454C9.20487 20.6422 9.35785 20.7951 9.54601 20.891C9.75992 21 10.0399 21 10.6 21Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const LoopIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 4L21 7M21 7L18 10M21 7H7C4.79086 7 3 8.79086 3 11M6 20L3 17M3 17L6 14M3 17H17C19.2091 17 21 15.2091 21 13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CopyIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="12" height="12" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TrashBinIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const FontIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M22 12V21M2 21L8 3L14 21M11 14H5M19 21C17.3431 21 16 19.6569 16 18V15C16 13.3431 17.3431 12 19 12C20.6569 12 22 13.3431 22 15V18C22 19.6569 20.6569 21 19 21Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const RightIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TextBlockIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Edit / Text">
            <path
                id="Vector"
                d="M10 19H12M12 19H14M12 19V5M12 5H6V6M12 5H18V6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

export const H1BlockIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Edit / Heading_H1">
            <path
                id="Vector"
                d="M16 10L19 9L19 19M3 5V12M3 12V19M3 12H11M11 5V12M11 12V19"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

export const H2BlockIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Edit / Heading_H2">
            <path
                id="Vector"
                d="M15 12.5V12C15 10.3431 16.3431 9 18 9H18.1716C19.7337 9 20.9996 10.2665 20.9996 11.8286C20.9996 12.5788 20.702 13.2982 20.1716 13.8286L15 19.0002L21 19M3 5V12M3 12V19M3 12H11M11 5V12M11 12V19"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

export const H3BlockIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Edit / Heading_H3">
            <path
                id="Vector"
                d="M15 9H21L17 13H18C19.6569 13 21 14.3431 21 16C21 17.6569 19.6569 19 18 19C17.3793 19 16.7738 18.8077 16.2671 18.4492C15.7604 18.0907 15.3775 17.5838 15.1709 16.9985M3 5V12M3 12V19M3 12H11M11 5V12M11 12V19"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

export const BulletedListIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="9" r="3" fill={color} />
        <circle cx="7" cy="23" r="3" fill={color} />
        <rect x="16" y="22" width="14" height="2" fill={color} />
        <rect x="16" y="8" width="14" height="2" fill={color} />
    </svg>
);

export const NumberedListIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="22" width="14" height="2" fill={color} />
        <rect x="16" y="8" width="14" height="2" fill={color} />
        <polygon points="8 12 8 4 6 4 6 5 4 5 4 7 6 7 6 12 4 12 4 14 6 14 8 14 10 14 10 12 8 12" fill={color} />
        <path d="M10,28H4V24a2,2,0,0,1,2-2H8V20H4V18H8a2,2,0,0,1,2,2v2a2,2,0,0,1-2,2H6v2h4Z" fill={color} />
    </svg>
);

export const CheckedListIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="8" width="14" height="2" fill={color} />
        <polygon points="6 10.59 3.41 8 2 9.41 6 13.41 14 5.41 12.59 4 6 10.59" fill={color} />
        <rect x="16" y="22" width="14" height="2" fill={color} />
        <polygon points="6 24.59 3.41 22 2 23.41 6 27.41 14 19.41 12.59 18 6 24.59" fill={color} />
    </svg>
);
export const DividerIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12L20 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// 가로 막대그래프 아이콘
export const BarChartHIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="12" height="4" rx="1" fill={color} />
        <rect x="3" y="10" width="18" height="4" rx="1" fill={color} />
        <rect x="3" y="16" width="8" height="4" rx="1" fill={color} />
    </svg>
);

// 세로 막대그래프 아이콘
export const BarChartVIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="9" width="4" height="11" rx="1" fill={color} />
        <rect x="10" y="4" width="4" height="16" rx="1" fill={color} />
        <rect x="16" y="13" width="4" height="7" rx="1" fill={color} />
    </svg>
);

// 표 아이콘
export const TableIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" stroke={color} strokeWidth="1.6" />
        <path d="M3.5 9.5H20.5M3.5 14.5H20.5M9 4.5V19.5" stroke={color} strokeWidth="1.6" />
    </svg>
);

export const CodeBlockIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 8.5L5.5 12L9 15.5M15 8.5L18.5 12L15 15.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);