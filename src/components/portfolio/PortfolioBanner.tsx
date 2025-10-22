import { RightIcon } from "../ui/hover-header/svg/TypeMenuSvg";

export default function PortfolioBanner() {
    return (
        <div className="w-full flex gap-8">
            <div className="w-full rounded-2xl h-[30rem] shadow cursor-pointer flex flex-col">
                <div className="flex p-7 justify-between">
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
            <div className="w-full rounded-2xl h-[30rem] shadow cursor-pointer flex flex-col">
                <div className="flex p-7 justify-between">
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
    );
}
