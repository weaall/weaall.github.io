/**
 * out/ 을 gh-pages 브랜치로 배포한다.
 *
 * 기존에는 gh-pages 패키지를 썼는데, 이 패키지는 삭제 대상 파일 경로를 전부
 * `git rm` 인자로 넘긴다. 정적 export 파일이 800개를 넘기면서 윈도우 명령줄
 * 길이 한도(약 32KB)를 초과해 ENAMETOOLONG 으로 실패했다.
 *
 * 여기서는 임시 worktree 를 만들어 `git rm -r -- .` 한 번으로 비우고,
 * out/ 을 통째로 복사한 뒤 커밋·푸시한다. 파일이 몇 개든 인자 길이가 일정하다.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BRANCH = "gh-pages";
const REMOTE = "origin";
const DIST = "out";

const run = (args, opts = {}) => execFileSync("git", args, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
const log = (msg) => console.log(`[deploy] ${msg}`);

const dist = path.resolve(process.cwd(), DIST);
if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error(`[deploy] ${DIST}/index.html 이 없다. 먼저 빌드해야 한다.`);
    process.exit(1);
}

// GitHub Pages 가 _next 같은 언더스코어 경로를 지우지 않도록 한다.
fs.writeFileSync(path.join(dist, ".nojekyll"), "");

const worktree = fs.mkdtempSync(path.join(os.tmpdir(), "ghpages-"));
let added = false;

try {
    log(`${REMOTE}/${BRANCH} 가져오는 중`);
    run(["fetch", REMOTE, BRANCH]);

    run(["worktree", "add", "--detach", worktree, `${REMOTE}/${BRANCH}`]);
    added = true;

    log("이전 산출물 정리");
    run(["-C", worktree, "rm", "-r", "-f", "-q", "--ignore-unmatch", "--", "."]);

    log(`${DIST}/ 복사`);
    fs.cpSync(dist, worktree, { recursive: true });

    run(["-C", worktree, "add", "-A"]);

    if (!run(["-C", worktree, "status", "--porcelain"])) {
        log("변경 없음. 배포를 건너뛴다.");
    } else {
        run(["-C", worktree, "commit", "-m", "Updates"]);
        log(`${REMOTE}/${BRANCH} 로 푸시`);
        run(["-C", worktree, "push", REMOTE, `HEAD:${BRANCH}`]);
        log("배포 완료");
    }
} catch (err) {
    const detail = [err.stdout, err.stderr].filter(Boolean).join("\n").trim();
    console.error(`[deploy] 실패: ${detail || err.message}`);
    process.exitCode = 1;
} finally {
    if (added) {
        try {
            run(["worktree", "remove", "--force", worktree]);
        } catch {
            /* worktree 정리는 실패해도 배포 결과에 영향을 주지 않는다 */
        }
    }
    fs.rmSync(worktree, { recursive: true, force: true });
    try {
        run(["worktree", "prune"]);
    } catch {
        /* 무시 */
    }
}
