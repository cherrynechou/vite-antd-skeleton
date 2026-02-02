import type { IMenu } from "@/domain/ISysMenu";
import type { BreadcrumbItem } from '@/stores'

export interface MenuStoreState {
    menus: IMenu[],
    menuList: IMenu[],
    menuMap: Record<string, IMenu>,
    breadcrumbMap: Record<string, BreadcrumbItem[]>,
}

export interface MenuStoreActions{
    getMenus:() => Promise<void>,
    setMenus: (menus: IMenu[]) => void,
}

export type MenuStore = MenuStoreState & MenuStoreActions

