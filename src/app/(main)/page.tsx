import MainBanner from "@/components/banner/MainBanner"
import { PortfolioListBanner } from "@/features/portfolio/components";

export default function Home() {
    return (
        <div>
            <div className="max-w-[1080px] mx-auto m:px-4 pt-40 pb-20 flex flex-col gap-12">
                <MainBanner />
            </div>
            <div className="w-full bg-[#f6f5f4]">
                <div className="max-w-[1080px] mx-auto m:px-4 pt-12 pb-20">
                <PortfolioListBanner />
                </div>
            </div>
        </div>
    )
}
