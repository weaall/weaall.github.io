import ProveLiteBanner from "@/components/top-banner/portfolio/ProveLiteBanner";
import ProveLiteDevList from "./components/ProveLiteDevList";
import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
  title: "PROVE Lite",
  description: "자가 설문 평가로 우울증상과 스트레스 상태를 알아보는 정신건강 분석평가 프로그램, PROVE Lite.",
  path: "/portfolio/provelite",
})

export default function ProveLitePage() {
  return (
    <div>
      <div className="max-w-[1080px] mx-auto m:px-4 pt-40 flex flex-col gap-12">
        <ProveLiteBanner />
      </div>
      <div className="w-full">
        <div className="max-w-[1080px] mx-auto m:px-4 pt-12 pb-20">
          <ProveLiteDevList />
        </div>
      </div>
    </div>
  );
}