import { create, type StateCreator } from 'zustand';
import type { MenuStore, MenuStoreState, MenuStoreActions } from "./types";
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { getMenuList } from '@/api/system/CommonController';
import { IMenu } from '@/domain/ISysMenu';
import type { BreadcrumbItem, MenuIndexes } from "@/stores";


const initialState: MenuStoreState = {
    menus: [],     //原来数据  树型结构
    menuList: [],  //数据库存放的数据列表
    menuMap: {},   //key为主键生成的结构
    breadcrumbMap: {},
};

/**
 * 构建菜单索引映射
 */
const buildMenuIndexes= (menus: IMenu[]): MenuIndexes => {
    const menuMap: Record<string, IMenu> = {};
    const breadcrumbMap: Record<string, BreadcrumbItem[]> = {};

    const traverse = (items: IMenu[], parentBreadcrumb: BreadcrumbItem[] = []) => {
        for (const menu of items) {
            if (!menu.key) continue;
            menuMap[menu.key] = menu;
            const currentBreadcrumb: BreadcrumbItem[] = [
                ...parentBreadcrumb,
                { href: menu.path, title: menu.name, icon: menu.icon, locale: menu.locale }
            ];
            breadcrumbMap[menu.key] = currentBreadcrumb;
            if (menu.children?.length) {
                traverse(menu.children, currentBreadcrumb);
            }
        }
    };
    traverse(menus);
    return { menuMap, breadcrumbMap };
};

//生成列表
const treeToArrayRecursive = (menus: IMenu[], result: IMenu[] = [], level = 0, parentId = 0) => {
    for (const menu of menus) {
        // 创建扁平节点
        const flatMenu = {
            ...menu,
            level,
            parentId,
            isLeaf: !menu.children || menu.children.length === 0
        };

        // 添加到结果数组
        result.push(flatMenu);

        // 递归处理子节点
        if (menu.children && menu.children.length > 0) {
            treeToArrayRecursive(menu.children, result, level + 1, menu.id);
        }

        // 移除children属性（可选）
        delete flatMenu.children;
    }

    return result;
}


const createAuthSlice: StateCreator<MenuStore> = (set) => ({
    ...initialState,
    getMenus: async() =>{
        const { data } = await getMenuList();
        const { menuMap, breadcrumbMap } = buildMenuIndexes(data);
        const menuList = treeToArrayRecursive(data);
        set({
            menus: data,
            menuMap,
            menuList,
            breadcrumbMap,
        })
    },
    setMenus: (menus) => set({menus})
})

const useAuthMenuStore = create<MenuStore>()(
    devtools(
        persist(
            createAuthSlice,
            {
                name: 'menu-storage',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
)

export type { MenuStore, MenuStoreState, MenuStoreActions};
export default useAuthMenuStore;