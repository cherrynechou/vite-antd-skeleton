import {FC, useState} from "react";
import {App, Form, Input, Modal, Skeleton} from "antd";
import { useAsyncEffect } from 'ahooks';
import {useTranslation} from "react-i18next";
import {getGroup, createGroup, updateGroup} from "@/api/auth/ConfigGroupController";

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

    const fetchApi = async () => {
        if (editId !== undefined) {
            const res = await getGroup(editId);
            const currentData = res.data;
            setInitialValues({
                name: currentData.name,
                key: currentData.key
            })
        }else{
            form.setFieldsValue({
                status: 1
            })
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);


    const handleOk = async () =>{
        try{
            const fieldsValue = await form.validateFields();

            if (editId === undefined) {
                await createGroup(fieldsValue);
            } else {
                await updateGroup(editId, fieldsValue);
            }
            isShowModal(false);
            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');
            message.success(defaultUpdateSuccessMessage);
            actionRef.current.reload();
        }catch (error: any){
            message.error(error.message);
        }
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
                Object.keys(initialValues).length === 0 && editId !== undefined ? (<Skeleton paragraph={{ rows: 4 }} />) : (
                    <Form
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="name"
                            label={
                                t('modal.createOrUpdateForm.name')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.name.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.name.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="key"
                            label={
                                t('modal.createOrUpdateForm.config.group.key')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.config.group.key.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.group.key.placeholder')
                            }
                            />
                        </Form.Item>



                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEditConfig;