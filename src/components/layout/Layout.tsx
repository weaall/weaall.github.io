import Header from "../header/Header"
import * as tw from "./Layout.styles"

export function Layout(props: React.PropsWithChildren) {
    return (
        <tw.Container>
            <Header />
            {props.children}
        </tw.Container>
    )
}
