import { Metadata } from "next";
import PortfolioListBanner from "@/components/portfolio/PortfolioListBanner";
import PortfolioBanner from "@/components/top-banner/PortfolioBanner";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "포트폴리오",
    description: "WeHub가 만든 프로젝트 포트폴리오.",
    path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <div>
                <div className="max-w-[1080px] mx-auto m:px-4 pt-40 pb-20 flex flex-col gap-12">
                    <PortfolioBanner />
                </div>
                <div className="w-full bg-[#f6f5f4]">
                    <div className="max-w-[1080px] mx-auto m:px-4 pt-12 pb-20">
                    <PortfolioListBanner />
                    </div>
                </div>
            </div>
  );
}