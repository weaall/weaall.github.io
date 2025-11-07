import { AWSIcon } from "@/components/ui/hover-header/svg/PortfolioSvg";

export default function ProveLiteDevList() {
    return (
        <div className="w-full flex flex-col">
            <h2 className="text-[2.625rem] text-[#191918] text-center font-bold tracking-[-0.09375rem]">프로젝트 오버뷰</h2>

            <div className="w-full flex flex-col pt-6 gap-6">
                <div className="w-full flex gap-6">

                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <AWSIcon />
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
                                <AWSIcon />
                            </div>
                            <h3 className="text-lg font-bold mb-1">서비스 플로우</h3>
                            <p>AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <AWSIcon />
                            </div>
                            <h3 className="text-lg font-bold mb-1">서비스 핵심 로직</h3>
                            <p>AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
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
                                <AWSIcon />
                            </div>
                            <h3 className="text-lg font-bold mb-1">시스템 아키텍처</h3>
                            <p>AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <AWSIcon />
                            </div>
                            <h3 className="text-lg font-bold mb-1">서비스 플로우</h3>
                            <p>AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>


                    <div className="w-1/3 h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-[#f6f5f4] overflow-hidden">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <AWSIcon />
                            </div>
                            <h3 className="text-lg font-bold mb-1">서비스 핵심 로직</h3>
                            <p>AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
                        </div>
                        <div className=" pl-8 w-full h-1/2 overflow-hidden">
                            <img className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/prove-lite/aws_arch.png" alt="" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
