import { roboto } from "@/util/font";

export default function WeHubHoverMenu(){
    return (
        <div className="absolute top-full left-0 right-0 pt-2 pb-8 px-8 bg-white shadow-lg border-b border-gray-100 z-50 w-full flex justify-center">
            <div className="flex justify-between max-w-[100rem] w-full px-4">
                <div className="w-1/2">
                    <p className="text-sm text-gray-400 pl-2 font-medium">기능</p>
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col pr-10 pt-4">
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className={`text-xl font-semibold ${roboto.className}`}>WeHub AI</p>
                                <p className="text-xs text-gray-400">구축, 작성, 자동화를 위한 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">에이전트</p>
                                <p className="text-xs text-gray-400">수동 작업 처리</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">기업 통합 검색</p>
                                <p className="text-xs text-gray-400">즉시 답변을 찾을 수 있는 기능</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">AI 노트</p>
                                <p className="text-xs text-gray-400">AI가 완벽하게 정리해 드립니다.</p>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col pr-10 pt-4">
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">문서</p>
                                <p className="text-xs text-gray-400">간단하면서도 강력한 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">지식 베이스</p>
                                <p className="text-xs text-gray-400">모든 지식을 한데 모은 허브</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">프로젝트</p>
                                <p className="text-xs text-gray-400">어떤 프로젝트든 관리할 수 있는 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">사이트</p>
                                <p className="text-xs text-gray-400">뭐든 빠르게 게시할 수 있는 툴</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2">
                    <p className="text-sm text-gray-400 pl-2 font-medium">시작하기</p>
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col pr-10 pt-4">
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className={`text-xl font-semibold ${roboto.className}`}>WeHub AI</p>
                                <p className="text-xs text-gray-400">구축, 작성, 자동화를 위한 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">에이전트</p>
                                <p className="text-xs text-gray-400">수동 작업 처리</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">기업 통합 검색</p>
                                <p className="text-xs text-gray-400">즉시 답변을 찾을 수 있는 기능</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <p className="text-xl font-semibold">AI 노트</p>
                                <p className="text-xs text-gray-400">AI가 완벽하게 정리해 드립니다.</p>
                            </div>
                        </div>
                        <div className="w-1/2 flex justify-center items-center">
                            <img src="../../assets/header_menu_image.webp" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};