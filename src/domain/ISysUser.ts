export default interface ISysUser {
    /** 用户ID  **/
    id?: number;
    /** 用户名 */
    username?: string;
    /** 部门ID */
    department_id?: number;
    /**职务 id*/
    post_id?: number;
    name?: string;
    email?: string;
    email_verified_at?: string;
    telephone?: string;
    avatar?:string;
    last_login_ip?: string;
    last_login_time?: string;
    /** 用户状态 */
    status?: number;
    /**排序*/
    sort?: number;
    /** 创建时间 */
    created_at?: string;
    /** 创建时间 */
    updated_at?: string;
    /** 删除时间*/
    deleted_at?: string;
}