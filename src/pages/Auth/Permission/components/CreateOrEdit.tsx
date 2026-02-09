import {FC, useState} from 'react'
import {App, Form, Input, Modal, Select, Skeleton} from "antd";
import {useTranslation} from "react-i18next";
import {useAsyncEffect} from "ahooks";
import {buildAntdTreeData, treeToOrderList} from "@/utils/utils.ts";
import {
    createPermission,
    queryAllPermissionRoutes,
    queryPermission,
    updatePermission
} from "@/api/auth/PermissionController";

/**
 * 创建菜单通用
 */
export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | undefined,
    permissionTreeData: any[],
    actionRef: any
}

const CreateOrEdit : FC<ICreateOrEditProps>=(props: any)=>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const [treeData, setTreeData] = useState<any>([]);
    const [httpMethods, setHttpMethods] = useState<any>([]);
    const [httpPaths, setHttpPaths] = useState<any>([]);

    const [ form] = Form.useForm();

    const { isModalVisible, isShowModal, permissionTreeData, editId, actionRef } = props;

    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        const orderList = treeToOrderList(permissionTreeData);

        setTreeData(buildAntdTreeData(orderList,{
            rootLabel: t('global.tree.root')
        }));

        const allMethods: any[] = [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' },
            { label: 'PATCH', value: 'PATCH' },
            { label: 'OPTIONS', value: 'OPTIONS' },
            { label: 'HEAD', value: 'HEAD' },
        ];
        setHttpMethods(allMethods);

        const pathsRes = await queryAllPermissionRoutes();

        const _pathData = pathsRes.data;
        const _pathValues: any[] = [];
        for (const key in _pathData) {
            if (_pathData.hasOwnProperty(key)) {
                _pathValues.push({
                    label: _pathData[key],
                    value: _pathData[key],
                });
            }
        }
        setHttpPaths(_pathValues);

        if (editId !== undefined) {
            const permissionRes = await queryPermission(editId);
            const currentData = permissionRes.data;
            let methods: any[] = [];
            if (!currentData.methods.includes('ANY')) {
                methods = currentData.methods;
            }

            setInitialValues({
                parent_id: currentData.parent_id,
                name: currentData.name,
                slug: currentData.slug,
                http_method: methods,
                http_path: currentData.paths,
            });
        }
    }


    useAsyncEffect(async () => {
        await fetchApi();
    }, []);


    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();

            if (editId === undefined) {
                await createPermission(fieldsValue);
            } else {
                await updatePermission(editId, fieldsValue);
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
            {Object.keys(initialValues).length === 0 && editId !== undefined ? (<Skeleton paragraph={{ rows: 4 }} />) : (
                <Form
                    name="permission-create"
                    form={form}
                    initialValues={initialValues}
                    autoComplete="off"
                >
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
                        ]}
                    >
                        <Input
                            placeholder={
                                t('modal.createOrUpdateForm.name.placeholder')
                            }
                        />
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
                        ]}
                    >
                        <Input placeholder={
                            t('modal.createOrUpdateForm.slug.placeholder')
                        }/>
                    </Form.Item>

                    <Form.Item
                        name="http_method"
                        label={
                            t('modal.createOrUpdateForm.httpMethod')
                        }
                        labelCol={{ span: 3 }}>
                        <Select
                            mode="multiple"
                            options={httpMethods}
                            style={{ width: 600 }}
                            placeholder={
                                t('modal.createOrUpdateForm.httpMethod.placeholder')
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="http_path"
                        label={
                            t('modal.createOrUpdateForm.httpPath')
                        }
                        labelCol={{ span: 3 }}
                    >
                        <Select
                            mode="multiple"
                            options={httpPaths}
                            style={{ width: 400 }}
                            placeholder={
                                t('modal.createOrUpdateForm.httpPath.placeholder')
                            }
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    )
}

export default CreateOrEdit;