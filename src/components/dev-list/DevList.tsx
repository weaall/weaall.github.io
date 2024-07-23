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
    const [selectedPost, setSelectedPost] = useState<PostData | null>(null)

    return (
        <tw.Container>
            <tw.DrawerContainer>
                {props.map((item) => (
                    <tw.DrawerWrap href={item.postUrl} key={item.slug} onClick={() => setSelectedPost(item)}>
                        <tw.DrawerLabel>{item.title}</tw.DrawerLabel>
                    </tw.DrawerWrap>
                ))}
            </tw.DrawerContainer>
            <div></div>
        </tw.Container>
    )
}
