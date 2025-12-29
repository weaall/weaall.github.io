"use client";

import { roboto } from "@/util/font";
import React from "react";

export default function ServiceFlow() {
    return (
        <>
            <h2 className="text-[2.625rem] text-[#191918] text-left font-bold tracking-[-0.09375rem] pb-4">서비스 플로우</h2>
            <div className="flex gap-6">
                <div className="w-3/4 h-auto bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden group">
                    <div className="w-full h-1/2 flex flex-col p-8 pb-4">
                        <h3 className="text-lg font-bold mb-1 text-[#191918]">설문 제공 및 결과 생성 / 발송 자동화</h3>
                    </div>
                    <div className="px-8 w-full">
                        <img
                            className="object-full w-full rounded-t-xl bg-[#ffffff] shadow-lg p-3 border-2 border-[#ededeb]"
                            src="/assets/portfolio/prove-lite/service_flow_origin.png"
                            alt="aws architecture"
                        />
                    </div>
                </div>

                <div className="w-1/4 gap-6 flex flex-col">
                    <div className="h-full bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group">
                        <div className="w-full h-full flex flex-col p-8">
                            <h3 className="text-lg font-bold mb-2 text-[#191918] leading-tight">비용 최적화를 위한 서버리스 아키텍처로의 전환</h3>
                            <ul className="text-[#191918] text-base list-disc pl-5 space-y-1">
                                <li>비용 최적화</li>
                                <li>효율적 트래픽 관리</li>
                                <li>인프라 관리 부담 감소</li>
                                <li>빠른 개발 속도</li>
                            </ul>
                                                        <h3 className="text-lg font-bold mb-2 text-[#191918] leading-tight">비용 최적화를 위한 서버리스 아키텍처로의 전환</h3>
                            <ul className="text-[#191918] text-base list-disc pl-5 space-y-1">
                                <li>비용 최적화</li>
                                <li>효율적 트래픽 관리</li>
                                <li>인프라 관리 부담 감소</li>
                                <li>빠른 개발 속도</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
