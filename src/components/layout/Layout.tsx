import Header from "../header/Header";
import * as tw from "./Layout.styles";

export function Layout(props: React.PropsWithChildren) {
    return (
        <tw.Container>
            <Header />
            <tw.ContentsWrap>
                {props.children}
            </tw.ContentsWrap>
        </tw.Container>
    );
}
