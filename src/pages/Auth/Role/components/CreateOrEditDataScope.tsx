import { FC, useState } from 'react'
import { App, Form, Input, Modal, Select, Skeleton } from "antd";
import { useTranslation } from "react-i18next";

export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | string| undefined,
    actionRef: any
}

const CreateOrEditDataScope:FC<ICreateOrEditProps> = ({
   isModalVisible,
   isShowModal,
   editId,
   actionRef
}) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title'): t('modal.createOrUpdateForm.edit.title');

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
            {
                Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> : (
                    <Form
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >

                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEditDataScope;