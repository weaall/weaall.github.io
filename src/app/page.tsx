import MainBanner from "@/components/main-banner/MainBanner"
import MdxBanner from "@/components/mdx/mdx-banner/MdxBanner"

export default function Home() {
    return (
        <>
            <MainBanner />
            <MdxBanner dir="Shallow" />
            <MdxBanner dir="Deep" />
        </>
    )
}
