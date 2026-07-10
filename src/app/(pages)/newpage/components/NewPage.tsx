// NewPage.tsx (완전 버전)
import React, { useState, useRef, useEffect } from "react";

import TypeMenuModal from "./menu-modal/TypeMenu.modal";
import { ELEMENTS } from "./menu-modal/TypeElement";
import { Block, blocksToMDX } from "./helper/BlocksToMdx";
import { FormattedRange } from "./text-modal/TextFormat.modal";
import BlockRow from "./BlockRow";
import ShareModal from "./ShareModal";
import ChartModal from "./chart-modal/ChartModal";
import { ChartRow } from "@/components/mdx/mdx-components/BarChart";
import { useBlockHistory } from "../hooks/useBlockHistory";
import { useBlockDnD } from "../hooks/useBlockDnD";
import { getDoc, saveDoc, listCategories } from "../lib/localDocs";
import { slugifyTitle } from "../lib/exportMdx";
import CategoryPicker from "./category-picker/CategoryPicker";
import { parseImageContent, serializeImageContent } from "../lib/imageContent";
import { PageIcon, fileToWebp } from "../lib/pageIcon";
import IconPicker from "./icon-picker/IconPicker";

import { formatPostDate } from "@/util/date";
import * as tw from "./Newpage.styles";

// 이미지 파일 드래그 중, 삽입될 위치에 뜨는 자리표시자 (공간이 열리며 "여기 들어감" 표시)
function ImageDropZone() {
    return (
        <div className="my-1 flex animate-popIn items-center justify-center rounded-lg border-2 border-dashed border-[#3b82f6] bg-[#e0edfb]/50 py-6 text-sm font-medium text-[#3b82f6] select-none">
            이미지를 여기에 놓기
        </div>
    );
}

