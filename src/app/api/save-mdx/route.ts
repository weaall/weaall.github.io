import { NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

/**
 * 로컬 오써링 전용 저장 엔드포인트.
 * newpage 에디터의 "내보내기"가 이 라우트로 MDX를 POST하면 posts/post/ 폴더에 파일을 쓴다.
 * `next dev`에서만 동작하며, 정적 export(프로덕션 빌드)에서는 제외된다(하단 config 참고).
 */
export async function POST(request: Request) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "이 기능은 개발 모드(next dev)에서만 사용할 수 있습니다." }, { status: 403 });
    }

    let body: { filename?: unknown; content?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
    }

    const rawName = typeof body.filename === "string" ? body.filename : "";
    const content = typeof body.content === "string" ? body.content : "";

    if (!content) {
        return NextResponse.json({ error: "내용이 비어 있습니다." }, { status: 400 });
    }

    // 경로 이스케이프 방지: basename만 취하고 안전한 문자로 정규화
    const base = path.basename(rawName || "untitled");
    let safe = base.replace(/[^a-zA-Z0-9._가-힣-]/g, "_");
    if (!safe.toLowerCase().endsWith(".mdx")) safe += ".mdx";

    const dir = path.join(process.cwd(), "posts", "post");
    const filePath = path.join(dir, safe);

    try {
        await mkdir(dir, { recursive: true });

        // 덮어쓰기 방지: 이미 있으면 -1, -2 … 접미사
        let finalPath = filePath;
        let finalName = safe;
        for (let i = 1; ; i++) {
            try {
                await access(finalPath);
                finalName = safe.replace(/\.mdx$/i, `-${i}.mdx`);
                finalPath = path.join(dir, finalName);
            } catch {
                break;
            }
        }

        await writeFile(finalPath, content, "utf8");
        return NextResponse.json({ ok: true, path: `posts/post/${finalName}` });
    } catch (err) {
        return NextResponse.json({ error: `파일 저장 실패: ${(err as Error).message}` }, { status: 500 });
    }
}
