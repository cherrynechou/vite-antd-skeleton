import { RouteObject, useRoutes } from 'react-router-dom';

/** 动态创建路由（<Routes>和<Route>） */
export const Router = ({ routes }: { routes: RouteObject[] }) => useRoutes(routes)