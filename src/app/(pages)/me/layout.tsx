import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "소개",
    description: "weaall 소개.",
    path: "/me",
});

export default function MeLayout({ children }: { children: React.ReactNode }) {
    return children;
}
