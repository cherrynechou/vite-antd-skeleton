/**
 * Store 共享类型定义
 */
import type { LayoutType, ThemeProps } from '@/layouts/typing';
import type { IMenu } from '@/domain/ISysMenu';
import type ISysUser from "@/domain/ISysUser";


/**
 * 面包屑类型
 */
export interface BreadcrumbItem {
    href?: string;
    title?: string;
    icon?: string;
    locale?: string;
}

/**
 * 菜单索引映射
 */
export interface MenuIndexes {
    menuMap: Record<string, IMenu>;
    breadcrumbMap: Record<string, BreadcrumbItem[]>;
}

/**
 * 网站基础信息状态
 */
export interface SiteState {
    logo: string;
    title: string;
    documentTitle: string;
}

/**
 * 网站基础信息操作
 */
export interface SiteAction {
    initWebInfo: () => Promise<void>;
    setDocumentTitle: (documentTitle: string) => void;
}


/**
 * 布局状态
 */
export interface LayoutState {
    layout: LayoutType;
    collapsed: boolean;
    isMobile: boolean;
    breadcrumb: BreadcrumbItem[];
    menuParentKey: string | null;
}

/**
 * 布局操作
 */
export interface LayoutAction {
    setLayout: (layout: LayoutType) => void;
    setCollapsed: (collapsed: boolean) => void;
    setIsMobile: (isMobile: boolean) => void;
    setBreadcrumb: (breadcrumb: BreadcrumbItem[]) => void;
    setMenuParentKey: (menuParentKey: string) => void;
}


/**
 * 主题状态
 */
export interface ThemeState {
    themeConfig: ThemeProps;
}

/**
 * 主题操作
 */
export interface ThemeAction {
    setThemeConfig: (themeConfig: ThemeProps) => void;
    setThemeDrawer: (themeDrawer: boolean) => void;
}


/**
 * Global Store 完整类型
 */
export type GlobalState = SiteState & LayoutState & ThemeState ;
export type GlobalAction = SiteAction & LayoutAction & ThemeAction ;
export type GlobalStore = GlobalState & GlobalAction;

// ============== Auth Store 类型 ==============
/**
 * 用户状态
 */
export interface UserState {
    user: ISysUser | null;
}
