import PortfolioListBanner from "@/components/portfolio/PortfolioBanner";
import ProveLightBanner from "@/components/top-banner/portfolio/ProveLightBanner";

export default function ProveLightPage() {
  return (
    <div>
                <div className="max-w-[1080px] mx-auto pt-40 flex flex-col gap-12">
                    <ProveLightBanner />
                </div>
                <div className="w-full bg-[#f6f5f4]">
                    <div className="max-w-[1080px] mx-auto pt-12 pb-20">
                    <PortfolioListBanner />
                    </div>
                </div>
            </div>
  );
}