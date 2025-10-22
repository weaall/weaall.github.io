import MainBanner from "@/components/main-banner/MainBanner"
import MdxBanner from "@/components/mdx/mdx-banner/MdxBanner"
import PortfolioBanner from "@/components/portfolio/PortfolioBanner"

export default function Home() {
    return (
        <div className="max-w-[1200px] mx-auto pt-40 flex flex-col gap-12">
            <MainBanner />
            <PortfolioBanner />
            {/* <MdxBanner dir="Post" />
            <MdxBanner dir="Prac" /> */}
        </div>
    )
}
