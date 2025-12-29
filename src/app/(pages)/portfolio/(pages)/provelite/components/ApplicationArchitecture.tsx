"use client";

import React from "react";
import { roboto } from "@/util/font";

export default function ApplicationArchitecture() {
    return (
        <>
            <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem] pb-4">어플리케이션 아키텍쳐</h2>
            <div className="flex flex-col gap-6">
                <div className="w-full h-auto bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden group">
                    <div className="w-full h-1/2 flex flex-col px-8 py-8 pb-4">
                        <h3 className="text-lg font-bold mb-1 text-[#191918]">
                            <span className={roboto.className}>Next.js</span> 기반 SSR 아키텍처
                        </h3>
                    </div>
                    <div className="w-full pl-8">
                        <img
                            className="object-full w-full bg-[#ffffff] p-4 px-16 rounded-tl-xl border-2 border-[#ededeb] shadow-lg"
                            src="/assets/portfolio/prove-lite/app_arch_origin.png"
                            alt="application architecture"
                        />
                    </div>
                </div>

                <div className="w-full flex gap-6">
                    <div className="w-1/3 h-auto bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group p-8">
                        <div className="w-full h-full flex flex-col">
                            <p className="text-sm text-[#0075de]">
                                <span className={roboto.className}>Task 1.</span>
                            </p>
                            <h3 className="text-lg font-bold text-[#191918] leading-tight">FE/BE 통합</h3>
                            <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 mt-2">
                                <li>모노레포 도입</li>
                                <li>배포 파이프라인 단일화</li>
                                <li>코드 공유 및 재사용성 증대</li>
                            </ul>
                            <a className="text-[#0075de] text-end mt-auto group-hover:font-bold transition-all">개선 과정 알아보기 →</a>
                        </div>
                    </div>
                    <div className="w-1/3 h-auto bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group p-8">
                        <div className="w-full h-full flex flex-col">
                            <p className="text-sm text-[#0075de]">
                                <span className={roboto.className}>Task 2.</span>
                            </p>
                            <h3 className="text-lg font-bold text-[#191918] leading-tight">평가, 결과 알림을 위한 Cron 도입</h3>
                            <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 mt-2">
                                <li>고객사 요구사항 반영</li>
                                <li>평가 미완료자 리마인드 알림톡</li>
                                <li>평가 결과 일괄 발송</li>
                            </ul>
                            <a className="text-[#0075de] text-end mt-auto group-hover:font-bold transition-all">개선 과정 알아보기 →</a>
                        </div>
                    </div>
                    <div className="w-1/3 h-auto bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group p-8">
                        <div className="w-full h-full flex flex-col">
                            <p className="text-sm text-[#0075de]">
                                <span className={roboto.className}>Task 3.</span>
                            </p>
                            <h3 className="text-lg font-bold text-[#191918] leading-tight">Puppeteer 구조 개선</h3>
                            <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 mt-2">
                                <li>가상 브라우저 리소스 관리</li>
                                <li>인스턴스 리소스 사용량 개선</li>
                            </ul>
                            <a className="text-[#0075de] text-end mt-auto group-hover:font-bold transition-all">개선 과정 알아보기 →</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}