import { roboto } from "@/utils/font";
import * as tw from "../MainBanner.styles";

const partners = [
    {
        name: "강남세브란스병원",
        logo: "/assets/portfolio/minds-navi/partners/gangnam-severance-hospital.png",
        className: "max-h-7",
    },
    {
        name: "세브란스 헬스체크업",
        logo: "/assets/portfolio/minds-navi/partners/severance-health-checkup.jpg",
        className: "max-h-[4.5rem]",
    },
    {
        name: "U2BIO",
        logo: "/assets/portfolio/minds-navi/partners/u2bio.png",
        className: "max-h-10",
    },
    {
        name: "서울권역 난임·임산부심리상담센터",
        logo: "/assets/portfolio/minds-navi/partners/seoul-pregnancy-counseling-center.gif",
        className: "max-h-6",
    },
    {
        name: "횡성군정신건강복지센터",
        logo: "/assets/portfolio/minds-navi/partners/hoengseong-mental-health-center.png",
        className: "max-h-9",
    },
    {
        name: "학생마인드케어센터",
        logo: "/assets/portfolio/minds-navi/partners/mind-care-support.png",
        className: "max-h-8",
    },
];

export default function MindsNaviBanner() {
    return (
        <div className="w-full h-auto flex flex-col m:flex-col-reverse">
            <div className="w-full h-auto flex flex-reverse m:flex-col-reverse">
                <tw.StartWrap className="m:items-center m:text-center">
                    <tw.Title className="hidden m:flex m:flex-col m:text-center">
                        <span className="whitespace-nowrap text-[4rem] tracking-[-0.28rem] m:text-[2.5rem]">정신건강 분석평가</span>
                        <span className={`${roboto.className} tracking-[0.08em]`}>Minds. NAVI</span>
                    </tw.Title>
                    <tw.Title className="block m:hidden text-[#191918]">
                        <span className="block whitespace-nowrap text-[4rem] tracking-[-0.28rem] m:text-[2.5rem]">정신건강 분석평가</span>
                        <span className={`block tracking-[0.08em] ${roboto.className}`}>Minds. NAVI</span>
                    </tw.Title>
                    <p className="text-[1.3rem] leading-none tracking-tighter font-medium text-[#191918] m:text-[1rem] m:leading-normal">
                        <span className="text-[#1a8f7a]">심리평가</span>
                        {"를 통해 우울 상태와 정신건강상의 취약 및 보호요인을 확인"}
                        <br />
                        {"타액의 "}
                        <span className="text-[#ec4e25]">Cortisol·DHEA 호르몬 분석</span>
                        {"으로 스트레스 지수를 파악하여"}
                        <br />
                        {"종합결과 및 솔루션을 제시하는 우울증 진단 보조 의료기기"}
                    </p>
                    <tw.BtnWrap>
                        <a
                            className="px-6 py-3 bg-[#1a8f7a] text-white rounded-lg hover:bg-[#1a8f7a]/80 transition-colors cursor-pointer"
                            href="https://www.mindsai.co.kr/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            기업 바로가기
                        </a>
                        <a className="px-6 py-3 bg-[#e6f4f1] text-[#1a8f7a] rounded-lg hover:bg-[#d7eee9] transition-colors cursor-pointer">
                            서비스 자세히 살펴보기
                        </a>
                    </tw.BtnWrap>
                </tw.StartWrap>

                <tw.EndWrap>
                    <div className="flex w-full justify-center items-center my-auto mx-auto">
                        <img className="h-72 object-contain m:h-56" src="/assets/portfolio/minds-navi/minds-navi-logo.png" alt="Minds. NAVI" />
                    </div>
                    <div className="w-full h-[1px] bg-[#1a8f7a] m:hidden" />
                </tw.EndWrap>
            </div>

            <div className="flex flex-col w-full mb-4 mt-32">
                <p className="font-normal text-xs leading-4 mx-auto mb-5 tracking-[-0.0078125rem]">Minds. NAVI와 협력중인 기관</p>
                <div className="grid grid-cols-3 gap-x-10 gap-y-8 items-center px-8 m:grid-cols-2 m:px-4">
                    {partners.map((partner) => (
                        <div key={partner.name} className="h-20 flex items-center justify-center">
                            <img className={`w-full object-contain ${partner.className}`} src={partner.logo} alt={partner.name} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
