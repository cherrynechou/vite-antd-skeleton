import {type PropsWithChildren, useMemo} from 'react';
import ContextHolder from "@/components/ContextHolder";
import {App, ConfigProvider, ThemeConfig} from "antd";
import {useGlobalStore} from "@/stores";
import { useAntdLocale } from '@/hooks/useLanguage';
import algorithm from "@/layouts/algorithm.ts";

const AppProvider = ({ children }: PropsWithChildren) => {
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const locale = useAntdLocale();

    const theme: ThemeConfig = useMemo(() => ({
        components: {
            Layout: {
                headerPadding: "0 " + themeConfig.headerPadding + "px",
                headerHeight: themeConfig.headerHeight,
                bodyBg: themeConfig.bodyBg,
                footerBg: themeConfig.footerBg,
                headerBg: themeConfig.headerBg,
                headerColor: themeConfig.headerColor,
                siderBg: themeConfig.siderBg,
                footerPadding: 0
            },
            Menu: {
                activeBarBorderWidth: 0,
                itemBg: 'transparent',
            },
            Input: {
                colorPrimary: 'white',
                borderRadius: 0,
            },
            Select: {
                borderRadius: 0,
            },
            InputNumber: {
                borderRadius: 0,
            },
            Button: {
                backgroundColor: 'transparent',
                borderRadius: 0,
            },
            Modal: {
                borderRadius: 0,
            }
        },
        token: {
            colorPrimary: themeConfig.colorPrimary,
            colorBgBase: themeConfig.colorBg,
            colorTextBase: themeConfig.colorText,
            colorError: themeConfig.colorError,
            colorInfo: themeConfig.colorPrimary,
            colorLink: themeConfig.colorPrimary,
            colorSuccess: themeConfig.colorSuccess,
            colorWarning: themeConfig.colorWarning,
            borderRadius: themeConfig.borderRadius,
            controlHeight: themeConfig.controlHeight,
        },
        algorithm: themeConfig.algorithm ? algorithm[themeConfig.algorithm] : undefined
    }),[themeConfig])

    return (
        <ConfigProvider theme={{...theme }}  locale={locale}>
            <App>
                <ContextHolder />
                {children}
            </App>
        </ConfigProvider>
    );
};

export default AppProvider;