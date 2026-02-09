import {FC, useState} from "react";
import {App, Form, Input, Modal, Skeleton, Switch} from "antd";
import {ICreateOrEditProps} from "@/interfaces/modal.ts";
import {useTranslation} from "react-i18next";
import { useAsyncEffect } from 'ahooks';
import {createDict, getDict, updateDict} from "@/api/auth/DictController.ts";

const { TextArea } = Input;

const CreateOrEdit:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [form] = Form.useForm();
    const { message} = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        if (editId !== undefined) {
            const res = await getDict(editId);
            const currentData = res.data;
            setInitialValues({
                name: currentData.name,
                code: currentData.code,
                status: currentData.status,
                remark: currentData.remark
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
        try {
            const fieldsValue = await form.validateFields();

            //最终提交数据格式化
            const transformedData  = {
                ...fieldsValue,
                status: fieldsValue.status ? 1 : 0
            }

            if(editId === undefined){
                await createDict(transformedData)
            }else{
                await updateDict(editId,transformedData);
            }
            isShowModal(false);

            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');

            message.success(defaultUpdateSuccessMessage);
            actionRef.current.reload();
        }catch (error: any){
            message.error(error.data.message);
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
                            name="code"
                            label={
                                t('modal.createOrUpdateForm.dict.code')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.dict.code.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.dict.code.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label={
                                t('modal.createOrUpdateForm.status')
                            }
                            labelCol={{ span: 4 }}
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

                        <Form.Item
                            name="remark"
                            label={
                                t('modal.createOrUpdateForm.remark')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <TextArea
                                placeholder={
                                    t('modal.createOrUpdateForm.remark.placeholder')
                                }
                            />

                        </Form.Item>
                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEdit;