/**
 * 创建菜单通用
 */

export interface ICreateOrEditModalProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number,
    actionRef: any
}