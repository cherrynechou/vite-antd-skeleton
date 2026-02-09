import { FC, useState } from 'react'
import {App, Form, Input, InputNumber, Modal, Skeleton, Switch, Tree} from 'antd';
import { useTranslation } from 'react-i18next';
import { ICreateOrEditProps } from "@/interfaces/modal.ts";
import { useAsyncEffect } from "ahooks";
import {createRole, getRoleById, updateRole} from "@/api/auth/RoleController";

const CreateOrEdit : FC<ICreateOrEditProps> = (props: any)=>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        try{
            if(editId !== undefined){
                const roleRes = await getRoleById(editId);
                const currentData = roleRes.data;
                setInitialValues({
                    name: currentData.name,
                    slug: currentData.slug,
                    sort: currentData.sort,
                    status: currentData.status
                });
            }else{
                form.setFieldsValue({
                    sort: 1,
                    status: 1
                })
            }
        }catch (error: any){
            console.log(error);
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);

    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();

            //最终提交数据格式化
            const transformedData  = {
                ...fieldsValue,
                status: fieldsValue.status ? 1 : 0
            }

            if (editId === undefined) {
                await createRole(transformedData);
            } else {
                await updateRole(editId, transformedData);
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
                Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> : (
                    <Form
                        name="role-update-or-create"
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="name"
                            label={
                                t('modal.createOrUpdateForm.name')
                            }
                            labelCol={{ span: 3 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.name.required')
                                    )
                                }
                            ]}>
                            <Input placeholder={
                                t('modal.createOrUpdateForm.name.placeholder')
                            } />
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label={
                                t('modal.createOrUpdateForm.slug')
                            }
                            labelCol={{ span: 3 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.slug.required')
                                    )
                                }
                            ]}>
                            <Input placeholder={
                                t('modal.createOrUpdateForm.slug.placeholder')
                            }
                            />
                        </Form.Item>


                        <Form.Item
                            name="sort"
                            label={
                                t('modal.createOrUpdateForm.sort')
                            }
                            labelCol={{ span: 3 }}
                        >
                            <InputNumber />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label={
                                t('modal.createOrUpdateForm.status')
                            }
                            labelCol={{ span: 3 }}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={
                                    t('global.switch.checked.label')
                                }
                                unCheckedChildren={
                                    t('global.switch.unChecked.label')
                                }
                            />
                        </Form.Item>
                    </Form>
            )}
        </Modal>
    )
}

export default CreateOrEdit;