import MindsNaviBanner from "@/components/top-banner/portfolio/MindsNaviBanner";
import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";
import MindsNaviDevList from "./components/MindsNaviDevList";

export const metadata: Metadata = getBaseMetadata({
  title: "Minds. NAVI",
  description: "심리평가와 타액 호르몬 분석으로 스트레스 지수를 파악하는 우울증 진단 보조 의료기기, Minds. NAVI.",
  path: "/portfolio/mindsnavi",
});

export default function MindsnaviPage() {
  return (
    <div>
      <div className="max-w-[1080px] mx-auto m:px-4 pt-40 flex flex-col gap-12">
        <MindsNaviBanner />
      </div>
      <div className="w-full">
        <div className="max-w-[1080px] mx-auto m:px-4 pt-12 pb-20">
          <MindsNaviDevList />
        </div>
      </div>
    </div>
  );
}
