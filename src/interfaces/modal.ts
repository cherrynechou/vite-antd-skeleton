/**
 * 创建菜单通用
 */
export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    actionRef: any
}