export interface ISysPermission {
    /** 角色ID */
    id?: number;
    /** 角色名称 */
    name?: string;
    /** 父 */
    parent_id?: number;
    locale?: string;
    type?: string;
    /**唯一标识*/
    slug?:string;
    http_method?: string;
    http_path?: string;
    /** 排序 */
    sort?: number;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
}