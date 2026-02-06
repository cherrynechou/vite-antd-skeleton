import {FC, useState} from "react";
import {App, Button, Drawer, Form, Input, Skeleton, Space, Tree} from "antd";
import type { TreeProps } from 'antd/es/tree';
import {useTranslation} from "react-i18next";
import {nanoid} from "nanoid";
import {useAsyncEffect} from "ahooks";
import {filterTreeLeafNode, listToTree} from "@/utils/utils.ts";
import {queryAllPermissions} from "@/api/auth/PermissionController.ts";
import {getPermissionIdsByRoleId, updatePermissionByRoleId} from "@/api/auth/RoleController.ts";

export interface ICreateOrEditProps  {
    isDrawerVisible: boolean;
    isShowDrawer: (show: boolean, id?: number | undefined) => void;
    editId : number | undefined;
    actionRef: any;
}

const CreateOrEditPermission: FC <ICreateOrEditProps> = (props: any)=>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any>([])
    const [treeData, setTreeData] = useState<any>([]);
    const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
    const { isDrawerVisible, isShowDrawer, editId, actionRef } = props;

    const { message } = App.useApp();
    const [form] = Form.useForm();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title') : t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () =>{
        try {
            const permissionRes = await queryAllPermissions();
            const permissionData = permissionRes.data;
            const listTreePermissionData = listToTree(permissionData);
            const defaultExpandedRowKeys = listTreePermissionData.map((item: any)=>{
                return item.key;
            });

            setDefaultExpandedRowKeys(defaultExpandedRowKeys);
            setTreeData(listTreePermissionData);
            setTreeLeafRecord(filterTreeLeafNode(listTreePermissionData));

            if(editId !== undefined){
                const res = await getPermissionIdsByRoleId(editId);

                let permissionList: any[] = [];
                if(res.data.length > 0){
                    permissionList = res.data.map((item: any) => {
                        return item;
                    });
                }

                setDefaultCheckedKeys(permissionList);
                setInitialValues({
                    permissionIds: permissionList,
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
        form.setFieldsValue({ permissions: JSON.stringify(filterSameKeys) });
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        // @ts-ignore
        const checkedKeysResult = [...checkedKeys];

        //找出叶子节点
        const filterChildNodes = treeLeafRecord.map((item: any) => {
            return item.id;
        });

        const filterSameKeys = filterChildNodes.filter((item: any) => checkedKeysResult?.indexOf(item) > -1);
        form.setFieldsValue({ permissionIds: checkedKeysResult.length===0 ? [] : filterSameKeys });
    };

    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();

            await updatePermissionByRoleId(editId,fieldsValue);

            isShowDrawer(false);

            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');

            message.success(defaultUpdateSuccessMessage);

            actionRef.current.reload();

        }catch (error: any){

        }
    }

    return (
        <Drawer
            title={title}
            open={isDrawerVisible}
            onClose={() => isShowDrawer(false)}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Space>
                        <Button onClick={()=>isShowDrawer(false)}>取消</Button>
                        <Button type="primary" onClick={handleOk}>
                            确定
                        </Button>
                    </Space>
                </div>
            }
            size={750}
        >
            {
                Object.keys(initialValues).length === 0 ? <Skeleton paragraph={{ rows: 4 }} /> : (
                    <Form
                        name="role-permission-update"
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Form.Item name="permissionIds" hidden>
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
                            treeData={treeData}
                        />

                    </Form>
                )}
        </Drawer>
    )
}

export default CreateOrEditPermission;