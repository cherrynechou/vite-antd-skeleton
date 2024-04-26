import { Suspense } from "react";
import { PageLoading } from "@ant-design/pro-layout";

const lazyLoad = (Component: any) => {
    return (
        <Suspense fallback={<PageLoading/>}>
            <Component />
        </Suspense>

    )
}

export default lazyLoad