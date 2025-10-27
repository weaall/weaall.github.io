import { roboto } from "@/util/font";
import { RightIcon } from "../ui/hover-header/svg/TypeMenuSvg";

export default function PortfolioBanner() {
    return (
        <div className="w-full flex flex-col">
            <h2 className="text-[3.25rem] text-[#191918] font-bold "><span className={roboto.className}>WeHub</span>1.0과 함께하세요</h2>

            <div className="w-full flex gap-8 pt-6">
                <div className="w-full rounded-2xl h-[28rem] shadow cursor-pointer flex bg-white">
                    <div className="flex p-6 justify-between w-1/3">
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <label className="text-base">맞춤 에이전트</label>
                            </div>
                            <div className="w-full flex justify-between">
                                <label className="text-2xl font-semibold">작업을 배정하면, 에이전트가 작업을 수행합니다.</label>
                            </div>
                            <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full ml-auto">
                                <RightIcon color="#ffffff" />
                            </button>
                            <div className="w-full flex flex-col mt-auto">
                                <label className="text-gray text-base font-bold">단순·반복 업무 자동화</label>
                                <p className="text-gray-500 text-base">며칠씩 걸리던 작업을 단 몇 분 만에. 목표만 알려주면 놀라운 결과를 눈으로 확인할 수 있습니다.</p>
                                <hr className="my-4"></hr>
                                <label className="text-gray text-base font-bold">팀원들과 함께하는 AI</label>
                                <hr className="my-4"></hr>
                                <label className="text-gray text-base font-bold">내가 아는 정보를 공유합니다</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-r-2xl bg-[#78736f]"></div>
                </div>
            </div>

            <div className="w-full flex gap-6 pt-6">
                <div className="w-full rounded-2xl h-[28rem] shadow cursor-pointer flex flex-col bg-white">
                    <div className="flex p-6 justify-between">
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <label className="text-base">포트폴리오1에 대한 설명</label>
                            </div>
                            <div className="w-full flex justify-between">
                                <label className="text-2xl font-bold">포트폴리오1</label>
                                <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full">
                                    <RightIcon color="#ffffff" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-b-2xl bg-[#f77463]"></div>
                </div>
                <div className="w-full rounded-2xl h-[28rem] shadow cursor-pointer flex flex-col bg-white">
                    <div className="flex p-6 justify-between">
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <label className="text-base">포트폴리오1에 대한 설명</label>
                            </div>
                            <div className="w-full flex justify-between">
                                <label className="text-2xl font-bold">포트폴리오1</label>
                                <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full">
                                    <RightIcon color="#ffffff" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-b-2xl bg-[#62aef0]"></div>
                </div>
            </div>

            <div className="w-full flex gap-8 pt-6">
                <div className="w-full rounded-2xl h-[18rem] shadow cursor-pointer flex bg-white">
                    <div className="flex p-6 justify-between w-1/3">
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <label className="text-base">포트폴리오3에 대한 설명</label>
                            </div>
                            <div className="w-full flex justify-between">
                                <label className="text-2xl font-bold">포트폴리오3</label>
                                <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full">
                                    <RightIcon color="#ffffff" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-r-2xl bg-[#78736f]"></div>
                </div>
            </div>
        </div>
    );
}
