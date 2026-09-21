import { roboto } from "@/utils/font";
import * as tw from "../MainBanner.styles";

const C = "#2f7d46";

export default function CheeuBanner() {
    return (
        <div className="w-full h-auto flex flex-col m:flex-col-reverse">
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
                    <p className="text-[1.3rem] leading-tight tracking-tighter font-medium text-[#191918] m:text-[1rem] m:leading-normal break-keep">
                        {"인터넷 없는 기관 노트북에 설치되는"}
                        <br />
                        <span style={{ color: C }}>VR 기반 우울·자살위험 심리치료 훈련</span>
                        {" 소프트웨어 의료기기"}
                        <br />
                        {"설치·업데이트·백업/복구·보안을 자체 구현해 "}
                        <span className="text-[#ec4e25]">의료기기 변경 허가</span>
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
                            사이버보안 시험성적서 보기
                        </a>
                    </tw.BtnWrap>
                </tw.StartWrap>

                <tw.EndWrap>
                    <div className="flex w-full justify-center items-center my-auto mx-auto">
                        <img className="h-28 object-contain m:h-20" src="/assets/portfolio/medsec/cheeu-logo.png" alt="CHEEU. Forest N" />
                    </div>
                    <div className="w-full h-[1px] m:hidden" style={{ background: C }} />
                </tw.EndWrap>
            </div>

            <div className="flex flex-col w-full mb-4 mt-24 m:mt-12">
                <p className="font-normal text-xs leading-4 mx-auto mb-4 tracking-[-0.0078125rem] text-gray-500 text-center break-keep">
                    폐쇄망 범용 PC 설치형 SaMD · 식약처 「의료기기의 사이버보안 허가·심사 가이드라인」 · KS X IEC 62443-4-2 · 2026.04 의료기기 중대한 변경 허가
                </p>
            </div>
        </div>
    );
}
