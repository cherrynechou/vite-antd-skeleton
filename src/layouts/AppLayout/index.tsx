import { FC, useEffect } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { useTranslation } from "react-i18next";
/**
 * 设置窗口文本
 * @constructor
 */
const AppLayout: FC = () =>{
    const matches = useMatches();
    const { t } = useTranslation();

    useEffect(()=>{
        const titleKey = (matches[matches.length - 1].handle as any)?.titleKey;

        const isHasTitle = typeof titleKey === "string";
        if(isHasTitle){
            document.title = t(titleKey);
        }

    },[matches]);

    return (
        <Outlet/>
    )
}

export default AppLayout;