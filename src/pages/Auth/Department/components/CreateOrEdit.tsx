import {FC, useState} from "react";
import {App, Form, Input, InputNumber, Modal, Select, Skeleton, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {useAsyncEffect} from "ahooks";
import {buildAntdTreeData, treeToOrderList} from "@/utils/utils";
import {createDepartment, getDepartment, updateDepartment} from "@/api/auth/DepartmentController";



export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    departmentData: any[],
    actionRef: any
}

const CreateOrEdit : FC<ICreateOrEditProps> = (props: any)=>{
    const { t } = useTranslation();
    const [treeData, setTreeData] = useState<any>([]);
    const [initialValues, setInitialValues] = useState<any>({});

    const { isModalVisible, isShowModal, editId, departmentData, actionRef } = props;

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title'): t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        const orderList = treeToOrderList(departmentData);
        const treeValues = buildAntdTreeData(orderList,{
            rootLabel: t('global.tree.root')
        })
        setTreeData(treeValues);

        if(editId !== undefined){
            const departmentRes = await getDepartment(editId);
            const currentData = departmentRes.data;

            setInitialValues({
                name: currentData.name,
                parent_id: currentData.parent_id,
                principal: currentData.principal,
                email: currentData.email,
                telephone: currentData.telephone,
                sort: currentData.sort,
                status: currentData.status,
            })


        }else{
            form.setFieldsValue({
                sort: 1,
                status: 1
            })
        }
    }


    useAsyncEffect(async () => {
        await fetchApi();
    }, []);

    //表单提交
    const handleOk = async() =>{
        try {
            const fieldsValue = await form.validateFields();

            if (editId === undefined) {
                await createDepartment(fieldsValue );
            } else {
                await updateDepartment(editId, fieldsValue );
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
                    <Form form={form} initialValues={initialValues} autoComplete="off">
                        {/* 父级对象*/}
                        <Form.Item
                            name="parent_id"
                            label={
                                t('modal.createOrUpdateForm.parent')
                            }
                            labelCol={{ span: 3 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.parent.required')
                                    )
                                }
                            ]}
                        >
                            <Select
                                options={treeData}
                                style={{ width: 400 }}
                                placeholder={
                                    t('modal.createOrUpdateForm.parent.placeholder')
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label={
                                t('modal.createOrUpdateForm.department.name')
                            }
                            labelCol={{ span: 3 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.department.name.required')
                                    )
                                }
                            ]}
                        >
                            <Input
                                placeholder={
                                    t('modal.createOrUpdateForm.department.name.placeholder')
                                }
                                style={{ width: 500 }}
                            />
                        </Form.Item>

                        {/*部门负责人*/}
                        <Form.Item
                            name="principal"
                            label={
                                t('modal.createOrUpdateForm.department.principal')
                            }
                            labelCol={{ span: 3 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.department.principal.placeholder')
                            }
                            />
                        </Form.Item>

                        {/*手机号*/}
                        <Form.Item
                            name="telephone"
                            label={
                                t('modal.createOrUpdateForm.telephone')
                            }
                            labelCol={{ span: 3 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.telephone.placeholder')
                            }
                            />
                        </Form.Item>

                        {/*邮箱*/}
                        <Form.Item
                            name="email"
                            label={
                                t('modal.createOrUpdateForm.email')
                            }
                            labelCol={{ span: 3 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.email.placeholder')
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
                )
            }
        </Modal>
    )
}

export default CreateOrEdit;