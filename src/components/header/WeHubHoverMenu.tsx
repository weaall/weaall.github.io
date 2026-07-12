import { roboto } from "@/utils/font";

interface MenuEntry {
    title: string;
    desc: string;
    brand?: boolean;
}

// 기능 섹션: 2개 컬럼
const FEATURE_COLUMNS: MenuEntry[][] = [
    [
        { title: "WeHub AI", desc: "구축, 작성, 자동화를 위한 툴", brand: true },
        { title: "에이전트", desc: "수동 작업 처리" },
        { title: "기업 통합 검색", desc: "즉시 답변을 찾을 수 있는 기능" },
        { title: "AI 노트", desc: "AI가 완벽하게 정리해 드립니다." },
    ],
    [
        { title: "문서", desc: "간단하면서도 강력한 툴" },
        { title: "지식 베이스", desc: "모든 지식을 한데 모은 허브" },
        { title: "프로젝트", desc: "어떤 프로젝트든 관리할 수 있는 툴" },
        { title: "사이트", desc: "뭐든 빠르게 게시할 수 있는 툴" },
    ],
];

// 시작하기 섹션의 텍스트 컬럼은 기능의 첫 컬럼과 동일
const START_COLUMN = FEATURE_COLUMNS[0];

function MenuItem({ title, desc, brand }: MenuEntry) {
    return (
        <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <p className={`text-xl font-semibold ${brand ? roboto.className : ""}`}>{title}</p>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
    );
}

function MenuColumn({ items }: { items: MenuEntry[] }) {
    return (
        <div className="w-1/2 flex flex-col pr-10 pt-4">
            {items.map((item) => (
                <MenuItem key={item.title} {...item} />
            ))}
        </div>
    );
}

export default function WeHubHoverMenu() {
    return (
        <div className="absolute top-full left-0 right-0 pt-2 pb-8 px-8 bg-white shadow-lg border-b border-gray-100 z-50 w-full flex justify-center">
            <div className="flex justify-between max-w-[100rem] w-full px-4">
                <div className="w-1/2">
                    <p className="text-sm text-gray-400 pl-2 font-medium">기능</p>
                    <div className="w-full flex">
                        {FEATURE_COLUMNS.map((col, i) => (
                            <MenuColumn key={i} items={col} />
                        ))}
                    </div>
                </div>
                <div className="w-1/2">
                    <p className="text-sm text-gray-400 pl-2 font-medium">시작하기</p>
                    <div className="w-full flex">
                        <MenuColumn items={START_COLUMN} />
                        <div className="w-1/2 flex justify-center items-center">
                            <img src="../../assets/header_menu_image.webp" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
