import type { StateCreator } from 'zustand';
import type {  GlobalStore, LayoutState, LayoutAction, BreadcrumbItem } from '@/stores/types';
import type { LayoutType } from "@/layouts/typing";


export type LayoutSlice = LayoutState & LayoutAction;

/**
 * 布局初始状态
 */
export const initialLayoutState: LayoutState = {
    layout: "side",
    collapsed: false,
    breadcrumb: [],
    menuParentKey: null,
};


/**
 * 创建布局 Slice
 */
export const createLayoutSlice: StateCreator<GlobalStore, [], [], LayoutSlice> = (set) => ({
    ...initialLayoutState,

    setLayout: (layout: LayoutType) => {
        set({ layout });
    },

    setCollapsed: (collapsed: boolean) => {
        set({ collapsed });
    },

    setBreadcrumb: (breadcrumb: BreadcrumbItem[]) => {
        set({ breadcrumb });
    },

    setMenuParentKey: (menuParentKey: string) => {
        set({ menuParentKey });
    },
});

