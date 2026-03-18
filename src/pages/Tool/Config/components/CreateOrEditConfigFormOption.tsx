import {FC, useState} from "react";
import {App, Button, Col, Drawer, Form, Input, Row, Skeleton, Space} from "antd";
import {useTranslation} from "react-i18next";
import {useAsyncEffect} from "ahooks";
import {getConfigOptions, updateConfigOptions} from "@/api/auth/SettingController.ts";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

export interface ICreateOrEditProps  {
    isDrawerVisible: boolean;
    isShowDrawer: (show: boolean, id?: number | undefined) => void;
    editId : number | undefined;
    actionRef: any;
}

const CreateOrEditConfigFormOption:FC<ICreateOrEditProps> = (props: any) =>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const { isDrawerVisible, isShowDrawer, editId, actionRef } = props;

    const { message } = App.useApp();
    const [form] = Form.useForm();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () =>{
        if(editId !== undefined){
            const optionRes = await getConfigOptions(editId);
            const currentData = optionRes.data;
            setInitialValues({
                options: currentData.options,
                value: currentData.value
            })
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);


    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();
            await updateConfigOptions(editId,fieldsValue);

            isShowDrawer(false);
            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');
            message.success(defaultUpdateSuccessMessage);
            actionRef.current.reload();
        }catch (error: any){
            message.error(error.data.message);
        }
    }

    /**
     * 渲染footer
     */
    const renderFooter =  () =>{
        return (
            <div style={{ textAlign: "right" }}>
                <Space>
                    <Button onClick={()=>isShowDrawer(false)}>取消</Button>
                    <Button type="primary" onClick={handleOk}>
                        确定
                    </Button>
                </Space>
            </div>
        )
    }

    return (
        <Drawer
            title={title}
            open={isDrawerVisible}
            onClose={() => isShowDrawer(false)}
            footer={renderFooter()}
            size={750}
        >
            {
                Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> : (
                    <Form
                        name="config-option-update"
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Row gutter={24}> {/* gutter设置列间距 */}
                            <Col span={4}>
                                {t('modal.createOrUpdateForm.config.options')}
                            </Col>
                            <Col span={20}>
                                <Form.List name="options">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{ display: 'flex', marginBottom: 8 }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'value']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: (
                                                                    t('modal.createOrUpdateForm.config.options.value.required')
                                                                )
                                                            }
                                                        ]}
                                                    >
                                                        <Input
                                                            placeholder={
                                                                t('modal.createOrUpdateForm.config.options.value.placeholder')
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'label']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: (
                                                                    t('modal.createOrUpdateForm.config.options.label.required')
                                                                )
                                                            }
                                                        ]}
                                                    >
                                                        <Input
                                                            placeholder={
                                                                t('modal.createOrUpdateForm.config.options.label.placeholder')
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add field
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Col>
                        </Row>

                        <Form.Item
                            name="value"
                            label={
                                t('modal.createOrUpdateForm.config.options.default')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.config.options.default.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.config.options.default.placeholder')
                            }
                            />
                        </Form.Item>



                    </Form>
                )
            }
        </Drawer>
    )
}

export default CreateOrEditConfigFormOption;