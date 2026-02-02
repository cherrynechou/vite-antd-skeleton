/**
 * 主题 Slice
 * 管理主题配置和主题抽屉状态
 */

import type { StateCreator } from 'zustand';
import type { GlobalStore, ThemeState } from '@/stores/types';
import type { ThemeProps } from "@/layouts/typing";
import { configTheme, defaultColorTheme } from "@/layouts/theme";

export type ThemeSlice = ThemeState ;

/**
 * 主题初始状态
 */
export const initialThemeState: ThemeState = {
    themeConfig: { ...defaultColorTheme, ...configTheme },
};

/**
 * 创建主题 Slice
 */
export const createThemeSlice: StateCreator<GlobalStore, [], [], ThemeSlice> = (set) => ({
    ...initialThemeState,

    setThemeConfig: (themeConfig: ThemeProps) => {
        set({ themeConfig });
    },
});
