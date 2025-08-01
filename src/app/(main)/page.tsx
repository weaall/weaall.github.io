import MainBanner from "@/components/main-banner/MainBanner"
import MdxBanner from "@/components/mdx/mdx-banner/MdxBanner"

export default function Home() {
    return (
        <div className="max-w-[1200px] mx-auto">
            <MainBanner />
            <MdxBanner dir="Post" />
            <MdxBanner dir="Prac" />
        </div>
    )
}
