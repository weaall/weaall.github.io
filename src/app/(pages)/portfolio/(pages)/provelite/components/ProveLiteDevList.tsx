import { AdminLayoutIcon, AWSIcon, CodeIcon, EtcIcon, LogicIcon, UserLayoutIcon } from "@/components/ui/hover-header/svg/PortfolioSvg";
import { roboto } from "@/util/font";
import UserLayout from "./UserLayout";

export default function ProveLiteDevList() {
    return (
        <div className="w-full flex flex-col">
            <h2 className="text-[2.625rem] text-[#191918] text-center font-bold tracking-[-0.09375rem]">프로젝트 오버뷰</h2>

            <div className="w-full flex flex-col pt-6 gap-6">
                <div className="w-full flex gap-6">

                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <AWSIcon color="#416bac" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-[#191918]">시스템 아키텍처</h3>
                            <p className="text-[#191918] text-base">AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <CodeIcon color="#416bac" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-[#191918]">어플리케이션 아키텍처</h3>
                            <p className="text-[#191918] text-base">Next.js 기반의 서버 사이드 렌더링(SSR) 웹 애플리케이션</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/app_arch.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2 p-[1px]">
                                <LogicIcon color="#416bac" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">서비스 로직</h3>
                            <p>서비스 로직</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>

                </div>

                <div className="w-full flex gap-6">
                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <UserLayoutIcon color="#416bac" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">유저 앱</h3>
                            <p>크로스 플랫폼 기반 자가 설문 평가 서비스</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/user_layout.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <AdminLayoutIcon color="#416bac" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">어드민 대시보드</h3>
                            <p>웹 기반 서비스 운영 및 통계 분석 대시보드</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/admin_layout.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <EtcIcon color="#416bac" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">기타</h3>
                            <p>기타</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>
                </div>

            </div>

            <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem]"><span className={roboto.className}>AWS</span> 아키텍쳐</h2>
            <div className="w-full h-1/2 overflow-hidden">
                <img className="object-full w-full rounded-xl bg-[#ffffff] shadow-lg p-4 px-32" src="/assets/portfolio/prove-lite/aws_arch_origin.png" alt="" />
            </div>

            <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem]">어플리케이션 아키텍쳐</h2>
            <div className="w-full h-1/2 overflow-hidden">
                <img className="object-full w-full rounded-xl bg-[#ffffff] shadow-lg p-4 px-32" src="/assets/portfolio/prove-lite/app_arch_origin.png" alt="" />
            </div>

            <UserLayout />

            <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem]">관리자 웹 레이아웃</h2>
            <div className="w-full h-auto">
                <img className="object-full w-full rounded-xl" src="/assets/portfolio/prove-lite/admin_layout_origin.png" alt="" />
            </div>
        </div>
    );
}
