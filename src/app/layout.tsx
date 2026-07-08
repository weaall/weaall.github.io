import type { Metadata } from "next"
import { Inter, Noto_Sans_KR } from "next/font/google"
import "./globals.css"

import { Layout } from "@/components/layout/Layout"
import { getBaseMetadata } from "@/util/seo"

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-inter",
    display: "swap",
});
const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-noto-sans-kr",
    display: "swap",
});

export const metadata: Metadata = getBaseMetadata({ title: "WeHub" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <meta name="naver-site-verification" content="e782934088f4524e1d46947402328d9864f04318" />
                <meta name="google-site-verification" content="EB5qLPhkvA7mD6Yz6VpiZaMErWP4KIB7Aj_rR-xqdsA" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/styles/atom-one-dark.css" />
            </head>
            <body className={`${inter.variable} ${notoSansKr.variable}`}>
                <Layout>{children}</Layout>
            </body>
        </html>
    )
}
