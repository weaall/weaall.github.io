import { Block } from "../components/helper/BlocksToMdx";
import { FormattedRange } from "../components/text-modal/TextFormat.modal";

// newpage 에디터 문서를 브라우저 localStorage에 저장/관리한다.
// 내보내기(MDX) 대신 작성 중 자동 저장 + 좌측 드로어에서 불러와 편집하는 용도.

const KEY = "newpage:docs";
const ACTIVE_KEY = "newpage:active";
const CHANGE_EVENT = "localdocs:changed";

// 문서 목록/활성 문서가 바뀌면 알림 (드로어·레이아웃이 페이지 경계를 넘어 동기화)
export function notifyDocsChanged() {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeDocsChanged(cb: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(CHANGE_EVENT, cb);
    window.addEventListener("storage", cb); // 다른 탭 변경도 반영
    return () => {
        window.removeEventListener(CHANGE_EVENT, cb);
        window.removeEventListener("storage", cb);
    };
}

// 현재 편집 대상 문서 포인터 (드로어에서 선택 → /newpage가 이 값을 읽어 연다)
export function getActivePointer(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_KEY);
}

export function setActivePointer(id: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_KEY, id);
    notifyDocsChanged();
}

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
    notifyDocsChanged();
}

export function deleteDoc(id: string) {
    const all = readAll();
    delete all[id];
    writeAll(all);
    notifyDocsChanged();
}
