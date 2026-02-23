import {FC, useState} from "react";
import { useTranslation } from "react-i18next";
import {useAsyncEffect} from "ahooks";
import {getDict} from "@/api/auth/DictController.ts";
import {createDictData, getDictData, updateDictData} from "@/api/auth/DictDataController.ts";
import {App, Form, Input, InputNumber, Modal, Skeleton, Switch} from "antd";

export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    dictId: number | undefined,
    actionRef: any
}

const { TextArea } = Input;

/**
 * 数据项
 * @param props
 * @constructor
 */
const CreateOrEditDictData:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const { isModalVisible, isShowModal, editId, dictId, actionRef } = props;

    const [form] = Form.useForm();
    const { message} = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    console.log(editId,dictId);

    const fetchApi = async () => {
        const dictRes = await getDict(dictId);
        const dictData = dictRes.data;

        if (editId !== undefined) {
            const res = await getDictData(editId);
            const currentData = res.data;
            setInitialValues({
                dict_id: currentData.dictId,
                label: currentData.label,
                value: currentData.value,
                sort: currentData.sort,
                status: currentData.status,
                is_default: currentData.isDefault,
                code: dictData.code
            })
        }else{
            form.setFieldsValue({
                sort: 1,
                status: 1,
                code: dictData.code,
                is_default: 0,
                dict_id: dictId
            })
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);

    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();

            if(editId === undefined){
                await createDictData(fieldsValue)
            }else{
                await updateDictData(editId,fieldsValue);
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
                            name="label"
                            label={
                                t('modal.createOrUpdateForm.dict.data.label')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.dict.data.label.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.dict.data.label.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="dict_id"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>

                        <Form.Item
                            name="code"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>

                        <Form.Item
                            name="value"
                            label={
                                t('modal.createOrUpdateForm.dict.data.value')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.dict.data.value.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.dict.data.value.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="sort"
                            label={
                                t('modal.createOrUpdateForm.sort')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <InputNumber />
                        </Form.Item>

                        <Form.Item
                            name="is_default"
                            label={
                                t('modal.createOrUpdateForm.default')
                            }
                            labelCol={{ span: 4 }}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={t('global.switch.true.label')}
                                unCheckedChildren={t('global.switch.false.label')}
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
                                checkedChildren={t('global.switch.checked.label')}
                                unCheckedChildren={t('global.switch.unChecked.label')}
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

export default CreateOrEditDictData;