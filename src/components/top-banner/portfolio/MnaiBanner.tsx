import { roboto } from "@/utils/font";
import * as tw from "../MainBanner.styles";

const C = "#1d6f8f";

export default function MnaiBanner() {
    return (
        <div className="w-full h-auto flex flex-col">
            <div className="w-full h-auto flex m:flex-col-reverse">
                <tw.StartWrap className="m:items-center m:text-center">
                    <tw.Title className="hidden m:flex m:flex-col m:text-center">
                        <span className="whitespace-nowrap text-[4rem] tracking-[-0.28rem] m:text-[2.5rem]">AI 우울 판정 보조</span>
                        <span className={`${roboto.className} tracking-[0.06em]`}>Minds. NAVI AI</span>
                    </tw.Title>
                    <tw.Title className="block m:hidden text-[#191918]">
                        <span className="block whitespace-nowrap text-[4rem] tracking-[-0.28rem]">AI 우울 판정 보조</span>
                        <span className={`block tracking-[0.06em] ${roboto.className}`}>Minds. NAVI AI</span>
                    </tw.Title>
                    <p className="text-[1.25rem] leading-relaxed tracking-tighter font-medium text-[#191918] m:text-[1rem] m:leading-normal break-keep">
                        {"심리 설문과 "}
                        <span style={{ color: C }}>타액 호르몬</span>
                        {"을 AI 모델이 판정하고"}
                        <br />
                        <span className="text-[#ec4e25]">SHAP 기여도</span>
                        {"로 근거를 설명하는 클라우드형 의료기기"}
                    </p>
                    <tw.BtnWrap className="m:flex-wrap m:justify-center">
                        <a
                            className="px-6 py-3 text-white rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                            style={{ background: C }}
                            href="https://www.mindsai.co.kr/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            기업 바로가기
                        </a>
                        {/* 저장소 규칙: 내부 링크는 하드 내비게이션(<a>) 사용 */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a className="px-6 py-3 bg-[#e6f0f4] rounded-lg hover:bg-[#d6e6ec] transition-colors cursor-pointer" style={{ color: C }} href="/post/mnai-security-test">
                            시험성적서 보기
                        </a>
                    </tw.BtnWrap>
                    <p className="max-w-full text-[11px] font-normal tracking-tight text-gray-400 m:text-center break-keep">
                        클라우드형 SaMD · 네이버 클라우드 NKS · 디지털의료기기 GMP(별표3) · 인허가 진행중
                    </p>
                </tw.StartWrap>

                <tw.EndWrap>
                    <div className="flex w-full justify-center items-center my-auto mx-auto">
                        <img className="w-full max-w-[26rem] object-contain m:max-w-[16rem]" src="/assets/portfolio/mnai/logo-vertical.png" alt="Minds. NAVI AI" />
                    </div>
                    <div className="w-full h-px m:hidden" style={{ background: C }} />
                </tw.EndWrap>
            </div>
        </div>
    );
}
