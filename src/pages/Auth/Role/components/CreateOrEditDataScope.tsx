import {FC, Key, useCallback, useState} from 'react'
import { App, Form, Input, Modal, Select, Skeleton,Tree } from "antd";
import { useTranslation } from "react-i18next";
import {nanoid} from "nanoid";
import type { TreeProps } from 'antd/es/tree';
import { useAsyncEffect } from "ahooks";
import {getDataScopeByRoleId, getRoleById, updateDataScopeByRoleId} from "@/api/auth/RoleController";
import { queryAllDepartments } from '@/api/auth/DepartmentController';
import {listToTree,filterTreeLeafNode} from '@/utils/utils'

export interface ICreateOrEditProps {
    isModalVisible: boolean,
    isShowModal: (show: boolean, id?: number | undefined) => void,
    editId : number | string | undefined,
    actionRef: any
}

const CreateOrEditDataScope:FC<ICreateOrEditProps> = ({
   isModalVisible,
   isShowModal,
   editId,
   actionRef
}) =>{
    const { t } = useTranslation();
    const [dataScopeType,setDataScopeType] = useState<number>(0);
    const [dataScopeOptions, setDataScopeOptions] = useState<any>([]);
    const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any>([])
    const [treeData, setTreeData] = useState<any>([]);
    const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
    const [initialValues, setInitialValues] = useState<any>({});

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title'): t('modal.createOrUpdateForm.edit.title');

     const fetchApi = async () => {

        const dataScopes = [
            {
                label: t('modal.createOrUpdateForm.role.dataScope.all'),
                value: 1
            },
            {
                label: t('modal.createOrUpdateForm.role.dataScope.custom'),
                value: 2
            },
            {
                label: t('modal.createOrUpdateForm.role.dataScope.dept'),
                value: 3
            },
            {
                label: t('modal.createOrUpdateForm.role.dataScope.dept.child'),
                value: 4
            },
            {
                label: t('modal.createOrUpdateForm.role.dataScope.self'),
                value: 5
            },
        ];

        setDataScopeOptions(dataScopes);

        const departmentRes = await queryAllDepartments();
        const departmentData = departmentRes.data;
        const listTreeDepartmentData = listToTree(departmentData);
        const defaultExpandedRowKeys = listTreeDepartmentData.map((item: any)=>{
            return item.key;
        });

        setDefaultExpandedRowKeys(defaultExpandedRowKeys);
        setTreeData(listTreeDepartmentData);
        setTreeLeafRecord(filterTreeLeafNode(listTreeDepartmentData));

        try{
            if(editId !== undefined){
                const res = await getDataScopeByRoleId(editId);
                const currentData = res.data;
                let departmentList: any[] = [];
                if(currentData.departments.length > 0){
                    departmentList = currentData.departments.map((item: any) => {
                        return item.id;
                    });
                }

                setDefaultCheckedKeys(departmentList);
                setInitialValues({
                    name: currentData.name,
                    slug: currentData.slug,
                    data_scope: currentData.data_scope,
                    departmentIds: departmentList,
                });

                setDataScopeType(currentData.data_scope);

            }
        }catch (error: any){
            message.error(error.message);
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);


    const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
        const leafIds = treeLeafRecord.map((item: any) => item.id);
        const selectedLeafIds = leafIds.filter((id: number) => selectedKeys.includes(id));

        form.setFieldsValue({ departmentIds: JSON.stringify(selectedLeafIds) });
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        const keyArray = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
        const leafIds = treeLeafRecord.map((item:any) => item.id);
        const selectedLeafIds = leafIds.filter((id: number) => keyArray.includes(id));

        form.setFieldsValue({ departmentIds: JSON.stringify(selectedLeafIds) });
    };


    const onDataScopeChanged = (value: number) =>{
        setDataScopeType(value);
    }

    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();
            //最终提交数据格式化
            const transformedData  = {
                data_scope: fieldsValue.data_scope,
                departmentIds: fieldsValue.data_scope== 2 ? fieldsValue.departmentIds: ''
            }
            await updateDataScopeByRoleId(editId, transformedData);
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
                        name="role_datascope-update"
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
                            ]}
                        >
                            <Input disabled placeholder={
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
                            ]}
                        >
                            <Input disabled placeholder={
                                t('modal.createOrUpdateForm.slug.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="data_scope"
                            label={
                                t('modal.createOrUpdateForm.role.dataScope')
                            }
                            labelCol={{ span: 3 }}
                        >
                            <Select
                                options={dataScopeOptions}
                                onChange={onDataScopeChanged}
                                placeholder={
                                    t('modal.createOrUpdateForm.role.dataScope.placeholder')
                                }
                            />

                        </Form.Item>


                        <Form.Item name="departmentIds" hidden>
                            <Input hidden />
                        </Form.Item>

                        {dataScopeType == 2 &&
                            <Tree
                                checkable
                                defaultExpandAll={false}
                                defaultCheckedKeys={defaultCheckedKeys}
                                defaultExpandedKeys={defaultExpandedRowKeys}
                                onSelect={onSelect}
                                onCheck={onCheck}
                                key={nanoid()}
                                style={{paddingLeft: '80px'}}
                                treeData={treeData}
                            />
                        }

                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEditDataScope;