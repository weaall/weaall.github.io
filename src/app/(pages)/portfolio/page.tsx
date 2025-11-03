import PortfolioListBanner from "@/components/portfolio/PortfolioBanner";
import PortfolioBanner from "@/components/top-banner/PortfolioBanner";

export default function PortfolioPage() {
  return (
    <div>
                <div className="max-w-[1080px] mx-auto pt-40 pb-20 flex flex-col gap-12">
                    <PortfolioBanner />
                </div>
                <div className="w-full bg-[#f6f5f4]">
                    <div className="max-w-[1080px] mx-auto pt-12 pb-20">
                    <PortfolioListBanner />
                    </div>
                </div>
            </div>
  );
}