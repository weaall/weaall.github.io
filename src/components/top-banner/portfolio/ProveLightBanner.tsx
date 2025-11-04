import { roboto } from "@/util/font";

import * as tw from "../MainBanner.styles";

export default function ProveLightBanner() {
    return (
        <div className="w-full h-auto flex flex-col m:flex-col-reverse">
            <div className="w-full h-auto flex flex-reverse m:flex-col-reverse">
                <tw.StartWrap>
                    <tw.Title className="hidden m:block">{"자기보고식 설문지 PROVE LITE 평가"}</tw.Title>
                    <tw.Title className="block m:hidden text-[#416bac] tracking-[-0.1em]">
                        {"자기보고식 설문지"}
                        <br />
                        <span className="tracking-[-0.079em]">
                        {"PROVE LITE 평가"}
                        </span>
                    </tw.Title>
                    <tw.SubTitle>
                        {"자가 설문 평가를 통해 "}
                        <span className="text-[#416bac] font-bold">
                        {"우울증상"}
                        </span>
                        {"과"}
                        <span className="text-red-400 font-bold">
                        {"스트레스 상태"}
                        </span>
                        {"를"}
                        <br />
                        {"알아볼 수 있는 "}
                        <span className="font-bold">
                        {"정신건강 분석평가 프로그램"}
                        </span>
                    </tw.SubTitle>
                    <tw.BtnWrap>
                        <a className="px-6 py-3 bg-[#416bac] text-white rounded-lg hover:bg-[#416bac]/80 transition-colors cursor-pointer" href="https://www.mindsai.co.kr/" target="_blank" rel="noopener noreferrer">기업 바로가기</a>
                        <a className="px-6 py-3 bg-blue-50 text-[#416bac] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">설문 체험하기</a>
                    </tw.BtnWrap>
                </tw.StartWrap>

                <tw.EndWrap>
                    <div className="flex w-full justify-center items-center my-auto mx-auto gap-4">
                        <img className="h-36 object-contain" src="/assets/portfolio/prove-lite/prove_l_logo.png" alt="" />
                    </div>
                    <div className="w-full h-[1px] bg-[#416bac] m:hidden" />
                </tw.EndWrap>
            </div>

            <div className="flex flex-col w-full mb-4">
                <p className="text-xs text-gray-800 font-normal mx-auto mt-20 mb-4">PROVE Lite를 사용하는 파트너</p>
                <div className="w-full flex justify-between px-20">
                    <img className="w-32  object-contain" src="/assets/portfolio/prove-lite/medicheck_logo.jpg" alt="" />
                    <img className="w-32  object-contain" src="/assets/portfolio/prove-lite/nurseorg_logo.jpg" alt="" />
                    <img className="w-32  object-contain" src="/assets/portfolio/prove-lite/samsunglogitech_logo.png" alt="" />
                    <img className="w-32 object-contain" src="/assets/portfolio/prove-lite/donghwa_logo.svg" alt="" />
                </div>
            </div>
        </div>
    );
}
