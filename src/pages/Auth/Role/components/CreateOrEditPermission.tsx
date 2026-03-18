import {FC, useState} from "react";
import {App, Button, Drawer, Form, Input, Skeleton, Space, Tree} from "antd";
import type { TreeProps } from 'antd/es/tree';
import {useTranslation} from "react-i18next";
import {nanoid} from "nanoid";
import {useAsyncEffect} from "ahooks";
import {filterTreeLeafNode, listToTree} from "@/utils/utils";
import {queryAllPermissions} from "@/api/auth/PermissionController";
import {getPermissionIdsByRoleId, updatePermissionByRoleId} from "@/api/auth/RoleController";

export interface ICreateOrEditProps  {
    isDrawerVisible: boolean;
    isShowDrawer: (show: boolean, id?: number | undefined) => void;
    editId : number | string | undefined,
    actionRef: any;
}

const CreateOrEditPermission: FC <ICreateOrEditProps> = ({
    isDrawerVisible, 
    isShowDrawer, 
    editId, 
    actionRef
})=>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any>([])
    const [treeData, setTreeData] = useState<any>([]);
    const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
 
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

            console.log(listTreePermissionData);

            if(editId !== undefined){
                const res = await getPermissionIdsByRoleId(editId);

                let permissionList: any[] = [];
                if(res.data.length > 0){
                    permissionList = res.data.map((item: any) => {
                        return item.id;
                    });
                }

                setDefaultCheckedKeys(permissionList);
                setInitialValues({
                    permissionIds: permissionList,
                })
            }

        }catch (error: any){
            message.error(error.data.message);
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);




    //击树节点触发
    const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
        const leafIds = treeLeafRecord.map((item: any) => item.id);
        const selectedLeafIds = leafIds.filter((id: any) => selectedKeys.includes(id));

        form.setFieldsValue({ permissionIds: JSON.stringify(selectedLeafIds) });
    };

    //点击复选框触发
    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        const keyArray = Array.isArray(checkedKeys) ? checkedKeys : [checkedKeys];
        const leafIds = treeLeafRecord.map((item:any) => item.id);
        const selectedLeafIds = leafIds.filter((id:any) => keyArray.includes(id));

        form.setFieldsValue({ permissionIds: JSON.stringify(selectedLeafIds) });
    };

    //确定
    const handleOk = async () =>{
        try {
            const fieldsValue = await form.validateFields();
            if(editId !== undefined){
                await updatePermissionByRoleId(editId, fieldsValue);
            }

            isShowDrawer(false);
            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');
            message.success(defaultUpdateSuccessMessage);
            actionRef.current.reload();
        }catch (error: any){
            message.error(error.message);
        }
    }

    /**
     * 渲染footer
     */
    const renderFooter =  () =>{
        return (
            <div style={{ textAlign: "right" }}>
                <Space>
                    <Button onClick={()=>isShowDrawer(false)}>{t('global.cancel')}</Button>
                    <Button type="primary" onClick={handleOk}>
                        {t('global.confirm')}
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