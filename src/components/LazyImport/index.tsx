import { PageLoading } from '@ant-design/pro-components'
import { ComponentType, FC, LazyExoticComponent, Suspense } from 'react'

export const LazyImport: FC<{ lazy: LazyExoticComponent<ComponentType> }> = ({ lazy: Component }) => {
    return (
        <Suspense fallback={<PageLoading />}>
            <Component />
        </Suspense>
    )
}

