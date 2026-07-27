import { roboto } from "@/utils/font";
import { RightIcon } from "../ui/icons/TypeMenuSvg";

export default function PortfolioListBanner() {
    return (
        <div className="w-full flex flex-col">
            <h2 className="text-[3.25rem] text-[#191918] font-bold m:text-[2.25rem]">포트폴리오</h2>

            <div className="w-full flex gap-8 pt-6">
                <a href="/portfolio/medsec" className="w-full rounded-2xl h-[28rem] shadow cursor-pointer flex bg-white m:flex-col m:h-auto overflow-hidden group">
                    <div className="flex p-6 justify-between w-1/3 m:w-full">
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <label className="text-base">의료기기 인허가 · GMP</label>
                            </div>
                            <div className="w-full flex justify-between">
                                <label className="text-2xl font-semibold">임상허가·인허가·GMP를 위한 사이버보안 전문</label>
                            </div>
                            <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full ml-auto">
                                <RightIcon color="#ffffff" />
                            </button>
                            <div className="w-full flex flex-col mt-auto">
                                <label className="text-gray text-base font-bold">의료기기 임상시험 허가 · 품목 인허가</label>
                                <p className="text-gray-500 text-base">사이버보안 요건을 시험성적서로 갈음해 인허가까지 대응합니다.</p>
                                <hr className="my-4"></hr>
                                <label className="text-gray text-base font-bold">디지털의료기기 GMP (별표3) 대응</label>
                                <hr className="my-4"></hr>
                                <label className="text-gray text-base font-bold">KS X IEC 62443-4-2 시험성적서 작성</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-r-2xl bg-[#2f5aa8] m:rounded-r-none m:rounded-b-2xl m:h-56 m:w-full flex items-center justify-center">
                        <span className="text-white text-6xl transition-transform duration-300 group-hover:scale-110">🔐</span>
                    </div>
                </a>
            </div>

            <div className="w-full flex gap-6 pt-6 m:flex-col">
                <a href="/portfolio/provelite" className="w-full rounded-2xl h-[28rem] shadow cursor-pointer flex flex-col bg-white overflow-hidden group">
                    <div className="flex p-6 justify-between">
                        <div className="w-full flex flex-col gap-2">
                            <label className="text-base">심리지표 평가 프로그램</label>
                            <div className="w-full flex justify-between">
                                <label className={`text-2xl font-bold ${roboto.className}`}>PROVE Lite</label>
                                <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full">
                                    <RightIcon color="#ffffff" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pl-8 pt-6 w-full flex-1 overflow-hidden bg-[#416bac]">
                        <div className="relative w-full h-full rounded-tl-xl border-2 border-[#ededeb] bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 origin-top-left overflow-hidden">
                            <img
                                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[1px] scale-105"
                                src="/assets/portfolio/prove-lite/admin_layout.png"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-white/35"></div>
                            <img
                                className="absolute left-1/2 top-1/2 w-[82%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                                src="/assets/portfolio/prove-lite/prove_l_logo.png"
                                alt="PROVE Lite"
                            />
                        </div>
                    </div>
                </a>
                <a href="/portfolio/mindsnavi" className="w-full rounded-2xl h-[28rem] shadow cursor-pointer flex flex-col bg-white overflow-hidden group">
                    <div className="flex p-6 justify-between">
                        <div className="w-full flex flex-col gap-2">
                            <label className="text-base">정신건강 분석평가</label>
                            <div className="w-full flex justify-between">
                                <label className={`text-2xl font-bold ${roboto.className}`}>Minds. NAVI</label>
                                <button className="w-8 h-8 p-1.5 bg-[#222222] rounded-full">
                                    <RightIcon color="#ffffff" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pl-8 pt-6 w-full flex-1 overflow-hidden bg-[#1a8f7a]">
                        <div className="relative w-full h-full rounded-tl-xl border-2 border-[#ededeb] bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 origin-top-left overflow-hidden">
                            <img
                                className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[1px] scale-105"
                                src="/assets/portfolio/minds-navi/dashboard.png"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-white/30"></div>
                            <img
                                className="absolute left-1/2 top-1/2 w-[100%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                                src="/assets/portfolio/minds-navi/minds-navi-logo-horizontal.png"
                                alt="Minds. NAVI"
                            />
                        </div>
                    </div>
                </a>
            </div>

            <div className="w-full flex gap-8 pt-6">
                <div className="w-full rounded-2xl h-[18rem] shadow cursor-pointer flex bg-white m:flex-col m:h-auto">
                    <div className="flex p-6 justify-between w-1/3 m:w-full">
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
                    <div className="flex-1 rounded-r-2xl bg-[#78736f] m:rounded-r-none m:rounded-b-2xl m:h-48 m:w-full"></div>
                </div>
            </div>
        </div>
    );
}
