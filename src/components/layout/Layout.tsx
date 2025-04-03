import Footer from "../footer/Footer";
import Header from "../header/Header";
import * as tw from "./Layout.styles";

export function Layout(props: React.PropsWithChildren) {
    return (
        <tw.Container>
            <tw.ContentsWrap>
                <Header />
                {props.children}
                <Footer />
            </tw.ContentsWrap>
        </tw.Container>
    );
}
