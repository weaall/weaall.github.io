import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"

import { Layout } from "@/components/layout/Layout"
import { getBaseMetadata } from "@/util/seo"

const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--Noto-Sans-KR",
})

export const metadata: Metadata = getBaseMetadata({ title: "Weaall's Dive" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="kr">
            <head>
                <meta name="naver-site-verification" content="e782934088f4524e1d46947402328d9864f04318" />
                <meta name="google-site-verification" content="EB5qLPhkvA7mD6Yz6VpiZaMErWP4KIB7Aj_rR-xqdsA" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={notoSansKr.className}>
                <Layout>{children}</Layout>
            </body>
        </html>
    )
}
