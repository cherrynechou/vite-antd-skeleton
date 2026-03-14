import { FC, useState } from 'react'
import { App, Form, Input, Modal, Select, Skeleton,Tree } from "antd";
import { useTranslation } from "react-i18next";
import {nanoid} from "nanoid";
import type { TreeProps } from 'antd/es/tree';
import { useAsyncEffect } from "ahooks";
import {getRoleById} from "@/api/auth/RoleController";
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
    const [isShowDepartment,SetIsShowDepartment] = useState<boolean>(false);
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
                const roleRes = await getRoleById(editId);
                const currentData = roleRes.data;
                setInitialValues({
                    name: currentData.name,
                    slug: currentData.slug,
                    data_scope: currentData.data_scope,
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

    const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
        //找出叶子节点
        const filterChildNodes = treeLeafRecord.map((item: any) => {
            return item.id;
        });
        const filterSameKeys = filterChildNodes.filter((item: any) => selectedKeys.indexOf(item) > -1);
        form.setFieldsValue({ departmentIds: JSON.stringify(filterSameKeys) });
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        // @ts-ignore
        const checkedKeysResult = [...checkedKeys];
        //找出叶子节点
        const filterChildNodes = treeLeafRecord.map((item: any) => {
            return item.id;
        });
        const filterSameKeys = filterChildNodes.filter((item: any) => checkedKeysResult?.indexOf(item) > -1);
        form.setFieldsValue({ departmentIds: checkedKeysResult.length===0 ? [] : filterSameKeys });
    };


    const onDataScopeChanged = () =>{

    }


    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();
            console.log(fieldsValue)

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
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Form.Item
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
                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEditDataScope;