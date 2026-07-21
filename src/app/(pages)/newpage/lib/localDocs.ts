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
    icon?: string; // 이모지 문자열 또는 커스텀 webp data URL
    label?: string; // 카테고리
    subTitle?: string; // 부제목
    tags?: string[];
    imageUrl?: string; // 커버 사진(webp data URL)
    sourceSlug?: string; // 기존 게시물 수정 중이면 원본 파일 슬러그(저장 시 덮어쓰기)
    updatedAt: number;
    blocks: Block[];
    blockColors: { [id: string]: string };
    blockFormattedRanges: { [id: string]: FormattedRange[] };
}

export type LocalDocMeta = Pick<LocalDoc, "id" | "title" | "icon" | "label" | "updatedAt">;

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
        .map(({ id, title, icon, label, updatedAt }) => ({ id, title, icon, label, updatedAt }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
}

// 기존 문서들의 카테고리(label) 고유 목록 — 카테고리 선택 제안용
export function listCategories(): string[] {
    const set = new Set<string>();
    Object.values(readAll()).forEach((d) => {
        if (d.label && d.label.trim()) set.add(d.label.trim());
    });
    return Array.from(set).sort();
}

export function getDoc(id: string): LocalDoc | null {
    return readAll()[id] ?? null;
}

// 삭제된 문서 id (세션 내). 삭제 직후 언마운트되는 에디터의 자동저장이
// 같은 id로 문서를 되살리는 것을 막는다. id는 UUID라 재사용되지 않는다.
const tombstones = new Set<string>();

// updatedAt을 제외한 실제 내용이 동일한지 비교 (열기만 했는데 재정렬되는 것 방지)
function sameContent(a: LocalDoc, b: LocalDoc): boolean {
    return (
        a.title === b.title &&
        a.icon === b.icon &&
        a.label === b.label &&
        a.subTitle === b.subTitle &&
        a.imageUrl === b.imageUrl &&
        a.sourceSlug === b.sourceSlug &&
        JSON.stringify(a.tags ?? []) === JSON.stringify(b.tags ?? []) &&
        JSON.stringify(a.blocks) === JSON.stringify(b.blocks) &&
        JSON.stringify(a.blockColors) === JSON.stringify(b.blockColors) &&
        JSON.stringify(a.blockFormattedRanges) === JSON.stringify(b.blockFormattedRanges)
    );
}

export function saveDoc(doc: LocalDoc) {
    if (tombstones.has(doc.id)) return; // 삭제된 문서는 되살리지 않음
    const all = readAll();
    // 내용 변화가 없으면 updatedAt 갱신/재정렬을 하지 않는다 (단순 열람 시 순서 유지)
    if (all[doc.id] && sameContent(all[doc.id], doc)) return;
    all[doc.id] = doc;
    writeAll(all);
    notifyDocsChanged();
}

export function deleteDoc(id: string) {
    tombstones.add(id);
    const all = readAll();
    delete all[id];
    writeAll(all);
    notifyDocsChanged();
}
