import { roboto } from "@/util/font";

import * as tw from "../MainBanner.styles";

export default function ProveLiteBanner() {
    return (
        <div className="w-full h-auto flex flex-col m:flex-col-reverse">
            <div className="w-full h-auto flex flex-reverse m:flex-col-reverse">
                <tw.StartWrap>
                    <tw.Title className="hidden m:block">{"PROVE LITE 설문"}</tw.Title>
                    <tw.Title className="block m:hidden text-[#191918] tracking-[-0.1em]">
                        <span className="tracking-normal">
                        {"심리지표 평가"}
                        </span>
                        <span className={`tracking-wide ${roboto.className}`}>
                        {"PROVE LITE"}
                        </span>
                    </tw.Title>
                    <p className="text-[1.3rem] leading-none tracking-tighter font-medium text-[#191918] m:text-[1rem] m:leading-normal">
                        {"자가 설문 평가를 통해 "}
                        <span className="text-[#416bac]">
                        {"우울증상"}
                        </span>
                        {"과"}
                        <span className="text-red-500">
                        {"스트레스 상태"}
                        </span>
                        {"를"}
                        <br />
                        {"알아볼 수 있는 "}
                        {"정신건강 분석평가 프로그램"}
                    </p>
                    <tw.BtnWrap>
                        <a className="px-6 py-3 bg-[#416bac] text-white rounded-lg hover:bg-[#416bac]/80 transition-colors cursor-pointer" href="https://www.mindsai.co.kr/" target="_blank" rel="noopener noreferrer">기업 바로가기</a>
                        <a className="px-6 py-3 bg-blue-50 text-[#416bac] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">간소화 서비스 경험하기</a>
                    </tw.BtnWrap>
                </tw.StartWrap>

                <tw.EndWrap>
                    <div className="flex w-full justify-center items-center my-auto mx-auto gap-4">
                        <img className="h-36 object-contain" src="/assets/portfolio/prove-lite/prove_l_logo.png" alt="" />
                    </div>
                    <div className="w-full h-[1px] bg-[#416bac] m:hidden" />
                </tw.EndWrap>
            </div>

            <div className="flex flex-col w-full mb-4 mt-32">
                <p className="font-normal text-xs leading-4 mx-auto mb-4 tracking-[-0.0078125rem]">PROVE Lite를 사용하는 파트너</p>
                <div className="w-full flex justify-between px-20">
                    <img className="w-32 object-contain" src="/assets/portfolio/prove-lite/medicheck_logo.jpg" alt="" />
                    <img className="w-32 object-contain" src="/assets/portfolio/prove-lite/nurseorg_logo.jpg" alt="" />
                    <img className="w-32 object-contain" src="/assets/portfolio/prove-lite/samsunglogitech_logo.png" alt="" />
                    <img className="w-32 object-contain" src="/assets/portfolio/prove-lite/donghwa_logo.svg" alt="" />
                </div>
            </div>
        </div>
    );
}
