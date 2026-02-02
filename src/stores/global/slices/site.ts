import type { StateCreator } from 'zustand';
import type { GlobalStore, SiteState, SiteAction } from '@/stores/types';

export type SiteSlice = SiteState & SiteAction;

export const initialSiteState: SiteState = {
    title: 'antd pro',
    logo: 'http://192.168.1.250/assets/images/logo.png',
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

