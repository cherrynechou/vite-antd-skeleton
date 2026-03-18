import {FC, useState} from "react";
import {App, Form, Input, InputNumber, Modal, Radio, Select, Skeleton, Space} from "antd";
import {useTranslation} from "react-i18next";
import {createConfigData, getConfigData, updateConfigData} from "@/api/auth/ConfigController";
import {useAsyncEffect} from "ahooks";
import {getGroup} from "@/api/auth/ConfigGroupController.ts";
import {CheckboxGroupProps} from "antd/es/checkbox";

export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    groupId: number | undefined,
    actionRef: any
}

const CreateOrEditConfigFormData:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const [formTypeOptions,setFormTypeOptions] = useState<any>([]);
    const [formType,setFormType] = useState<string>('');
    const [requiredOptions,setRequiredOptions] = useState<CheckboxGroupProps<string>['options']>([]);
    const [visibleOptions,setVisibleOptions] = useState<CheckboxGroupProps<string>['options']>([]);

    const { isModalVisible, isShowModal, editId, groupId, actionRef } = props;

    const [form] = Form.useForm();
    const { message} = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        const groupRes = await getGroup(groupId);
        const groupData = groupRes.data;

        const formType = [
            {
                label: t('modal.createOrUpdateForm.form.config.input'),
                value: 'input'
            },{
                label: t('modal.createOrUpdateForm.form.config.inputNumber'),
                value: 'inputNumber'
            },{
                label: t('modal.createOrUpdateForm.form.config.textArea'),
                value: 'textArea'
            },{
                label: t('modal.createOrUpdateForm.form.config.select'),
                value: 'select'
            },{
                label: t('modal.createOrUpdateForm.form.config.radio'),
                value: 'radio'
            },{
                label: t('modal.createOrUpdateForm.form.config.switch'),
                value: 'switch'
            }
        ];

        setFormTypeOptions(formType);

        //是否必须
        const require: CheckboxGroupProps<string>['options']=[
            { label: '是', value: 'yes' },
            { label: '否', value: 'no' },
        ]
        setRequiredOptions(require);

        //是否隐藏
        const visible: CheckboxGroupProps<string>['options']=[
            { label: '是', value: 'yes' },
            { label: '否', value: 'no' },
        ]
        setVisibleOptions(visible);

        if (editId !== undefined) {
            const res = await getConfigData(editId);
            const currentData = res.data;
            setInitialValues({
                group_id: groupId,
                group_key: groupData.key,
                key: currentData.key,
                label: currentData.label,
                type: currentData.type,
                rows: currentData.rows,
                placeholder: currentData.placeholder,
                is_required: currentData.is_required == 0 ? 'no' : 'yes',
                is_visible: currentData.is_visible== 0 ? 'no' : 'yes'
            })

            setFormType(currentData.type);
        }else{
            form.setFieldsValue({
                group_id: groupId,
                group_key: groupData.key,
                status: 1,
                rows: 4,
                is_required: 'no',
                is_visible: 'no',
            })
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);

    //类型变化
    const onSelectFormTypeChange = (value: string) =>{
        setFormType(value);
    }


    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();
            //最终提交数据格式化
            const transformedData  = {
                ...fieldsValue,
                is_required: fieldsValue.is_required == "yes" ? 1 : 0,
                is_visible: fieldsValue.is_visible == "yes" ? 1 : 0
            }

            if(editId === undefined){
                await createConfigData(transformedData);
            }else{
                await updateConfigData(editId,transformedData);
            }
            isShowModal(false);
            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');
            message.success(defaultUpdateSuccessMessage);
            actionRef?.current?.reload();
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
                            name="group_id"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>

                        <Form.Item
                            name="group_key"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>

                        <Form.Item
                            name="label"
                            label={
                                t('modal.createOrUpdateForm.config.label')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.config.label.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.config.label.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="key"
                            label={
                                t('modal.createOrUpdateForm.config.key')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.config.key.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.config.key.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label={
                                t('modal.createOrUpdateForm.config.type')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Select
                                options={formTypeOptions}
                                onChange={onSelectFormTypeChange}
                                style={{ width: 400 }}
                                placeholder={
                                    t('modal.createOrUpdateForm.config.type.placeholder')
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="style"
                            label={
                                t('modal.createOrUpdateForm.config.style')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.config.style.placeholder')
                            }
                            />
                        </Form.Item>

                        {formType == 'textArea' &&
                            <Form.Item
                                name="rows"
                                label={
                                    t('modal.createOrUpdateForm.config.rows')
                                }
                                labelCol={{ span: 4 }}
                            >
                                <InputNumber
                                    style={{width: 100}}
                                    placeholder={
                                        t('modal.createOrUpdateForm.config.rows.placeholder')
                                    }
                                />
                            </Form.Item>
                        }

                        <Form.Item
                            name="placeholder"
                            label={
                                t('modal.createOrUpdateForm.config.placeholder')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.config.placeholder.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="rule"
                            label={
                                t('modal.createOrUpdateForm.config.rule')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.config.rule.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="is_required"
                            label={
                                t('modal.createOrUpdateForm.config.is_required')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Radio.Group
                                options={requiredOptions}
                            />
                        </Form.Item>

                        <Form.Item
                            name="is_visible"
                            label={
                                t('modal.createOrUpdateForm.config.is_visible')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Radio.Group
                                options={visibleOptions}
                            />
                        </Form.Item>


                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEditConfigFormData;