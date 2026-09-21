import { roboto } from "@/utils/font";
import * as tw from "@/components/banner/Banner.styles";

const C = "#2f7d46";

export function CheeuBanner() {
    return (
        <div className="w-full h-auto flex flex-col">
            <div className="w-full h-auto flex m:flex-col-reverse">
                <tw.StartWrap className="m:items-center m:text-center">
                    <tw.Title className="hidden m:flex m:flex-col m:text-center">
                        <span className="whitespace-nowrap text-[4rem] tracking-[-0.28rem] m:text-[2.5rem]">VR 정신건강 훈련</span>
                        <span className={`${roboto.className} tracking-[0.02em]`}>CHEEU. Forest N</span>
                    </tw.Title>
                    <tw.Title className="block m:hidden text-[#191918]">
                        <span className="block whitespace-nowrap text-[4rem] tracking-[-0.28rem]">VR 정신건강 훈련</span>
                        <span className={`block tracking-[0.02em] ${roboto.className}`}>CHEEU. Forest N</span>
                    </tw.Title>
                    <p className="text-[1.25rem] leading-relaxed tracking-tighter font-medium text-[#191918] m:text-[1rem] m:leading-normal break-keep">
                        {"폐쇄망 노트북에 설치되는 "}
                        <span style={{ color: C }}>VR 심리치료 훈련</span>
                        {" 의료기기"}
                        <br />
                        {"설치·업데이트·백업·보안을 자체 구현해 "}
                        <span className="text-[#ec4e25]">변경 허가</span>
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
                        <a className="px-6 py-3 bg-[#e8f3ea] rounded-lg hover:bg-[#d9ebdd] transition-colors cursor-pointer" style={{ color: C }} href="/post/chiyu-forest-security">
                            시험성적서 보기
                        </a>
                    </tw.BtnWrap>
                    <p className="max-w-full text-[11px] font-normal tracking-tight text-gray-400 m:text-center break-keep">
                        폐쇄망 설치형 SaMD · KS X IEC 62443-4-2 · 2026.04 의료기기 변경 허가
                    </p>
                </tw.StartWrap>

                <tw.EndWrap>
                    <div className="flex w-full justify-center items-center my-auto mx-auto">
                        <img className="w-full max-w-[24rem] object-contain m:max-w-[15rem]" src="/assets/portfolio/medsec/cheeu-logo.png" alt="CHEEU. Forest N" />
                    </div>
                    <div className="w-full h-px m:hidden" style={{ background: C }} />
                </tw.EndWrap>
            </div>
        </div>
    );
}
