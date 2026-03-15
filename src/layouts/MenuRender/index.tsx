import {Menu, MenuProps, theme} from "antd";
import {useTranslation} from "react-i18next";
import useMenuStore from "@/stores/menu";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useGlobalStore} from "@/stores";
import {useLocation, useNavigate} from "react-router-dom";
import {IMenu} from "@/domain/ISysMenu.ts";
import IconFont from "@/components/IconFont";
type MenuItem = Required<MenuProps>['items'][number];

const MenuRender = () =>{
    const { t } = useTranslation();
    const menus = useMenuStore(state => state.menus);
    const menuMap = useMenuStore(state => state.menuMap);
    const menuList = useMenuStore(state => state.menuList);
    const [selectedKeys, setSelectedKeys] = useState<any>([]); // 选中菜单项
    const [openKeys, setOpenKeys] = useState<any>([]); // 子菜单展开状态
    const breadcrumbMap = useMenuStore(state => state.breadcrumbMap);
    const collapsed = useGlobalStore(state => state.collapsed);
    const layout = useGlobalStore(state => state.layout);
    const menuParentKey = useGlobalStore(state => state.menuParentKey);
    const setBreadcrumb = useGlobalStore(state=>state.setBreadcrumb);

    const navigate = useNavigate();
    const location = useLocation();

    // 当页面路由跳转时，即location发生改变，则更新选中项
    useEffect(() => {
        const currentPath = location.pathname;
        const currentNode = menuList.find(item=>item.path == currentPath);

        if(currentNode?.key !== undefined) {
            const splitNodes = currentNode.key.split(".")

            const currentMenu: IMenu = menuMap[currentNode.key];
            //TS2538: Type undefined cannot be used as an index type.
            if(currentMenu.key !== undefined){
                setBreadcrumb(breadcrumbMap[currentMenu.key]);
            }

            const newSplitNodes: any[] = splitNodes.reduce((acc: any[], current:string) => {
                const last =acc.length>0 ? acc[acc.length-1] + '.' + current: current;
                return [...acc, last];
            },[]);
            //删除最后一个元素
            newSplitNodes.pop();

            //父节点
            setOpenKeys(newSplitNodes);
            //子节点
            setSelectedKeys([currentNode.key]);
            //当前打开的项目
            localStorage.setItem('menu-open-keys', JSON.stringify(newSplitNodes));
        }
    }, [location.pathname]);

    //collapsed为false时打开   为true是关闭
    useEffect(() => {
        if(!collapsed){
            const menuOpenKeys = localStorage.getItem('menu-open-keys');
            if(menuOpenKeys){
                setOpenKeys(JSON.parse(menuOpenKeys));
            }
        }
    }, [collapsed]);

    //菜单项转换
    const transformMenus = (nodes: IMenu[],t: any): MenuItem[] =>{
        return nodes.reduce<MenuItem[]>((acc, node) => {
            if (!node.visible) {
                return acc;
            }

            const menuItem: MenuItem = {
                label: node.locale ? t(node.locale) : node.name,
                icon: node.icon ? <IconFont name={node.icon} /> : undefined,
                key: node.key!,
            };

            // 仅当有子菜单时才递归处理
            if (node.children?.length) {
                (menuItem as any).children = transformMenus(node.children,t);
            }

            acc.push(menuItem);
            return acc;
        }, []);
    };

    // 使用 useMemo 缓存菜单数据源
    const menuSource = useMemo(() => {
        if (layout === 'mix' || layout === 'columns') {
            const rule = menus.find(item => item.key === menuParentKey);
            return rule?.children || [];
        }
        return menus;
    }, [menus, layout, menuParentKey]);

    // 使用 useMemo 缓存转换后的菜单项
    const menuItems = useMemo(() => {
        return transformMenus(menuSource,t);
    }, [menuSource,t]);

    const menuClick:MenuProps['onClick'] = useCallback((current: any)=>{
        const menu: IMenu = menuMap[current.key];

        if(menu.is_back_link){
            window.open(menu.url, menu.target);
        }else{
            navigate({
                pathname: menu.path
            });
        }
    },[menuMap, navigate])

    const onOpenChange=(newOpenKeys: any)=>{
        console.log(newOpenKeys);
        setOpenKeys(newOpenKeys);
    }

    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys} // 选中项绑定路由
            openKeys={openKeys} // 展开项
            onOpenChange={onOpenChange}
            items={menuItems}
            onClick={menuClick}
        />
    )
}

export default MenuRender;