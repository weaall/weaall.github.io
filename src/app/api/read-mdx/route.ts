import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// 로컬 오써링 전용: 기존 posts/post/{slug}.mdx 원문을 반환한다(수정 기능용).
// next dev에서만 동작(프로덕션 static export엔 포함되지 않음). POST로 받아 export 빌드도 통과.
export async function POST(request: Request) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "개발 모드에서만 사용할 수 있습니다." }, { status: 403 });
    }
    let body: { slug?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
    }
    const slug = (typeof body.slug === "string" ? body.slug : "").replace(/[^a-zA-Z0-9._가-힣-]/g, "");
    if (!slug) return NextResponse.json({ error: "slug 누락" }, { status: 400 });
    try {
        const filePath = path.join(process.cwd(), "posts", "post", `${slug}.mdx`);
        const content = await readFile(filePath, "utf8");
        return NextResponse.json({ content });
    } catch {
        return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    }
}
