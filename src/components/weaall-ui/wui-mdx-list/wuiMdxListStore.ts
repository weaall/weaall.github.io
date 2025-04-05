import { create } from "zustand";

interface WuiMdxListState {
    openLabels: { [key: string]: boolean };
    toggleLabel: (label: string) => void;
    setOpenLabels: (labels: { [key: string]: boolean }) => void;
}

export const useWuiMdxListStore = create<WuiMdxListState>((set) => ({
    openLabels: {},
    toggleLabel: (label) =>
        set((state) => ({
            openLabels: { ...state.openLabels, [label]: !state.openLabels[label] },
        })),
    setOpenLabels: (labels) => set({ openLabels: labels }),
}));