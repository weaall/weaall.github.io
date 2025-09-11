export interface Block {
    id: string;
    type: string;
    content: string;
}

export function blocksToMDX(
    blocks: Block[],
    meta?: {
        label?: string;
        title?: string;
        subTitle?: string;
        date?: string;
        mins?: number;
        tags?: string[];
        imageUrl?: string;
    },
) {
    let frontmatter = "";
    if (meta) {
        frontmatter = `---\n`;
        if (meta.label) frontmatter += `label: ${meta.label}\n`;
        if (meta.title) frontmatter += `title: ${meta.title}\n`;
        if (meta.subTitle) frontmatter += `subTitle: ${meta.subTitle}\n`;
        if (meta.date) frontmatter += `date: ${meta.date}\n`;
        if (meta.mins) frontmatter += `mins: ${meta.mins}\n`;
        if (meta.tags) frontmatter += `tags: [${meta.tags.join(", ")}]\n`;
        if (meta.imageUrl) frontmatter += `imageUrl: ${meta.imageUrl}\n`;
        frontmatter += `---\n\n`;
    }

    let numberedListCounter = 1;

    const body = blocks
        .filter((b) => b.content.trim() !== "" || b.type === "divider")
        .map((b, index) => {
            switch (b.type) {
                case "h1":
                    numberedListCounter = 1;
                    return `# ${b.content}`;
                case "h2":
                    numberedListCounter = 1;
                    return `## ${b.content}`;
                case "h3":
                    numberedListCounter = 1;
                    return `### ${b.content}`;
                case "p":
                    numberedListCounter = 1;
                    return b.content;
                case "ul":
                    numberedListCounter = 1;
                    return `- ${b.content}`;
                case "numberedList":
                    const prevBlock = blocks.filter((block) => block.content.trim() !== "" || block.type === "divider")[index - 1];
                    if (!prevBlock || prevBlock.type !== "numberedList") {
                        numberedListCounter = 1;
                    }
                    const currentNumber = numberedListCounter++;
                    return `${currentNumber}. ${b.content}`;
                case "checkedList":
                    numberedListCounter = 1;
                    return `- [ ] ${b.content}`;
                case "divider":
                    numberedListCounter = 1;
                    return "---";
                default:
                    numberedListCounter = 1;
                    return b.content;
            }
        })
        .join("\n\n");
    return frontmatter + body;
}