export default function NewPage({ collapsed, docId, categories = [] }: { collapsed: boolean; docId: string; categories?: string[] }) {
    // 이 컴포넌트는 docId로 key되어 remount되므로, 초기값을 localStorage에서 한 번 읽어오면 된다.
    const initialDoc = getDoc(docId);

    // blocks / colors / formattedRanges 상태 + 되돌리기(Ctrl+Z)·다시실행(Ctrl+Y) 히스토리는 훅이 소유
    const {
        blocks,
        setBlocks,
        blockColors,
        setBlockColors,
        blockFormattedRanges,
        setBlockFormattedRanges,
        undo,
        redo,
    } = useBlockHistory(
        initialDoc?.blocks ?? [{ id: crypto.randomUUID(), type: "p", content: "", indentationLevel: 0 }],
        initialDoc?.blockColors ?? {},
        initialDoc?.blockFormattedRanges ?? {},
    );

    // hover/menu 대상은 배열 인덱스가 아니라 블록 id로 추적한다.
    // (드래그로 순서가 바뀌어도 메뉴가 엉뚱한 블록에 열리지 않게)
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [menuId, setMenuId] = useState<string | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const [showShare, setShowShare] = useState(false);

    // 상단 헤더의 "공유" 버튼(HoverHeader) 클릭 시 커스텀 이벤트로 공유 모달을 연다.
    useEffect(() => {
        const open = () => setShowShare(true);
        window.addEventListener("newpage:share", open);
        return () => window.removeEventListener("newpage:share", open);
    }, []);

    // 그래프 데이터 편집 모달: 그래프 블록 클릭 시(newpage:editchart) 열린다.
    const [chartEditId, setChartEditId] = useState<string | null>(null);
    useEffect(() => {
        const onEdit = (e: Event) => {
            const id = (e as CustomEvent<{ id: string }>).detail?.id;
            if (id) setChartEditId(id);
        };
        window.addEventListener("newpage:editchart", onEdit);
        return () => window.removeEventListener("newpage:editchart", onEdit);
    }, []);

    // 이미지 드래그앤드롭: 이미지 파일을 떨어뜨리면 base64로 읽어 이미지 블록을 추가한다.
    // (정적 사이트라 서버 업로드가 없어 data URL로 임베드)
    // 드래그 중에는 커서 위치에 맞는 삽입 지점(fileDropIdx)에 자리표시자를 띄워 "여기 들어감" 느낌을 준다.
    const [fileDropIdx, setFileDropIdx] = useState<number | null>(null);

    const computeDropIdx = (clientY: number): number => {
        const arr = blocksRef.current;
        for (let i = 0; i < arr.length; i++) {
            const el = document.getElementById(arr[i].id);
            if (!el) continue;
            const r = el.getBoundingClientRect();
            if (clientY < r.top + r.height / 2) return i;
        }
        return arr.length;
    };

    const handleFileDragOver = (e: React.DragEvent) => {
        if (!Array.from(e.dataTransfer.types).includes("Files")) return;
        e.preventDefault();
        setFileDropIdx(computeDropIdx(e.clientY));
    };
    const handleFileDragLeave = (e: React.DragEvent) => {
        const related = e.relatedTarget as Node | null;
        if (!related || !e.currentTarget.contains(related)) setFileDropIdx(null);
    };
    const handleFileDrop = (e: React.DragEvent) => {
        const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) {
            setFileDropIdx(null);
            return;
        }
        e.preventDefault();
        const insertAt = fileDropIdx ?? blocksRef.current.length;
        setFileDropIdx(null);
        Promise.all(
            files.map(
                (file) =>
                    new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    }),
            ),
        ).then((urls) => {
            const newBlocks: Block[] = urls.map((u) => ({
                id: crypto.randomUUID(),
                type: "image",
                content: serializeImageContent(u),
                indentationLevel: 0,
            }));
            setBlocks((prev) => {
                const arr = [...prev];
                arr.splice(Math.min(insertAt, arr.length), 0, ...newBlocks);
                return arr;
            });
        });
    };

    // 이미지 리사이즈 핸들에서 발생 → 해당 이미지 블록의 width 저장
    useEffect(() => {
        const onW = (e: Event) => {
            const { id, width } = (e as CustomEvent<{ id: string; width: number }>).detail || {};
            if (!id) return;
            setBlocks((prev) =>
                prev.map((b) => (b.id === id ? { ...b, content: serializeImageContent(parseImageContent(b.content).src, width) } : b)),
            );
        };
        window.addEventListener("newpage:setimagewidth", onW);
        return () => window.removeEventListener("newpage:setimagewidth", onW);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 표 셀/구조 변경 → 해당 표 블록 content(JSON) 갱신
    useEffect(() => {
        const onT = (e: Event) => {
            const { id, content } = (e as CustomEvent<{ id: string; content: string }>).detail || {};
            if (!id) return;
            setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
        };
        window.addEventListener("newpage:settable", onT);
        return () => window.removeEventListener("newpage:settable", onT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 그래프 데이터 저장 → 해당 블록 content(JSON)를 갱신
    const saveChart = (title: string, rows: ChartRow[]) => {
        if (!chartEditId) return;
        setBlocks((prev) => prev.map((b) => (b.id === chartEditId ? { ...b, content: JSON.stringify({ title, rows }) } : b)));
    };

    // 여러 블록 선택 (빈 영역을 드래그하면 마퀴 박스가 커지며 겹치는 블록 선택)
    const [selRange, setSelRange] = useState<{ a: number; b: number } | null>(null);
    const selMin = selRange ? Math.min(selRange.a, selRange.b) : -1;
    const selMax = selRange ? Math.max(selRange.a, selRange.b) : -1;
    const selectionRef = useRef<{ min: number; max: number } | null>(null);
    selectionRef.current = selRange ? { min: selMin, max: selMax } : null;
    const clearSelection = () => setSelRange(null);

    const [marquee, setMarquee] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
    const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);
    const blocksRef = useRef(blocks);
    blocksRef.current = blocks;

    const handleMarqueeDown = (e: React.MouseEvent) => {
        const t = e.target as HTMLElement;
        // 텍스트/핸들/버튼/입력·모달에서 시작하면 마퀴 안 함 (여백·갓터 등 빈 영역만)
        // (input/textarea에서 preventDefault 하면 포커스가 막혀 타이핑이 안 되므로 반드시 제외)
        if (
            t.closest("[contenteditable]") ||
            t.closest("button") ||
            t.closest("[data-btn-idx]") ||
            t.closest("input") ||
            t.closest("textarea") ||
            t.closest("[data-modal]")
        )
            return;
        e.preventDefault(); // 마퀴 드래그 중 텍스트 선택 방지
        // 블록 선택 모드 진입 → 편집 포커스 해제 (편집 중 판정 isContentEditable이 false가 되도록)
        (document.activeElement as HTMLElement | null)?.blur?.();
        marqueeStartRef.current = { x: e.clientX, y: e.clientY };
        setMarquee({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
        setSelRange(null);
    };

    useEffect(() => {
        if (!marquee) return;
        const onMove = (ev: MouseEvent) => {
            const s = marqueeStartRef.current;
            if (!s) return;
            setMarquee({ x0: s.x, y0: s.y, x1: ev.clientX, y1: ev.clientY });
            const top = Math.min(s.y, ev.clientY);
            const bot = Math.max(s.y, ev.clientY);
            let lo = -1;
            let hi = -1;
            blocksRef.current.forEach((b, i) => {
                const el = document.getElementById(b.id);
                if (!el) return;
                const r = el.getBoundingClientRect();
                if (r.bottom >= top && r.top <= bot) {
                    if (lo === -1) lo = i;
                    hi = i;
                }
            });
            setSelRange(lo !== -1 ? { a: lo, b: hi } : null);
        };
        const onUp = () => {
            marqueeStartRef.current = null;
            setMarquee(null);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [marquee !== null]);

    // 블록 복사/붙여넣기: OS 클립보드에 커스텀 타입으로 담아, 텍스트냐 블록이냐를 붙여넣을 때 구분한다.
    const CLIP_TYPE = "application/x-newpage-blocks";

    const buildBlockPayload = () => {
        const slice = blocks.slice(selMin, selMax + 1);
        const colors: { [id: string]: string } = {};
        const ranges: { [id: string]: FormattedRange[] } = {};
        slice.forEach((b) => {
            if (blockColors[b.id]) colors[b.id] = blockColors[b.id];
            if (blockFormattedRanges[b.id]) ranges[b.id] = blockFormattedRanges[b.id];
        });
        return { blocks: slice, colors, ranges };
    };

    const deleteSelectedBlocks = () => {
        if (!selRange) return;
        const ids = blocks.slice(selMin, selMax + 1).map((b) => b.id);
        setBlocks((prev) => {
            const filtered = prev.filter((_, i) => i < selMin || i > selMax);
            return filtered.length ? filtered : [{ id: crypto.randomUUID(), type: "p", content: "", indentationLevel: 0 }];
        });
        setBlockColors((prev) => {
            const n = { ...prev };
            ids.forEach((id) => delete n[id]);
            return n;
        });
        setBlockFormattedRanges((prev) => {
            const n = { ...prev };
            ids.forEach((id) => delete n[id]);
            return n;
        });
        setSelRange(null);
    };

    // targetIdx 블록 "아래"에 붙여넣기 (새 id 발급 + 색상/서식 이전)
    const pasteBlocksAfter = (
        targetIdx: number,
        payload: { blocks: Block[]; colors?: { [id: string]: string }; ranges?: { [id: string]: FormattedRange[] } },
    ) => {
        if (!payload.blocks?.length) return;
        const idMap: { [old: string]: string } = {};
        const newBlocks = payload.blocks.map((b) => {
            const id = crypto.randomUUID();
            idMap[b.id] = id;
            return { ...b, id };
        });
        const newColors: { [id: string]: string } = {};
        const newRanges: { [id: string]: FormattedRange[] } = {};
        payload.blocks.forEach((b) => {
            const nid = idMap[b.id];
            if (payload.colors?.[b.id]) newColors[nid] = payload.colors[b.id];
            if (payload.ranges?.[b.id]) newRanges[nid] = payload.ranges[b.id];
        });
        const insertAt = targetIdx + 1;
        setBlocks((prev) => {
            const arr = [...prev];
            arr.splice(insertAt, 0, ...newBlocks);
            return arr;
        });
        setBlockColors((prev) => ({ ...prev, ...newColors }));
        setBlockFormattedRanges((prev) => ({ ...prev, ...newRanges }));
        setSelRange({ a: insertAt, b: insertAt + newBlocks.length - 1 });
    };

    useEffect(() => {
        const isEditingText = () => !!(document.activeElement as HTMLElement | null)?.isContentEditable;

        // 복사/잘라내기: 블록 선택 모드일 때만 블록을 OS 클립보드에 담는다 (편집 중이면 네이티브 텍스트)
        const onCopy = (e: ClipboardEvent) => {
            if (!selRange || isEditingText() || !e.clipboardData) return;
            e.preventDefault();
            const p = buildBlockPayload();
            e.clipboardData.setData(CLIP_TYPE, JSON.stringify(p));
            e.clipboardData.setData("text/plain", p.blocks.map((b) => b.content).join("\n"));
        };
        const onCut = (e: ClipboardEvent) => {
            if (!selRange || isEditingText() || !e.clipboardData) return;
            e.preventDefault();
            const p = buildBlockPayload();
            e.clipboardData.setData(CLIP_TYPE, JSON.stringify(p));
            e.clipboardData.setData("text/plain", p.blocks.map((b) => b.content).join("\n"));
            deleteSelectedBlocks();
        };
        // 붙여넣기: 클립보드에 블록 데이터가 있으면(=블록을 복사했으면) 편집 중이어도 현재 블록 아래에 블록 삽입.
        // 없으면(일반 텍스트) 네이티브 그대로.
        const onPaste = (e: ClipboardEvent) => {
            const data = e.clipboardData?.getData(CLIP_TYPE);
            if (!data) return;
            let payload;
            try {
                payload = JSON.parse(data);
            } catch {
                return;
            }
            if (!payload?.blocks?.length) return;
            e.preventDefault();

            let target: number;
            if (isEditingText()) {
                const activeId = (document.activeElement as HTMLElement).id;
                target = blocksRef.current.findIndex((b) => b.id === activeId);
                if (target === -1) target = blocksRef.current.length - 1;
                (document.activeElement as HTMLElement).blur(); // 붙여넣은 블록 선택이 보이게
            } else if (selRange) {
                target = selMax;
            } else {
                target = blocksRef.current.length - 1;
            }
            pasteBlocksAfter(target, payload);
        };

        // Delete/Backspace: 선택된 블록 전체 삭제 / Escape: 선택 해제
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selRange) {
                clearSelection();
                return;
            }
            if ((e.key === "Delete" || e.key === "Backspace") && selRange && !isEditingText()) {
                e.preventDefault();
                deleteSelectedBlocks();
            }
        };

        document.addEventListener("copy", onCopy);
        document.addEventListener("cut", onCut);
        document.addEventListener("paste", onPaste);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("copy", onCopy);
            document.removeEventListener("cut", onCut);
            document.removeEventListener("paste", onPaste);
            window.removeEventListener("keydown", onKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selRange, selMin, selMax, blocks, blockColors, blockFormattedRanges]);
    const divRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<{ [id: string]: HTMLButtonElement | null }>({});
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);
    const [meta, setMeta] = useState<{
        label: string;
        title: string;
        subTitle: string;
        date: string;
        mins: number;
        tags: string[];
        imageUrl: string;
        icon: string;
    }>({
        label: initialDoc?.label || "",
        title: initialDoc?.title || "새 페이지",
        subTitle: initialDoc?.subTitle || "",
        date: "",
        mins: 0,
        tags: initialDoc?.tags || [],
        imageUrl: initialDoc?.imageUrl || "",
        icon: initialDoc?.icon || "",
    });
    // 아이콘/카테고리 선택기 위치(null이면 닫힘)
    const [iconPicker, setIconPicker] = useState<{ top: number; left: number } | null>(null);
    const [catPicker, setCatPicker] = useState<{ top: number; left: number } | null>(null);
    const [tagInput, setTagInput] = useState("");
    // 부제목/태그는 버튼으로 추가(아이콘처럼). 이미 내용이 있으면 열린 상태로 시작.
    const [showSubtitle, setShowSubtitle] = useState(!!initialDoc?.subTitle);
    const [showTags, setShowTags] = useState(!!(initialDoc?.tags && initialDoc.tags.length));
    // 커버 사진 업로드
    const coverInputRef = useRef<HTMLInputElement>(null);
    const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !file.type.startsWith("image/")) return;
        const webp = await fileToWebp(file, 1280);
        setMeta((prev) => ({ ...prev, imageUrl: webp }));
    };

    const { draggingIdx, insertLineIdx, dragPreview, dragPos, handleDragStart, handleDragEnter, handleDragOver, handleDragEnd } =
        useBlockDnD(
            setBlocks,
            () => selectionRef.current,
            (targetIdx, count) => setSelRange({ a: targetIdx, b: targetIdx + count - 1 }),
            (fromIdx) => {
                const sel = selectionRef.current;
                const inSel = sel && sel.max > sel.min && fromIdx >= sel.min && fromIdx <= sel.max;
                const min = inSel ? sel!.min : fromIdx;
                const max = inSel ? sel!.max : fromIdx;
                const first = blocks[min];
                // 차트/표/이미지 등은 content가 JSON이라 그대로 보이면 안 됨 → 타입별 라벨
                const typeLabel: { [k: string]: string } = {
                    image: "🖼 이미지",
                    table: "▦ 표",
                    barChartH: "▤ 가로 막대그래프",
                    barChartV: "▥ 세로 막대그래프",
                    divider: "구분선",
                };
                const label = first ? typeLabel[first.type] ?? ((first.content || "").trim() || "빈 블록") : "빈 블록";
                return { count: max - min + 1, label };
            },
        );

    const getListNumber = (currentIndex: number): number => {
        let counter = 1;
        for (let i = 0; i <= currentIndex; i++) {
            if (blocks[i].type === "numberedList") {
                if (i === 0 || blocks[i - 1].type !== "numberedList" || blocks[i].indentationLevel !== blocks[i - 1].indentationLevel) {
                    counter = 1;
                }
                if (i === currentIndex) {
                    return counter;
                }
                counter++;
            }
        }
        return 1;
    };

    // Ctrl+Z(되돌리기) / Ctrl+Y·Ctrl+Shift+Z(다시실행). 블록 삭제 등 구조 변경도 롤백된다.
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const key = e.key.toLowerCase();
            if (key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if (key === "y" || (key === "z" && e.shiftKey)) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [undo, redo]);

    // 항상 마지막 블록은 편집 가능한 블록이어야 한다.
    // (divider가 맨 아래면 그 밑에 입력할 곳이 없으므로 빈 텍스트 블록을 추가)
    useEffect(() => {
        if (blocks.length === 0) {
            setBlocks([{ id: crypto.randomUUID(), type: "p", content: "", indentationLevel: 0 }]);
            return;
        }
        const last = blocks[blocks.length - 1];
        if (last.type === "divider") {
            setBlocks((prev) => [
                ...prev,
                { id: crypto.randomUUID(), type: "p", content: "", indentationLevel: last.indentationLevel },
            ]);
        }
    }, [blocks, setBlocks]);

    useEffect(() => {
        if (!divRef.current) return;
        const observer = new MutationObserver(() => {
            const hasContent = !!divRef.current?.textContent?.trim();
            setIsTitleEmpty(!hasContent);
        });
        observer.observe(divRef.current, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (divRef.current && (!divRef.current.textContent || divRef.current.textContent === "")) {
            divRef.current.textContent = meta.title || "새 페이지";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 작성 내용을 localStorage에 자동 저장 (변경 후 800ms 디바운스). saveDoc이 목록 변경을 알림.
    useEffect(() => {
        const t = setTimeout(() => {
            saveDoc({
                id: docId,
                title: meta.title || "새 페이지",
                icon: meta.icon || undefined,
                label: meta.label || undefined,
                subTitle: meta.subTitle || undefined,
                tags: meta.tags,
                imageUrl: meta.imageUrl || undefined,
                updatedAt: Date.now(),
                blocks,
                blockColors,
                blockFormattedRanges,
            });
        }, 800);
        return () => clearTimeout(t);
    }, [docId, meta.title, meta.icon, meta.label, meta.subTitle, meta.tags, meta.imageUrl, blocks, blockColors, blockFormattedRanges]);

    // 문서 전환/이탈(언마운트) 시 최신 상태를 즉시 저장 (디바운스 대기분 유실 방지)
    const latestRef = useRef({ docId, meta, blocks, blockColors, blockFormattedRanges });
    latestRef.current = { docId, meta, blocks, blockColors, blockFormattedRanges };
    useEffect(() => {
        return () => {
            const l = latestRef.current;
            saveDoc({
                id: l.docId,
                title: l.meta.title || "새 페이지",
                icon: l.meta.icon || undefined,
                label: l.meta.label || undefined,
                subTitle: l.meta.subTitle || undefined,
                tags: l.meta.tags,
                imageUrl: l.meta.imageUrl || undefined,
                updatedAt: Date.now(),
                blocks: l.blocks,
                blockColors: l.blockColors,
                blockFormattedRanges: l.blockFormattedRanges,
            });
        };
    }, []);

    const handleTitleInput = () => {
        if (divRef.current) {
            if (divRef.current.textContent === "" || divRef.current.innerHTML === "<br>" || divRef.current.innerHTML === "\n") {
                divRef.current.innerHTML = "";
            }
            setMeta((prev) => ({ ...prev, title: divRef.current ? divRef.current.textContent ?? "" : "" }));
        }
    };

    // 제목은 한 줄만 — Enter로 줄바꿈하지 않고 첫 번째 블록으로 포커스를 넘긴다.
    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            const firstBlock = blocks[0];
            if (!firstBlock) return;
            const el = document.getElementById(firstBlock.id);
            if (el) {
                el.focus();
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }
    };

    const handleExport = async () => {
        // 블록에 색상과 포맷팅 범위 정보를 추가
        const blocksWithFormatting = blocks.map(block => ({
            ...block,
            color: blockColors[block.id],
            formattedRanges: blockFormattedRanges[block.id] || [],
        }));

        const exportedTags = meta.tags.length > 0 ? meta.tags : ["default-tag"];
        
        const mdx = blocksToMDX(blocksWithFormatting, {
            label: meta.label || "",
            title: meta.title || "",
            subTitle: meta.subTitle || "",
            date: meta.date || formatPostDate(new Date()),
            mins: meta.mins || 2,
            tags: exportedTags,
            imageUrl: meta.imageUrl || "",
            icon: meta.icon || "",
        });

        // 파일명(슬러그)은 ASCII로. 한글 제목은 frontmatter에 그대로 보존.
        const filename = `${slugifyTitle(meta.title, docId)}.mdx`;

        // 개발 모드: posts/post 폴더에 바로 저장 시도. 실패하면 브라우저 다운로드로 폴백.
        try {
            const res = await fetch("/api/save-mdx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, content: mdx }),
            });
            if (res.ok) {
                const data = await res.json();
                alert(`저장되었습니다 → ${data.path}`);
                return;
            }
        } catch {
            // 네트워크/서버 불가 → 아래 다운로드 폴백
        }

        // 폴백: 브라우저 다운로드
        const blob = new Blob([mdx], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const changeBlockType = (idx: number, type: string) => {
        // 함수형 업데이트: 뒤이어 호출될 수 있는 onContentChange("")와 합쳐지도록
        // (예: "[]"+space 마크다운 단축 시 type 변경이 content 변경에 덮어써지던 버그 방지)
        const blockId = blocks[idx]?.id;
        setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, type } : b)));
        setMenuId(null);
        setMenuPos(null);
        // 그래프/이미지는 편집 가능한 텍스트가 아니므로 포커스 로직을 건너뛴다.
        if (type === "barChartH" || type === "barChartV") {
            if (blockId) setChartEditId(blockId); // 바로 데이터 입력 모달 열기
            return;
        }
        if (type === "image" || type === "table") return;
        setTimeout(() => {
            if (!blockId) return;
            const blockElement = document.getElementById(blockId);
            if (blockElement) {
                blockElement.focus();
                const selection = window.getSelection();
                if (selection) {
                    const range = document.createRange();
                    range.selectNodeContents(blockElement);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, 0);
    };

    const handleColorChange = (idx: number, color: string) => {
        const blockId = blocks[idx].id;
        setBlockColors((prev) => ({ ...prev, [blockId]: color }));
        setMenuId(null);
        setMenuPos(null);
    };

    const handleContentChange = (idx: number, value: string) => {
        setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, content: value } : b)));
    };

    const handleFormattedRangesChange = (idx: number, ranges: FormattedRange[]) => {
        const blockId = blocks[idx].id;
        setBlockFormattedRanges((prev) => ({
            ...prev,
            [blockId]: ranges,
        }));
    };

    // 체크리스트 체크 상태를 blocks에 반영 (내보내기 시 - [x] 로 나가게)
    const handleToggleChecked = (id: string, isChecked: boolean) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, isChecked } : b)));
    };

    // 토글(목록/제목) 접기·펼치기
    const handleToggleCollapse = (id: string) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, collapsed: !b.collapsed } : b)));
    };

    const handleDeleteBlock = (idx: number) => {
        // 블록이 1개뿐이면 삭제하지 않는다 (0개가 되면 입력할 곳이 없어짐).
        if (blocks.length <= 1) {
            setMenuId(null);
            setMenuPos(null);
            return;
        }
        const newBlocks = [...blocks];
        const blockId = blocks[idx].id;
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        
        // 포맷팅 범위와 색상도 함께 삭제
        setBlockFormattedRanges((prev) => {
            const newRanges = { ...prev };
            delete newRanges[blockId];
            return newRanges;
        });
        setBlockColors((prev) => {
            const newColors = { ...prev };
            delete newColors[blockId];
            return newColors;
        });
        
        setMenuId(null);
        setMenuPos(null);
    };

    const handleDeleteBlockAndFocusPrevious = (idx: number) => {
        if (blocks.length <= 1) return;
        
        const newBlocks = [...blocks];
        const blockId = blocks[idx].id;
        const prevBlockIdx = idx > 0 ? idx - 1 : 0;
        const prevBlockId = blocks[prevBlockIdx].id;
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        
        // 포맷팅 범위와 색상도 함께 삭제
        setBlockFormattedRanges((prev) => {
            const newRanges = { ...prev };
            delete newRanges[blockId];
            return newRanges;
        });
        setBlockColors((prev) => {
            const newColors = { ...prev };
            delete newColors[blockId];
            return newColors;
        });
        
        setTimeout(() => {
            const prevBlockElement = document.getElementById(prevBlockId);
            if (prevBlockElement) {
                prevBlockElement.focus();
                const selection = window.getSelection();
                if (selection) {
                    const range = document.createRange();
                    range.selectNodeContents(prevBlockElement);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, 0);
    };

    const handlePlusClick = (id: string) => {
        setMenuId(id);
        setTimeout(() => {
            const btn = dotRefs.current[id];
            if (btn) {
                const rect = btn.getBoundingClientRect();
                // 메뉴는 position: fixed 라 뷰포트 기준 좌표를 그대로 쓴다(scroll 오프셋 더하지 않음).
                const menuWidth = 265;
                const menuHeight = 220;
                const margin = 12;
                let left = rect.left - menuWidth - 45;
                let top = rect.top - 70;
                // 화면 밖으로 넘어가지 않도록 클램핑
                left = Math.max(margin, Math.min(left, window.innerWidth - menuWidth - margin));
                top = Math.max(margin, Math.min(top, window.innerHeight - menuHeight - margin));
                setMenuPos({ top, left });
            }
        }, 0);
    };

    const handleAddBlock = (idx: number) => {
        // 함수형 업데이트: 앞서 호출된 onTypeChange/onContentChange(예: "---" divider 단축)를 덮어쓰지 않도록
        const newBlockId = crypto.randomUUID();
        setBlocks((prev) => {
            const newBlocks = [...prev];
            const newBlock = { id: newBlockId, type: "p", content: "", indentationLevel: prev[idx]?.indentationLevel ?? 0 };
            newBlocks.splice(idx + 1, 0, newBlock);
            return newBlocks;
        });
        setTimeout(() => {
            const newBlockElement = document.getElementById(newBlockId);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 0);
    };

    const handleAddBlockAfterBullet = (idx: number) => {
        const newBlockId = crypto.randomUUID();
        setBlocks((prev) => {
            const newBlocks = [...prev];
            const currentBlock = prev[idx];
            const newBlock = { id: newBlockId, type: currentBlock.type, content: "", indentationLevel: currentBlock.indentationLevel };
            newBlocks.splice(idx + 1, 0, newBlock);
            return newBlocks;
        });
        setTimeout(() => {
            const newBlockElement = document.getElementById(newBlockId);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 0);
    };

    // 토글에서 Enter → 한 단계 들여쓴 자식 블록 생성 (접혀 있으면 펼쳐서 보이게)
    const handleAddBlockAsChild = (idx: number) => {
        const newBlockId = crypto.randomUUID();
        setBlocks((prev) => {
            const newBlocks = [...prev];
            const parent = prev[idx];
            if (parent?.collapsed) newBlocks[idx] = { ...parent, collapsed: false };
            const newBlock = {
                id: newBlockId,
                type: "p",
                content: "",
                indentationLevel: (parent?.indentationLevel ?? 0) + 1,
            };
            newBlocks.splice(idx + 1, 0, newBlock);
            return newBlocks;
        });
        setTimeout(() => {
            document.getElementById(newBlockId)?.focus();
        }, 0);
    };

    const handleTypeChange = (idx: number, newType: string) => {
        changeBlockType(idx, newType);
    };

    const handleIndent = (idx: number, change: number) => {
        // 0~6 범위 내에서 자유롭게 들여쓰기 (이전엔 "위 블록보다 1단계까지"로 막혀 2번째 Tab이 안 됐음)
        setBlocks((prev) =>
            prev.map((b, i) => {
                if (i !== idx) return b;
                const newIndent = Math.min(6, Math.max(0, b.indentationLevel + change));
                return { ...b, indentationLevel: newIndent };
            }),
        );
    };

    const setCaretPosition = (element: HTMLDivElement, offset: number) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(element.childNodes[0] || element, offset);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
    };

    const handleFocusNext = (currentId: string, targetX: number) => {
        const currentIdx = blocks.findIndex((block) => block.id === currentId);
        if (currentIdx < blocks.length - 1) {
            const nextBlock = document.getElementById(blocks[currentIdx + 1].id) as HTMLDivElement;
            if (nextBlock) {
                let closestOffset = 0;
                let minDistance = Infinity;
                if (nextBlock.childNodes[0]?.nodeType === Node.TEXT_NODE) {
                    const textNode = nextBlock.childNodes[0] as Text;
                    const text = textNode.data;
                    for (let i = 0; i <= text.length; i++) {
                        const range = document.createRange();
                        range.setStart(textNode, i);
                        range.collapse(true);
                        const rects = range.getClientRects();
                        if (rects.length > 0) {
                            const rect = rects[0];
                            const distance = Math.abs(rect.left + window.scrollX - targetX);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestOffset = i;
                            }
                        }
                    }
                }
                nextBlock.focus();
                setCaretPosition(nextBlock, closestOffset);
            }
        }
    };

    const handleFocusPrev = (currentId: string, targetX: number) => {
        const currentIdx = blocks.findIndex((block) => block.id === currentId);
        if (currentIdx > 0) {
            const prevBlock = document.getElementById(blocks[currentIdx - 1].id) as HTMLDivElement;
            if (prevBlock) {
                let closestOffset = prevBlock.textContent?.length || 0;
                let minDistance = Infinity;
                if (prevBlock.childNodes[0]?.nodeType === Node.TEXT_NODE) {
                    const textNode = prevBlock.childNodes[0] as Text;
                    const text = textNode.data;
                    for (let i = text.length; i >= 0; i--) {
                        const range = document.createRange();
                        range.setStart(textNode, i);
                        range.collapse(true);
                        const rects = range.getClientRects();
                        if (rects.length > 0) {
                            const rect = rects[0];
                            const distance = Math.abs(rect.left + window.scrollX - targetX);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestOffset = i;
                            }
                        }
                    }
                }
                prevBlock.focus();
                setCaretPosition(prevBlock, closestOffset);
            }
        }
    };

    // 접힌 토글의 자식(= 바로 아래에 이어지는 더 깊게 들여쓴 연속 블록)은 렌더링에서 숨긴다.
    const hiddenBlockIds = new Set<string>();
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const isToggle = b.type === "toggleText" || b.type.startsWith("toggleH");
        if (isToggle && b.collapsed) {
            for (let j = i + 1; j < blocks.length; j++) {
                if (blocks[j].indentationLevel > b.indentationLevel) {
                    hiddenBlockIds.add(blocks[j].id);
                } else {
                    break;
                }
            }
        }
    }

    return (
        <tw.Container
            onMouseDown={handleMarqueeDown}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
            style={{
                paddingLeft: collapsed ? 50 : 350,
                transition: "padding-left 0.2s",
            }}
        >
            <div data-editor-col className="max-w-[712px] min-w-[712px] w-[712px] mx-10" style={{ position: "relative" }}>
                <tw.BlockWrap>
                    <div className="group/title">
                        {/* 커버 사진: 상단 배너, 아이콘이 하단에 겹쳐 표시 */}
                        {meta.imageUrl && (
                            <div className="group/cover relative mb-8">
                                {/* 포스트(PostTitle)의 커버 마크업과 동일하게 */}
                                <div className="w-full h-[400px] rounded-basic content-center flex justify-center p-4 bg-white">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={meta.imageUrl} alt="" className="rounded-basic h-full w-full object-contain" />
                                </div>
                                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover/cover:opacity-100">
                                    <button className="rounded bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70" onClick={() => coverInputRef.current?.click()}>
                                        커버 변경
                                    </button>
                                    <button className="rounded bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70" onClick={() => setMeta((p) => ({ ...p, imageUrl: "" }))}>
                                        제거
                                    </button>
                                </div>
                                {meta.icon && (
                                    <button
                                        className="absolute -bottom-6 left-0 flex h-[64px] w-[64px] items-center justify-center rounded-[8px] bg-(--page-bg) p-[4px] shadow hover:bg-(--hover-bg)"
                                        onClick={(e) => {
                                            const r = e.currentTarget.getBoundingClientRect();
                                            setIconPicker({ top: r.bottom + 6, left: r.left });
                                        }}
                                    >
                                        <PageIcon icon={meta.icon} size={56} />
                                    </button>
                                )}
                            </div>
                        )}
                        {/* 페이지 아이콘 (커버 없을 때 위에 크게) */}
                        {meta.icon && !meta.imageUrl && (
                            <button
                                className="mb-1 flex h-[64px] w-[64px] items-center justify-center rounded-[8px] p-[4px] hover:bg-(--hover-bg)"
                                onClick={(e) => {
                                    const r = e.currentTarget.getBoundingClientRect();
                                    setIconPicker({ top: r.bottom + 6, left: r.left });
                                }}
                            >
                                <PageIcon icon={meta.icon} size={56} />
                            </button>
                        )}
                        {/* 컨트롤 행: 카테고리 칩 + (호버 시) 아이콘/카테고리 추가 */}
                        <div className="mb-1 flex min-h-[26px] items-center gap-1">
                            {meta.label && (
                                <button
                                    className="flex items-center gap-1 rounded-[6px] bg-(--hover-bg) px-2 py-1 text-xs font-medium text-(--text-muted) hover:bg-(--menu-hover-bg)"
                                    onClick={(e) => {
                                        const r = e.currentTarget.getBoundingClientRect();
                                        setCatPicker({ top: r.bottom + 6, left: r.left });
                                    }}
                                >
                                    📁 {meta.label}
                                </button>
                            )}
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/title:opacity-100">
                                {!meta.icon && (
                                    <button
                                        className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                                        onClick={(e) => {
                                            const r = e.currentTarget.getBoundingClientRect();
                                            setIconPicker({ top: r.bottom + 6, left: r.left });
                                        }}
                                    >
                                        <span className="text-base">😀</span> 아이콘 추가
                                    </button>
                                )}
                                {!meta.label && (
                                    <button
                                        className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                                        onClick={(e) => {
                                            const r = e.currentTarget.getBoundingClientRect();
                                            setCatPicker({ top: r.bottom + 6, left: r.left });
                                        }}
                                    >
                                        📁 카테고리 추가
                                    </button>
                                )}
                                {!meta.imageUrl && (
                                    <button
                                        className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                                        onClick={() => coverInputRef.current?.click()}
                                    >
                                        🖼️ 커버 추가
                                    </button>
                                )}
                                {!showSubtitle && (
                                    <button
                                        className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                                        onClick={() => setShowSubtitle(true)}
                                    >
                                        📝 부제목 추가
                                    </button>
                                )}
                                {!showTags && (
                                    <button
                                        className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                                        onClick={() => setShowTags(true)}
                                    >
                                        🏷️ 태그 추가
                                    </button>
                                )}
                            </div>
                        </div>
                        <tw.TitleBlock>
                            <tw.EditableTitle
                                ref={divRef}
                                contentEditable
                                suppressContentEditableWarning
                                spellCheck={true}
                                className="notranslate"
                                onInput={handleTitleInput}
                                onKeyDown={handleTitleKeyDown}
                                data-placeholder="새 페이지"
                            />
                        </tw.TitleBlock>
                        {/* 부제목 (버튼으로 추가) */}
                        {showSubtitle && (
                            <input
                                autoFocus={!meta.subTitle}
                                className="w-full bg-transparent px-[2px] text-[16px] text-(--text-muted) outline-none placeholder:text-(--placeholder)"
                                placeholder="부제목을 입력하세요"
                                value={meta.subTitle}
                                onChange={(e) => setMeta((prev) => ({ ...prev, subTitle: e.target.value }))}
                                // 비운 채로 포커스가 빠지면 부제목 영역을 접는다
                                onBlur={() => {
                                    if (!meta.subTitle.trim()) setShowSubtitle(false);
                                }}
                            />
                        )}
                        {/* 태그 (버튼으로 추가) */}
                        {showTags && (
                        <div className="mt-2 mb-1 flex flex-wrap items-center gap-1 px-[2px]">
                            {meta.tags.map((t, i) => (
                                <span key={`${t}-${i}`} className="flex items-center gap-1 rounded-[6px] bg-(--hover-bg) px-2 py-0.5 text-xs text-(--text-muted)">
                                    #{t}
                                    <button
                                        className="text-(--text-muted) hover:text-[#e65b58]"
                                        onClick={() => setMeta((prev) => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))}
                                        aria-label="태그 삭제"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            <input
                                className="min-w-[90px] flex-1 bg-transparent py-0.5 text-xs outline-none placeholder:text-(--placeholder)"
                                placeholder="태그 추가"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                                        e.preventDefault();
                                        const t = tagInput.trim().replace(/^#/, "");
                                        if (t && !meta.tags.includes(t)) setMeta((prev) => ({ ...prev, tags: [...prev.tags, t] }));
                                        setTagInput("");
                                    } else if (e.key === "Backspace" && !tagInput && meta.tags.length) {
                                        setMeta((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
                                    }
                                }}
                                // 태그도 없고 입력도 비었는데 포커스가 빠지면 접는다
                                onBlur={() => {
                                    if (!tagInput.trim() && meta.tags.length === 0) setShowTags(false);
                                }}
                            />
                        </div>
                        )}
                    </div>
                </tw.BlockWrap>

                {/* 커버 사진 업로드용 숨은 input */}
                <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={handleCoverFile} />

                <IconPicker
                    open={iconPicker !== null}
                    position={iconPicker}
                    onPick={(icon) => setMeta((prev) => ({ ...prev, icon }))}
                    onRemove={() => setMeta((prev) => ({ ...prev, icon: "" }))}
                    onClose={() => setIconPicker(null)}
                />

                <CategoryPicker
                    open={catPicker !== null}
                    position={catPicker}
                    current={meta.label}
                    options={Array.from(new Set([...categories, ...listCategories()]))}
                    onSelect={(label) => setMeta((prev) => ({ ...prev, label }))}
                    onClose={() => setCatPicker(null)}
                />
                
                <TypeMenuModal
                    open={menuId !== null}
                    position={menuPos}
                    onSelect={(type) => {
                        const idx = blocks.findIndex((b) => b.id === menuId);
                        if (idx !== -1) changeBlockType(idx, type);
                    }}
                    onColorSelect={(color) => {
                        const idx = blocks.findIndex((b) => b.id === menuId);
                        if (idx !== -1) handleColorChange(idx, color);
                    }}
                    onDeleteBlock={() => {
                        const idx = blocks.findIndex((b) => b.id === menuId);
                        if (idx !== -1) handleDeleteBlock(idx);
                    }}
                    onClose={() => {
                        setMenuId(null);
                        setMenuPos(null);
                    }}
                    elements={ELEMENTS}
                />
                
                {blocks.map((block, idx) => (
                    <React.Fragment key={block.id}>
                        {fileDropIdx === idx && <ImageDropZone />}
                        {hiddenBlockIds.has(block.id) ? null : (
                        <BlockRow
                            block={block}
                            idx={idx}
                            prevIndentLevel={blocks[idx - 1]?.indentationLevel ?? 0}
                            hoverId={hoverId}
                            menuId={menuId}
                            setHoverId={setHoverId}
                            draggingIdx={draggingIdx}
                            insertLineIdx={insertLineIdx}
                            dotRefs={dotRefs}
                            color={blockColors[block.id]}
                            formattedRanges={blockFormattedRanges[block.id] || []}
                            listNumber={block.type === "numberedList" ? getListNumber(idx) : undefined}
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                            onAddBlock={handleAddBlock}
                            onPlusClick={handlePlusClick}
                            onContentChange={handleContentChange}
                            onTypeChange={handleTypeChange}
                            onAddBlockAfterBullet={handleAddBlockAfterBullet}
                            onAddChildBlock={handleAddBlockAsChild}
                            onDeleteBlock={handleDeleteBlockAndFocusPrevious}
                            onToggleChecked={handleToggleChecked}
                            onToggleCollapse={handleToggleCollapse}
                            onFocusNext={handleFocusNext}
                            onFocusPrev={handleFocusPrev}
                            onIndent={handleIndent}
                            onFormattedRangesChange={handleFormattedRangesChange}
                            selected={idx >= selMin && idx <= selMax}
                            onClearSelection={clearSelection}
                        />
                        )}
                    </React.Fragment>
                ))}
                {fileDropIdx === blocks.length && <ImageDropZone />}

                <div
                    className={`h-[4px] rounded ${insertLineIdx === blocks.length ? "bg-[#e0edfb]" : "bg-transparent"}`}
                    style={{ marginLeft: (blocks[blocks.length - 1]?.indentationLevel ?? 0) * 25 }}
                    onDragEnter={(e) => handleDragEnter(e, blocks.length, true)}
                    onDragOver={handleDragOver}
                />

                {/* 마지막 블록 아래 빈 공간 클릭 → 마지막이 빈 텍스트가 아니면 빈 텍스트 블록 하나 추가 */}
                <div
                    className="min-h-[30vh] w-full cursor-text"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                        const last = blocks[blocks.length - 1];
                        if (last && last.type === "p" && last.content === "") {
                            document.getElementById(last.id)?.focus();
                            return;
                        }
                        const nid = crypto.randomUUID();
                        setBlocks((prev) => [...prev, { id: nid, type: "p", content: "", indentationLevel: 0 }]);
                        setTimeout(() => document.getElementById(nid)?.focus(), 0);
                    }}
                />
            </div>
            
            <ShareModal
                open={showShare}
                onClose={() => setShowShare(false)}
                onExport={handleExport}
                postUrl={`https://weaall.github.io/post/${(meta.title || "untitled").replace(/ /g, "_")}`}
            />

            {(() => {
                if (!chartEditId) return null;
                const block = blocks.find((b) => b.id === chartEditId);
                if (!block || (block.type !== "barChartH" && block.type !== "barChartV")) return null;
                let parsed: { title?: string; rows?: ChartRow[] } = {};
                try {
                    parsed = JSON.parse(block.content || "{}");
                } catch {
                    /* 손상된 값은 빈 데이터 */
                }
                return (
                    <ChartModal
                        open
                        orient={block.type === "barChartH" ? "h" : "v"}
                        initialTitle={parsed.title ?? ""}
                        initialRows={parsed.rows ?? []}
                        onSave={saveChart}
                        onClose={() => setChartEditId(null)}
                    />
                );
            })()}

            {/* 마퀴 선택 박스 */}
            {marquee && (Math.abs(marquee.x1 - marquee.x0) > 3 || Math.abs(marquee.y1 - marquee.y0) > 3) && (
                <div
                    className="pointer-events-none fixed z-[1500] rounded-[2px] bg-[#3772ff]/20"
                    style={{
                        left: Math.min(marquee.x0, marquee.x1),
                        top: Math.min(marquee.y0, marquee.y1),
                        width: Math.abs(marquee.x1 - marquee.x0),
                        height: Math.abs(marquee.y1 - marquee.y0),
                    }}
                />
            )}

            {/* 노션식 드래그 미리보기: 커서를 따라다니며 내용 + 개수 표시 */}
            {dragPreview && dragPos && (
                <div className="pointer-events-none fixed z-[2000]" style={{ top: dragPos.y + 12, left: dragPos.x + 12 }}>
                    <div className="flex max-w-[280px] items-center gap-2 rounded-md border border-(--border) bg-(--menu-bg) px-3 py-1.5 text-sm text-(--text) opacity-90 shadow-lg">
                        <span className="truncate">{dragPreview.label}</span>
                        {dragPreview.count > 1 && (
                            <span className="rounded bg-[#3772ff] px-1.5 py-0.5 text-xs text-white">{dragPreview.count}</span>
                        )}
                    </div>
                </div>
            )}
        </tw.Container>
    );
}