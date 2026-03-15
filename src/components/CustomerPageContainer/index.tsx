import {FC, ReactNode} from 'react'
import BreadcrumbRender from '@/layouts/BreadcrumbRender'
import { PageContainer } from '@ant-design/pro-components'

export interface ICustomerPageProps {
    title: string;
    children: ReactNode;
    extra?: ReactNode;
}

const CustomerPageContainer:FC<ICustomerPageProps> = ({
  title,
  children,
  extra
} )=>{

    return(
        <PageContainer
            header={{
                title: title,
                breadcrumb: <BreadcrumbRender />
            }}
            extra={extra}
        >
            {children}
        </PageContainer>
    )
}

export default CustomerPageContainer;