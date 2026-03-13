import {FC, useState} from "react";
import {ICreateOrEditProps} from "@/interfaces/modal.ts";
import {App, Form, Input, InputNumber, Modal, Skeleton, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {useAsyncEffect} from "ahooks";

const { TextArea } = Input;

const CreateOrEdit:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title'): t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async ()=>{
        try {
            if(editId !== undefined){

            }else{
                form.setFieldsValue({
                    sort:  1,
                    status: 1
                })
            }
        }catch (error: any){

        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);

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
                    <Form form={form} initialValues={initialValues} autoComplete="off">
                        <Form.Item
                            name="name"
                            label={
                                t('modal.createOrUpdateForm.name')
                            }
                            labelCol={{ span: 3 }}
                            rules={[
                                {
                                    required: true,
                                    message: t('modal.createOrUpdateForm.name.required')
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
                                t('modal.createOrUpdateForm.code')
                            }
                            labelCol={{ span: 3 }}
                            rules={[
                                {
                                    required: true,
                                    message: t('modal.createOrUpdateForm.code.required')
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.code.placeholder')
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
                            <InputNumber
                                style={{ width: 400 }}
                                placeholder={
                                    t('modal.createOrUpdateForm.sort.placeholder')
                                }
                            />
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
                                checkedChildren={t('global.switch.checked.label')}
                                unCheckedChildren={t('global.switch.unChecked.label')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="remark"
                            label={
                                t('modal.createOrUpdateForm.remark')
                            }
                            labelCol={{ span: 3 }}
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

export default CreateOrEdit