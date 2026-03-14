export interface IMenu {
    id?: number,
    /** 上级ID，顶级菜单的 pid 为 0 */
    parentId?: number,
    /** 权限的唯一标识 */
    key?: string;
    /** 类型 */
    type?: number,
    /** 名称 */
    name?: string;
    /** 菜单的路径，menu 的路径会被当作前缀路由 */
    path?: string;
    /** 路由的图标 */
    icon?: string;
    /**是否为外链*/
    is_back_link?: boolean;
    /** 目标  */
    target?: string;
    /** 目标地址 **/
    url?: string;
    /** 多语言 */
    locale?: string;
    /** 是否隐藏 */
    visible?: number;
    /**   树叶           */
    isLeaf?: boolean;
    /** 子菜单 */
    children?: IMenu[]
}



