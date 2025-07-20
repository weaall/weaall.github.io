import { roboto } from "@/util/font";

import * as tw from "./MainBanner.styles";

export default function MainBanner() {
    return (
        <tw.Container>
            <tw.StartWrap>
                <tw.Title className="hidden m:block">{"나만을 위한 AI 워크스페이스"}</tw.Title>
                <tw.Title className="block m:hidden">
                    {"나만을 위한 AI"}
                    <br />
                    {"워크스페이스"}
                </tw.Title>
                <tw.SubTitle>
                    {"팀이 모든 답을 찾고, 반복 업무를 자동화하"}
                    <br />
                    {"며, 프로젝트를 완료할 수 있는 하나의 공간."}
                </tw.SubTitle>
                <tw.BtnWrap>
                    <tw.SubBtn>Weaall Hub 이용하기</tw.SubBtn>
                    <tw.ReqBtn>개인화 요청하기</tw.ReqBtn>
                </tw.BtnWrap>
            </tw.StartWrap>

            <tw.EndWrap>
                <tw.ImgContainer>
                    <tw.ImgWrap>
                        <tw.Img src="/assets/main-banner/happy1.svg" alt="" />
                    </tw.ImgWrap>
                    <tw.ImgWrap>
                        <tw.Img src="/assets/main-banner/happy2.svg" alt="" />
                    </tw.ImgWrap>
                    <tw.ImgWrap>
                        <tw.Img src="/assets/main-banner/happy3.svg" alt="" />
                    </tw.ImgWrap>
                </tw.ImgContainer>
                <tw.BottomLabel />
            </tw.EndWrap>
        </tw.Container>
    );
}
