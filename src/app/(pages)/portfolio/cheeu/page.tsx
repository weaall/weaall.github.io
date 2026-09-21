import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";
import { CheeuBanner } from "@/features/portfolio/banners";
import { CheeuSections } from "@/features/portfolio/sections/cheeu/CheeuSections";

export const metadata: Metadata = getBaseMetadata({
    title: "CHEEU. Forest N",
    description: "폐쇄망 노트북에 설치되는 VR 기반 정신건강 훈련 소프트웨어 의료기기. 설치 관리자·오프라인 업데이트·백업/복구·사이버보안을 자체 구현해 의료기기 변경 허가를 받은 치유포레스트.",
    path: "/portfolio/cheeu",
});

export default function CheeuPage() {
    return (
        <div>
            <div className="max-w-[1080px] mx-auto m:px-4 pt-40 flex flex-col gap-12">
                <CheeuBanner />
            </div>
            <div className="w-full">
                <div className="max-w-[1080px] mx-auto m:px-4 pt-12 pb-20">
                    <CheeuSections />
                </div>
            </div>
        </div>
    );
}
