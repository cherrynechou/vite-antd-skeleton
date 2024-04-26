import { Suspense,LazyExoticComponent } from 'react';
import { PageLoading } from '@ant-design/pro-layout';

/**
 * @description 路由懒加载
 * @param {Element} Component 需要访问的组件
 * @returns element
 */
const lazyLoad = (Component: LazyExoticComponent<any>): React.ReactNode => {
    return (
        <Suspense fallback={<PageLoading/>}>
            <Component />
        </Suspense>
    )
}

export default lazyLoad