import Header from "../header/Header"
import * as tw from "./Layout.styles"
import { Noto_Sans_KR } from "next/font/google"

const notoSansKr = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--Noto-Sans-KR",
})

export function Layout(props: React.PropsWithChildren) {
    return (
        <tw.Container className={notoSansKr.className}>
            <Header />
            {props.children}
        </tw.Container>
    )
}
