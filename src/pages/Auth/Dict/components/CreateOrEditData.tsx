import {FC} from "react";
import {ICreateOrEditProps} from "@/interfaces/modal.ts";
import {Modal} from "antd";
import {useTranslation} from "react-i18next";

const CreateOrEditData:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const handleOk = () =>{

    }

    return (
        <Modal
            title={t('modal.dict.data')}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => isShowModal(false)}
            destroyOnHidden
            width={1000}
        >
        </Modal>
    )
}

export default CreateOrEditData;