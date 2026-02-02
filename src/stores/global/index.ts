import { create } from 'zustand';
import {createJSONStorage, persist,devtools} from "zustand/middleware";
import type { GlobalStore } from '../types';
import {createThemeSlice, initialThemeState} from './slices/theme';
import { createLayoutSlice,initialLayoutState } from './slices/layout';
import { createSiteSlice, initialSiteState} from "./slices/site";


export const initialGlobalState = {
    ...initialThemeState,
    ...initialLayoutState,
    ...initialSiteState,
}

/**
 * 需要持久化的状态字段
 * 排除临时性状态如 mobileMenuOpen, themeDrawer, breadcrumb
 */
const persistedKeys: (keyof typeof initialGlobalState)[] = [
    'layout',
    'menuParentKey',
];

export const useGlobalStore = create<GlobalStore>()(
  devtools(
      persist(
          (...args)=>({
              ...createSiteSlice(...args),
              ...createThemeSlice(...args),
              ...createLayoutSlice(...args),

          }),
          {
               name: 'global-data-storage',
               storage: createJSONStorage(()=>localStorage),
               partialize: (state) =>{
                   const persisted: Partial<typeof initialGlobalState> = {};
                   for (const key of persistedKeys) {
                       if (key in state) {
                           (persisted as Record<string, unknown>)[key] = state[key as keyof GlobalStore];
                       }
                   }
                   return persisted;
               }
          }
      ),
      {
        name: 'global-store'
      }
  )
);


/**
 * 导出类型供外部使用
 */
export type { GlobalStore } from '../types';