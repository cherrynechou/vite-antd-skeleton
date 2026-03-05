import {FC, useState} from "react";
import {App, Form, Modal} from "antd";
import {useTranslation} from "react-i18next";

export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    actionRef: any
}

const CreateOrEditConfig:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [form] = Form.useForm();
    const { message} = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const handleOk = () =>{
        
    }

    return (
        <Modal
            title={title}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => isShowModal(false)}
            destroyOnHidden
            width={750}
        >

        </Modal>
    )
}

export default CreateOrEditConfig;