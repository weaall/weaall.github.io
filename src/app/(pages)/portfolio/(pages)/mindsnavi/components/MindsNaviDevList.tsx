"use client";

import { AdminLayoutIcon, AWSIcon, CodeIcon, EtcIcon, LogicIcon, UserLayoutIcon } from "@/components/ui/icons/PortfolioSvg";

const cards = [
    {
        icon: AWSIcon,
        title: "시스템 아키텍처",
        description: "Minds. NAVI 운영 환경과 인프라 구성을 정리합니다.",
        imageSrc: "/assets/portfolio/prove-lite/aws_arch.png",
        imageAlt: "system architecture",
    },
    {
        icon: CodeIcon,
        title: "어플리케이션 아키텍처",
        description: "서비스 화면, API, 데이터 흐름을 마인즈내비 기준으로 재구성합니다.",
        imageSrc: "/assets/portfolio/prove-lite/app_arch.png",
        imageAlt: "application architecture",
    },
    {
        icon: LogicIcon,
        title: "서비스 플로우",
        description: "사용자가 목표를 찾고 다음 행동으로 이어지는 흐름을 정리합니다.",
        imageSrc: "/assets/portfolio/prove-lite/service_flow.png",
        imageAlt: "service flow",
    },
    {
        icon: UserLayoutIcon,
        title: "사용자 앱",
        description: "사용자 경험과 주요 화면 구조를 Minds. NAVI에 맞춰 개편합니다.",
        imageSrc: "/assets/portfolio/prove-lite/user_layout.png",
        imageAlt: "user layout",
    },
    {
        icon: AdminLayoutIcon,
        title: "어드민 대시보드",
        description: "운영자가 콘텐츠와 지표를 관리하는 화면을 정리합니다.",
        imageSrc: "/assets/portfolio/prove-lite/admin_layout.png",
        imageAlt: "admin layout",
    },
    {
        icon: EtcIcon,
        title: "기타",
        description: "로고, 에셋, 문서 등 추가 자료를 순차적으로 채워 넣습니다.",
        imageSrc: "/assets/portfolio/prove-lite/aws_arch.png",
        imageAlt: "etc",
    },
];

export default function MindsNaviDevList() {
    return (
        <div className="w-full flex flex-col">
            <h2 className="text-[2.625rem] text-[#191918] text-center font-bold tracking-[-0.09375rem]">프로젝트 오버뷰</h2>

            <div className="w-full grid grid-cols-3 gap-6 pt-6 m:grid-cols-1">
                {cards.map(({ icon: Icon, title, description, imageSrc, imageAlt }) => (
                    <div
                        key={title}
                        className="h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden group"
                    >
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <div className="w-8 h-8 mb-2">
                                <Icon color="#1a8f7a" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-[#191918]">{title}</h3>
                            <p className="text-[#191918] text-base">{description}</p>
                        </div>
                        <div className="pl-8 w-full h-1/2 overflow-hidden">
                            <img
                                className="object-contain w-full rounded-tl-xl border-2 border-[#ededeb] shadow-lg transition-transform duration-300 group-hover:scale-110 origin-top-left"
                                src={imageSrc}
                                alt={imageAlt}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-20">
                <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem] pb-4">Minds. NAVI</h2>
                <div className="w-full bg-[#f6f5f4] rounded-2xl border-2 border-transparent overflow-hidden p-10">
                    <img
                        className="w-full max-w-[44rem] mx-auto object-contain"
                        src="/assets/portfolio/minds-navi/minds-navi-logo.png"
                        alt="Minds. NAVI"
                    />
                </div>
            </div>
        </div>
    );
}
