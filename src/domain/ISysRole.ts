export interface ISysRole {
    /** 角色ID */
    id?: number;
    /** 角色名称 */
    name?: string;
    /* 唯一标识 */
    slug?: string;
    /**数据权限 */
    data_scope: number;
    /** 启用状态 */
    status?: number;
    /** 排序 */
    sort?: number;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
}