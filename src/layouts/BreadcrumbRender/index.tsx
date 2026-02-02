import {FC, useEffect, useState} from 'react'
import {type BreadcrumbItem, useGlobalStore} from '@/stores';
import { Breadcrumb,type BreadcrumbProps } from 'antd';
import IconFont from "@/components/IconFont";
import {useTranslation} from "react-i18next";

const BreadcrumbRender: FC = () => {
    const {t} = useTranslation();
    const breadcrumb = useGlobalStore(state => state.breadcrumb);
    const [breadcrumbItems,setBreadcrumbItems] = useState<BreadcrumbProps['items']>([]);

    useEffect(() => {
        setBreadcrumbItems([
            ...breadcrumb.map((item:BreadcrumbItem,index: number)     => {
                if(item.href && index !== breadcrumb.length - 1) {
                    return {
                        href: item.href,
                        title: (
                            <>
                                {item.icon && <IconFont name={item.icon} />}
                                <span>{item.locale ? t(item.locale) : item.title}</span>
                            </>
                        ),
                    }
                }else {
                    return {
                        title: (
                            <>
                                {item.icon && <IconFont name={item.icon} />}
                                <span>{item.locale ? t(item.locale) : item.title}</span>
                            </>
                        ),
                    }
                }
            })
        ])
    }, [breadcrumb]);

    return (
         <Breadcrumb items={breadcrumbItems} />
    )
}

export default BreadcrumbRender;