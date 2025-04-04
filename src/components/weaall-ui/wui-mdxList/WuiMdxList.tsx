"use client";

import { useState } from "react";
import { roboto } from "@/util/font";
import * as tw from "./WuiMdxList.styles";

interface PostsProps {
    props: PostData[];
}

interface PostData {
    label: string;
    title: string;
    date: string;
    slug: string;
    postUrl: string;
}

export default function WuiMdxList({ props }: PostsProps) {
    const [openLabels, setOpenLabels] = useState<{ [key: string]: boolean }>({});

    const groupedPosts = props.reduce((acc, post) => {
        if (!acc[post.label]) acc[post.label] = [];
        acc[post.label].push(post);
        return acc;
    }, {} as Record<string, PostData[]>);

    const toggleLabel = (label: string) => {
        setOpenLabels((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <tw.Container className={roboto.className}>
            <tw.DrawerContainer style={{ height: "calc(100% - 65px)" }}>
                {Object.entries(groupedPosts).map(([label, items]) => (
                    <div key={label}>
                        <tw.DrawerBtn onClick={() => toggleLabel(label)}>{label}</tw.DrawerBtn>

                        {openLabels[label] &&
                            items.map((item) => (
                                <tw.DrawerWrap href={item.postUrl} key={item.slug} className="pl-8">
                                    <tw.DrawerLabel>{item.title}</tw.DrawerLabel>
                                </tw.DrawerWrap>
                            ))}
                    </div>
                ))}
            </tw.DrawerContainer>
        </tw.Container>
    );
}
