// NewPage.tsx (완전 버전)
import React, { useState, useRef, useEffect } from "react";

import TypeMenuModal from "./menu-modal/TypeMenu.modal";
import { ELEMENTS } from "./menu-modal/TypeElement";
import { Block, blocksToMDX } from "./helper/BlocksToMdx";
import { FormattedRange } from "./text-modal/TextFormat.modal";
import BlockRow from "./BlockRow";
import ShareModal from "./ShareModal";
import { useBlockHistory } from "../hooks/useBlockHistory";
import { useBlockDnD } from "../hooks/useBlockDnD";
import { getDoc, saveDoc } from "../lib/localDocs";

import { formatPostDate } from "@/util/date";
import * as tw from "./Newpage.styles";

export default function NewPage({ collapsed, docId }: { collapsed: boolean; docId: string }) {
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
        // 텍스트/핸들/버튼에서 시작하면 마퀴 안 함 (여백·갓터 등 빈 영역만)
        if (t.closest("[contenteditable]") || t.closest("button") || t.closest("[data-btn-idx]")) return;
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

    // 블록 복사/붙여넣기: 선택된 블록을 통째로(타입+내용+서식) 복제한다.
    const clipboardRef = useRef<{
        blocks: Block[];
        colors: { [id: string]: string };
        ranges: { [id: string]: FormattedRange[] };
    } | null>(null);

    const copySelection = () => {
        if (!selRange) return;
        const slice = blocks.slice(selMin, selMax + 1);
        const colors: { [id: string]: string } = {};
        const ranges: { [id: string]: FormattedRange[] } = {};
        slice.forEach((b) => {
            if (blockColors[b.id]) colors[b.id] = blockColors[b.id];
            if (blockFormattedRanges[b.id]) ranges[b.id] = blockFormattedRanges[b.id];
        });
        clipboardRef.current = { blocks: JSON.parse(JSON.stringify(slice)), colors, ranges };
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

    const pasteAfterSelection = () => {
        const clip = clipboardRef.current;
        if (!clip || !selRange) return;
        const idMap: { [old: string]: string } = {};
        const newBlocks = clip.blocks.map((b) => {
            const id = crypto.randomUUID();
            idMap[b.id] = id;
            return { ...b, id };
        });
        const newColors: { [id: string]: string } = {};
        const newRanges: { [id: string]: FormattedRange[] } = {};
        clip.blocks.forEach((b) => {
            const nid = idMap[b.id];
            if (clip.colors[b.id]) newColors[nid] = clip.colors[b.id];
            if (clip.ranges[b.id]) newRanges[nid] = clip.ranges[b.id];
        });
        const insertAt = selMax + 1;
        setBlocks((prev) => {
            const arr = [...prev];
            arr.splice(insertAt, 0, ...newBlocks);
            return arr;
        });
        setBlockColors((prev) => ({ ...prev, ...newColors }));
        setBlockFormattedRanges((prev) => ({ ...prev, ...newRanges }));
        setSelRange({ a: insertAt, b: insertAt + newBlocks.length - 1 });
    };

    // 블록 선택 모드(selRange 활성)에서 clipboard 이벤트를 블록 단위로 가로챈다.
    // (선택이 없으면 일반 텍스트 복사/붙여넣기 그대로 — keydown보다 clipboard 이벤트가 확실)
    useEffect(() => {
        // 텍스트 편집 중(contentEditable 포커스)이면 항상 네이티브 처리 → 블록 op는 선택 모드일 때만
        const isEditingText = () => !!(document.activeElement as HTMLElement | null)?.isContentEditable;
        const onCopy = (e: ClipboardEvent) => {
            if (!selRange || isEditingText()) return;
            e.preventDefault();
            copySelection();
        };
        const onCut = (e: ClipboardEvent) => {
            if (!selRange || isEditingText()) return;
            e.preventDefault();
            copySelection();
            deleteSelectedBlocks();
        };
        const onPaste = (e: ClipboardEvent) => {
            if (!selRange || isEditingText()) return;
            e.preventDefault();
            if (clipboardRef.current) pasteAfterSelection();
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selRange) clearSelection();
        };
        document.addEventListener("copy", onCopy);
        document.addEventListener("cut", onCut);
        document.addEventListener("paste", onPaste);
        window.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("copy", onCopy);
            document.removeEventListener("cut", onCut);
            document.removeEventListener("paste", onPaste);
            window.removeEventListener("keydown", onEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selRange, selMin, selMax, blocks, blockColors, blockFormattedRanges]);
    const divRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<{ [id: string]: HTMLButtonElement | null }>({});
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);
    const [meta, setMeta] = useState({
        label: "",
        title: initialDoc?.title || "새 페이지",
        subTitle: "",
        date: "",
        mins: 0,
        tags: [],
        imageUrl: "",
    });

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
                const label = (first?.content || "").trim() || "빈 블록";
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
                updatedAt: Date.now(),
                blocks,
                blockColors,
                blockFormattedRanges,
            });
        }, 800);
        return () => clearTimeout(t);
    }, [docId, meta.title, blocks, blockColors, blockFormattedRanges]);

    // 문서 전환/이탈(언마운트) 시 최신 상태를 즉시 저장 (디바운스 대기분 유실 방지)
    const latestRef = useRef({ docId, title: meta.title, blocks, blockColors, blockFormattedRanges });
    latestRef.current = { docId, title: meta.title, blocks, blockColors, blockFormattedRanges };
    useEffect(() => {
        return () => {
            const l = latestRef.current;
            saveDoc({
                id: l.docId,
                title: l.title || "새 페이지",
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
        });

        // 파일명은 페이지 제목으로, 공백은 밑줄로. 제목이 없으면 'untitled'.
        const filename = `${(meta.title || "untitled").replace(/ /g, "_")}.mdx`;

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
            style={{
                paddingLeft: collapsed ? 50 : 350,
                transition: "padding-left 0.2s",
            }}
        >
            <div className="max-w-[712px] min-w-[712px] w-[712px] mx-10" style={{ position: "relative" }}>
                <tw.BlockWrap>
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
                </tw.BlockWrap>
                
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
                
                {blocks.map((block, idx) =>
                    hiddenBlockIds.has(block.id) ? null : (
                        <BlockRow
                            key={block.id}
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
                    ),
                )}
                
                <div
                    className={`h-[4px] rounded ${insertLineIdx === blocks.length ? "bg-[#e0edfb]" : "bg-transparent"}`}
                    style={{ marginLeft: (blocks[blocks.length - 1]?.indentationLevel ?? 0) * 25 }}
                    onDragEnter={(e) => handleDragEnter(e, blocks.length, true)}
                    onDragOver={handleDragOver}
                />
            </div>
            
            <ShareModal
                open={showShare}
                onClose={() => setShowShare(false)}
                onExport={handleExport}
                postUrl={`https://weaall.github.io/post/${(meta.title || "untitled").replace(/ /g, "_")}`}
            />

            {/* 마퀴 선택 박스 */}
            {marquee && (Math.abs(marquee.x1 - marquee.x0) > 3 || Math.abs(marquee.y1 - marquee.y0) > 3) && (
                <div
                    className="pointer-events-none fixed z-[1500] rounded-[2px] border border-[#3772ff]/40 bg-[#e0edfb]/40"
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