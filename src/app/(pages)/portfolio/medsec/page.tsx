import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";
import { MedSecBanner } from "@/features/portfolio/banners/MedSecBanner";
import { MedSecSections } from "@/features/portfolio/sections/medsec/MedSecSections";

export const metadata: Metadata = getBaseMetadata({
    title: "의료기기 사이버보안 및 인프라",
    description: "임상시험 허가·품목 인허가·디지털의료기기 GMP를 위한 사이버보안 시험성적서 작성과 인프라 설계·운영.",
    path: "/portfolio/medsec",
});

export default function MedSecPortfolioPage() {
    return (
        <div className="mx-auto max-w-[1080px] px-6 pt-40 pb-24 m:px-4 m:pt-28">
            <MedSecBanner />
            <MedSecSections />
        </div>
    );
}
