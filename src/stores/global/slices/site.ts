import type { StateCreator } from 'zustand';
import type { GlobalStore, SiteState, SiteAction } from '@/stores/types';

export type SiteSlice = SiteState & SiteAction;

export const initialSiteState: SiteState = {
    logo: 'http://192.168.1.250/assets/images/logo.png',
    title: 'antd pro',
    subtitle: "基于 Ant Design 的后台管理框架",
    describe: "Xin Admin 是一个基于 Ant Design 的后台管理框架",
    documentTitle: "Xin Admin",
}


export const createSiteSlice: StateCreator<GlobalStore, [], [], SiteSlice> = (set)=>({
   ...initialSiteState,

    initWebInfo:async ()=>{

    },

    setDocumentTitle: (documentTitle: string) => {
        set({ documentTitle });
    },
});

