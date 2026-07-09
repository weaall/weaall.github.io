import { Block } from "../components/helper/BlocksToMdx";
import { FormattedRange } from "../components/text-modal/TextFormat.modal";

// newpage 에디터 문서를 브라우저 localStorage에 저장/관리한다.
// 내보내기(MDX) 대신 작성 중 자동 저장 + 좌측 드로어에서 불러와 편집하는 용도.

const KEY = "newpage:docs";

export interface LocalDoc {
    id: string;
    title: string;
    updatedAt: number;
    blocks: Block[];
    blockColors: { [id: string]: string };
    blockFormattedRanges: { [id: string]: FormattedRange[] };
}

export type LocalDocMeta = Pick<LocalDoc, "id" | "title" | "updatedAt">;

function readAll(): Record<string, LocalDoc> {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
        return {};
    }
}

function writeAll(docs: Record<string, LocalDoc>) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(docs));
}

// 최근 수정순 메타 목록
export function listDocs(): LocalDocMeta[] {
    return Object.values(readAll())
        .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getDoc(id: string): LocalDoc | null {
    return readAll()[id] ?? null;
}

export function saveDoc(doc: LocalDoc) {
    const all = readAll();
    all[doc.id] = doc;
    writeAll(all);
}

export function deleteDoc(id: string) {
    const all = readAll();
    delete all[id];
    writeAll(all);
}
