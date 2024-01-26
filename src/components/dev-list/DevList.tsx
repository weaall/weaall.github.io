"use client"

import { useState } from "react"
import * as tw from "./DevList.styles"

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

export default function DevList({ props }: PostsProps) {
    const [barState, setBarState] = useState({
        allState: true,
        socialState: false,
        webState: false,
        etcState: false,
    })

    const sideBarClick = (clickedLabel: string): void => {
        const newStates = {
            allState: false,
            socialState: false,
            webState: false,
            etcState: false,
            [`${clickedLabel.toLowerCase()}State`]: true,
        }
        setBarState(newStates)
    }

    const sideItems = [
        { label: "All", src: "all_icon", state: barState.allState },
        { label: "Social", src: "react_icon", state: barState.socialState },
        { label: "Web", src: "web_icon", state: barState.webState },
        { label: "etc", src: "etc_icon", state: barState.etcState },
    ]

    return (
        <tw.Container>
            <tw.UpperContainer>
                {sideItems.map((item, index) => (
                    <tw.UpperWrap $state={item.state} key={index} onClick={() => sideBarClick(item.label)}>
                        <tw.UpperSvg src={`../../../assets/svg/${item.src}.svg`}></tw.UpperSvg>
                        <tw.UpperLabel>{item.label}</tw.UpperLabel>
                    </tw.UpperWrap>
                ))}
            </tw.UpperContainer>

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
