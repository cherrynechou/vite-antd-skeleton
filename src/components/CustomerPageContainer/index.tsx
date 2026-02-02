import {FC, ReactNode} from 'react'
import BreadcrumbRender from '@/layouts/BreadcrumbRender'
import { PageContainer } from '@ant-design/pro-components'

export interface ICustomerPageProps {
    title: string;
    children: ReactNode;
}

const CustomerPageContainer:FC<ICustomerPageProps> = (props: ICustomerPageProps )=>{
    return(
        <PageContainer
            header={{
                title: props.title,
                breadcrumb: <BreadcrumbRender />
            }}
        >
            {props.children}
        </PageContainer>
    )
}

export default CustomerPageContainer;