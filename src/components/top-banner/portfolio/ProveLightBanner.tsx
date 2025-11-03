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
                        {"전문의, 임상심리전문가, 상담심리전문가"}
                        <br />
                        {"& (주)마인즈에이아이 R&D센터 공동 개발."}
                    </tw.SubTitle>
                    <tw.BtnWrap>
                        <button className="px-6 py-3 bg-[#416bac] text-white rounded-lg hover:bg-[#416bac]/80 transition-colors">기업 바로가기</button>
                        <button className="px-6 py-3 bg-blue-50 text-[#416bac] rounded-lg hover:bg-blue-100 transition-colors">설문 체험하기</button>
                    </tw.BtnWrap>
                </tw.StartWrap>

                <tw.EndWrap>
                    <tw.ImgContainer>
                        <img className="h-36 object-contain" src="/assets/portfolio/prove-lite/prove_l_logo.png" alt="" />
                    </tw.ImgContainer>
                    <tw.BottomLabel />
                </tw.EndWrap>
            </div>

            <div className="flex flex-col w-full">
                <p className="text-xs text-gray-800 font-normal mx-auto mt-20">PROVE Lite를 사용하는 파트너</p>
                <div className="w-full flex justify-between px-20">
                    <img className="w-32 h-24 object-contain" src="/assets/portfolio/prove-lite/medicheck_logo.jpg" alt="" />
                    <img className="w-32 h-24 object-contain" src="/assets/portfolio/prove-lite/nurseorg_logo.jpg" alt="" />
                    <img className="w-32 h-24 object-contain" src="/assets/portfolio/prove-lite/samsunglogitech_logo.png" alt="" />
                    <img className="w-32 h-24 object-contain" src="/assets/portfolio/prove-lite/donghwa_logo.svg" alt="" />
                </div>
            </div>
        </div>
    );
}
