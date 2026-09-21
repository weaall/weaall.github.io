import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";
import MnaiBanner from "@/components/top-banner/portfolio/MnaiBanner";
import MnaiDevList from "./components/MnaiDevList";

export const metadata: Metadata = getBaseMetadata({
    title: "Minds. NAVI AI",
    description: "심리 설문과 타액 코르티솔 데이터를 AI 모델이 판정하고 SHAP 기여도로 설명하는 클라우드형 소프트웨어 의료기기. 네이버 클라우드 Kubernetes · GitOps · WAF · IDS · 관측성으로 사이버보안 요구사항을 설계로 충족.",
    path: "/portfolio/mnai",
});

export default function MnaiPage() {
    return (
        <div>
            <div className="max-w-[1080px] mx-auto m:px-4 pt-40 flex flex-col gap-12">
                <MnaiBanner />
            </div>
            <div className="w-full">
                <div className="max-w-[1080px] mx-auto m:px-4 pt-12 pb-20">
                    <MnaiDevList />
                </div>
            </div>
        </div>
    );
}
