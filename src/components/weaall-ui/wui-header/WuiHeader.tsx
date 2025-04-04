"use client";

import { usePathname } from "next/navigation";
import { roboto } from "@/util/font";

import * as tw from "./WuiHeader.styles";

export default function WuiHeader() {
    const pathname = usePathname();

    if (!pathname.startsWith("/weaall-ui")) return null;

    return (
        <tw.Container>
            <tw.FixedContainer>
                <tw.LeftWrap>
                    <tw.NavBtn className="w-10 h-10" href="/" target="_blank" rel="noopener noreferrer">
                        <tw.NavImg alt="" src={"../../assets/weaall-ui.png"} />
                    </tw.NavBtn>
                    <tw.Label className={roboto.className}>Weaall-UI</tw.Label>
                </tw.LeftWrap>

                <tw.RigntWrap>
                    <tw.SearchBtn>
                        <tw.SearchSvg alt="" src={"../../assets/svg/search_icon.svg"} />
                    </tw.SearchBtn>
                    <tw.NavBtn className="w-9 h-9" href="https://github.com/weaall/weaall-ui" target="_blank" rel="noopener noreferrer">
                        <tw.NavImg alt="" src={"../../assets/footer/github.png"} />
                    </tw.NavBtn>
                </tw.RigntWrap>
            </tw.FixedContainer>
        </tw.Container>
    );
}
