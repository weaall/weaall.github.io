"use client";

import { roboto } from "@/util/font";
import React from "react";

export default function SystemArchitecture() {
    return (
        <>
            <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem] pb-4">시스템 아키텍쳐</h2>
            <div className="flex gap-6">
                <div className="w-3/4 h-auto bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden group">
                    <div className="w-full h-1/2 flex flex-col p-8 pb-6">
                        <h3 className="text-lg font-bold mb-1 text-[#191918]">
                            <span className={roboto.className}>AWS</span> 서버리스 아키텍처
                        </h3>
                        <p className="text-[#191918] text-base">AWS 서버리스 기반, 트래픽에 맞춰 비용이 최적화된 시스템</p>
                    </div>
                    <div className="px-8 w-full">
                        <img
                            className="object-full w-full rounded-t-xl bg-[#ffffff] shadow-lg py-10 px-10"
                            src="/assets/portfolio/prove-lite/aws_arch_origin.png"
                            alt="aws architecture"
                        />
                    </div>
                </div>
                <div className="w-1/4 gap-6 flex flex-col">
                    <div className="h-1/2 bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <p className="text-sm text-[#0075de]">
                                <span className={roboto.className}>Task 1.</span>
                            </p>
                            <h3 className="text-lg font-bold mb-1 text-[#191918]">비용 최적화를 위한 서버리스 아키텍처 전환</h3>
                            <ul className="text-[#191918] text-base list-disc pl-5 space-y-1">
                                <li>비용 최적화</li>
                                <li>효율적 트래픽 관리</li>
                                <li>인프라 관리 부담 감소</li>
                                <li>빠른 개발 속도</li>
                            </ul>
                            <a className="text-[#0075de] text-end mt-4 group-hover:font-bold transition-all">과정 자세히 알아보기 →</a>
                        </div>
                    </div>
                    <div className="h-1/2 bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group">
                        <div className="w-full h-1/2 flex flex-col p-8">
                            <p className="text-sm text-[#0075de]">
                                <span className={roboto.className}>Task 2.</span>
                            </p>
                            <h3 className="text-lg font-bold mb-1 text-[#191918]">클라우드 포메이션을 통한 CI/CD 자동화 작업</h3>
                            <p className="text-[#191918] text-base">서버리스 아키텍처 설계부터 구축, 그리고 비용 절감 효과까지의 전체 과정을 확인해 보세요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
