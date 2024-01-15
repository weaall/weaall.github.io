import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"
import { Layout } from "@/components/layout/Layout"

const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--Noto-Sans-KR",
})

export const metadata: Metadata = {
    title: "Weaall's Dive",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="kr">
            <body className={notoSansKr.className}>
                <Layout>{children}</Layout>
            </body>
        </html>
    )
}
