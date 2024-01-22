"use client"

import { useState } from "react"
import * as tw from "./PostList.styles"

interface PostData {
    label: string
    title: string
    subTitle: string
    date: string
    tags: []
    slug: string
    postUrl: string
}

interface PostsProps {
    props: PostData[]
}

export default function ShallowPostList({ props }: PostsProps) {
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

    return (
        <tw.Container>
            <tw.SideContainer>
                {sideItems.map((item, index) => (
                    <tw.SideWrap $state={item.state} key={index} onClick={() => sideBarClick(item.label)}>
                        <tw.SideSvg src={`../../../assets/svg/${item.src}.svg`}></tw.SideSvg>
                        <tw.SideLabel>{item.label}</tw.SideLabel>
                    </tw.SideWrap>
                ))}
            </tw.SideContainer>

            <tw.PostsContainer>
                {props
                    .filter((postItem) => barState.allState || postItem.label === "All" || postItem.label === sideItems.find((item) => item.state)?.label)
                    .map((item) => (
                        <tw.PostWrap href={item.postUrl} key={item.slug}>
                            <tw.TopWrap>
                                <tw.TopLabel>/ {item.label}</tw.TopLabel>
                                <tw.TopLabel>{item.date}</tw.TopLabel>
                            </tw.TopWrap>
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
        </tw.Container>
    )
}
