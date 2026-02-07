import {FC, ReactNode} from 'react'
import BreadcrumbRender from '@/layouts/BreadcrumbRender'
import { PageContainer } from '@ant-design/pro-components'

export interface ICustomerPageProps {
    title: string;
    children: ReactNode;
}

const CustomerPageContainer:FC<ICustomerPageProps> = (props: ICustomerPageProps )=>{
    const {title,children} = props;
    return(
        <PageContainer
            header={{
                title: title,
                breadcrumb: <BreadcrumbRender />
            }}
        >
            {children}
        </PageContainer>
    )
}

export default CustomerPageContainer;