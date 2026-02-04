import { FC } from 'react'
import {App, Form, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {ICreateOrEditProps} from "@/interfaces/modal.ts";

const CreateOrEdit : FC<ICreateOrEditProps>=(props: any)=>{
    const { t } = useTranslation();
    const { isModalVisible, isShowModal, editId, menuData } = props;



    const [form] = Form.useForm();
    const { message } = App.useApp();


    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const handleOk = async () => {

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

export default CreateOrEdit;