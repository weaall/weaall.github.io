import MainBanner from "@/components/main-banner/MainBanner"
import MdxBanner from "@/components/mdx/mdx-banner/MdxBanner"
import PortfolioBanner from "@/components/portfolio/PortfolioBanner"

export default function Home() {
    return (
        <div>
            <div className="max-w-[1080px] mx-auto pt-40 pb-20 flex flex-col gap-12">
                <MainBanner />
            </div>
            <div className="w-full bg-[#f6f5f4]">
                <div className="max-w-[1080px] mx-auto pt-12 pb-20">
                <PortfolioBanner />
                </div>
            </div>
            {/* <MdxBanner dir="Post" />
            <MdxBanner dir="Prac" /> */}
        </div>
    )
}
