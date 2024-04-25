import { Suspense } from 'react'
import { PageLoading } from '@ant-design/pro-layout';

const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
    return (
        <Suspense fallback={<PageLoading />}>
            <Component />
        </Suspense>
    )
}

export default lazyLoad