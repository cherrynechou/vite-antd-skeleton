import {FC, ReactNode} from 'react'
import BreadcrumbRender from '@/layouts/BreadcrumbRender'
import { PageContainer } from '@ant-design/pro-components'

export interface ICustomerPageProps {
    title: string;
    children: ReactNode;
    extra?: ReactNode;
    style?: CSSProperties;
}

const CustomerPageContainer:FC<ICustomerPageProps> = ({
  title,
  children,
  extra,
  style
} )=>{

    return(
        <PageContainer
            header={{
                title: title,
                breadcrumb: <BreadcrumbRender />
            }}
            extra={extra}
            style={style}
        >
            {children}
        </PageContainer>
    )
}

export default CustomerPageContainer;