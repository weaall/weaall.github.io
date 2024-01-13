"use client"

import { useState } from "react"
import * as tw from "../../app/(pages)/shallow/Shallow.styles"

export default function Posts() {
    const [barState, setBarState] = useState({
        allState: true,
        reactState: false,
        webState: false,
        etcState: false,
    })

    const sideBarClick = (clickedLabel: string): void => {
        const newStates = {
            allState: false,
            reactState: false,
            webState: false,
            etcState: false,
            [`${clickedLabel.toLowerCase()}State`]: true,
        }
        setBarState(newStates)
    }

    const sideItems = [
        { label: "All", src: "all_icon", state: barState.allState },
        { label: "React", src: "react_icon", state: barState.reactState },
        { label: "Web", src: "web_icon", state: barState.webState },
        { label: "etc", src: "etc_icon", state: barState.etcState },
    ]

    const postItems = [
        { label: "React", title: "리액트에 관련된 설명", subTitle: "리액트에 관련된 설명하기가 참어렵죠?", tags: ["리액트", "리코일", "앨리스"] },
        { label: "React", title: "바보", subTitle: "멍충이", tags: ["위", "동", "현"] },
        { label: "React", title: "바보", subTitle: "멍충이", tags: ["위", "동", "현"] },
        { label: "Web", title: "바보", subTitle: "멍충이", tags: ["위", "동", "현"] },
        { label: "Web", title: "바보", subTitle: "멍충이", tags: ["위", "동", "현"] },
        { label: "etc", title: "바보", subTitle: "멍충이", tags: ["위", "동", "현"] },
    ]

    return (
        <tw.MainContainer>
            <tw.SideContainer>
                {sideItems.map((item, index) => (
                    <tw.SideWrap $state={item.state} key={index} onClick={() => sideBarClick(item.label)}>
                        <tw.SideSvg src={`../../../assets/svg/shallow/${item.src}.svg`}></tw.SideSvg>
                        <tw.SideLabel>{item.label}</tw.SideLabel>
                    </tw.SideWrap>
                ))}
            </tw.SideContainer>

            <tw.PostsContainer>
                {postItems
                    .filter((postItem) => barState.allState || postItem.label === "All" || postItem.label === sideItems.find((item) => item.state)?.label)
                    .map((item, index) => (
                        <tw.PostWrap key={index}>
                            <tw.PostLabel>/ {item.label}</tw.PostLabel>
                            <tw.Title>{item.title}</tw.Title>
                            <tw.SubTitle>{item.subTitle}</tw.SubTitle>
                            <tw.tagWrap>
                                {item.tags?.map((tag, index) => (
                                    <tw.tag key={index}>{tag}</tw.tag>
                                ))}
                            </tw.tagWrap>
                        </tw.PostWrap>
                    ))}
            </tw.PostsContainer>

        </tw.MainContainer>
    )
}