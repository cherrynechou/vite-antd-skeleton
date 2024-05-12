import {FC, useEffect, useRef, useState} from 'react';
import { Modal, Form, Input, Select, message, Skeleton, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';

import { filterTreeLeafNode, listToTree } from '@/utils/utils';

import type { UploadFile } from 'antd/es/upload/interface';

import { queryAllRoles } from '@/services/admin/auth/role';
import { getUser, createUser, updateUser } from '@/services/admin/auth/user';
import { queryAllPermissions } from '@/services/admin/auth/permission';

import { ITreeOption } from '@/interfaces/treeOptions';
import { ICreateOrEditModalProps } from '@/interfaces/modalProps'
import {pick} from 'lodash-es';

import {CustomerUpload} from '@/components';


type TUserEntity = {
    id: string,
    username: string,
    name: string,
    avatar: string,
    avatar_url: string,
    roles: any[],
    permissions: any[]
}

const CreateOrEdit: FC<ICreateOrEditModalProps> = ( props: any ) =>{
    const [initialValues, setInitialValues] = useState<any>({});
    const [roles, setRoles] = useState<any>([]);
    const [avatarFileList,setAvatarFileList] = useState<UploadFile[]>([]);
    const [treeData, setTreeData] = useState<any>([]);
    const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
    const [userRoles,setUserRoles] = useState<any>([]);
    const {isModalVisible, isShowModal, editId, actionRef} = props;

    const [form] = Form.useForm();

    const title = editId === undefined ? '添加' : '编辑';

    const fetchApi = async () => {

        const roleRes = await queryAllRoles();
        if (roleRes.status === 200) {
            const _roleData = roleRes.data;
            const _roleList: any[] = [];
            _roleData.forEach((item: any) => {
                _roleList.push({ label: item.name, value: item.id });
            });
            setRoles(_roleList);
        }

        const permissionAllRes = await queryAllPermissions();

        //默认类型
        const defaultOptionKeys: ITreeOption = {
            idKey: 'id',
            childrenKey: 'children',
            nameKey: 'name',
            parentIdKey: 'parent_id',
            rootValue: 0
        };

        if(permissionAllRes.status === 200){
            const _permissionData = permissionAllRes.data;
            const listTreePermissionData = listToTree(_permissionData, defaultOptionKeys)
            setTreeData(listTreePermissionData);
            setTreeLeafRecord(filterTreeLeafNode(listTreePermissionData))
        }

        if (editId !== undefined) {
            const userRes = await getUser(editId);
            if (userRes.status === 200) {
                const currentData: TUserEntity = userRes.data;

                const roleList: any[] = [];
                currentData.roles.forEach((item: any) => {
                    roleList.push(item.id);
                });

                setAvatarFileList([
                    {
                        uid: currentData.id,
                        name: '',
                        status: 'done',
                        url: currentData.avatar_url,
                    } as UploadFile,
                ]);

                let _permissionList: any[] = [];
                if(currentData.permissions.length>0){
                    _permissionList = currentData.permissions.map((item: any)=>{return item.id});
                }

                let _roleList: any[] = [];
                if(currentData.roles.length>0){
                    _roleList= currentData.roles.map((item: any)=>{return item.slug});
                    setUserRoles(_roleList);
                }
    
                setDefaultCheckedKeys(_permissionList);

                setInitialValues({
                    username: currentData.username,
                    name: currentData.name,
                    avatar: currentData.avatar,
                    roles: roleList,
                    permissions:JSON.stringify(_permissionList)
                });
            }
        }
    }

    useEffect(() => {
        fetchApi();
    }, []);
    
    /**
     * 处理回调
     * @param fileList
     */
    const handleAvatarImageChange = (fileList: any)=>{
        form.setFieldsValue({
            avatar: fileList.length == 0 ? '' :  fileList.pop()
        });
        
    }
    
    const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
        //找出叶子节点
        const filterChildNodes = treeLeafRecord.map((item: any) => {return item.id})
        const filterSameKeys = filterChildNodes.filter((item: any)=> (selectedKeys.indexOf(item) > -1))
        form.setFieldsValue({permissions:JSON.stringify( filterSameKeys) });
    };
    
    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        // @ts-ignore
        const checkedKeysResult = [...checkedKeys]
        //找出叶子节点
        const filterChildNodes = treeLeafRecord.map((item: any) => {return item.id})
        const filterSameKeys = filterChildNodes.filter((item: any)=> (checkedKeysResult?.indexOf(item) > -1))
        form.setFieldsValue({permissions:JSON.stringify( filterSameKeys) });
    };
    
    const handleOk = async () => {
        const fieldsValue = await form.validateFields();

        //去掉 confirm
        const fieldsPostValue = pick(fieldsValue, [
            'name',
            'username',
            'avatar',
            'roles',
            'password',
            'permissions'
        ]);

        let response: any = {};
        if (editId === undefined) {
            response = await createUser(fieldsPostValue);
        } else {
            response = await updateUser(editId, fieldsPostValue);
        }

        // @ts-ignore
        if (response.status === 200) {
            isShowModal(false);
            message.success('更新成功');
            actionRef.current.reload();
        }
    }
    
    return (
        <Modal
            title={title}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => isShowModal(false)}
            destroyOnClose
            width={750}
        >
            {Object.keys(initialValues).length === 0 && editId !== undefined ? (<Skeleton paragraph={{ rows: 4 }} />) : (
                <Form form={form} initialValues={initialValues} autoComplete="off">
                    <Form.Item
                        name="username"
                        label="用户名"
                        labelCol={{ span: 3 }}
                        rules={[{ required: true, message: '用户名是必填项！' }]}
                    >
                        <Input placeholder="请输入 用户名" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="名 称"
                        labelCol={{ span: 3 }}
                        rules={[{ required: true, message: '名称是必填项！' }]}
                    >
                        <Input placeholder="请输入 名称" />
                    </Form.Item>

                    <Form.Item name="avatar" hidden>
                        <Input hidden />
                    </Form.Item>


                    {/*头像*/}
                    <Form.Item
                        label="头像"
                        labelCol={{ span: 3 }}
                    >
                        <CustomerUpload
                          accept="image/*"
                          listType="picture-card"
                          fileList={avatarFileList}
                          maxCount = {1}
                          onUploadChange={handleAvatarImageChange}
                        />
                    </Form.Item>

                    {/*添加*/}
                    {editId === undefined && (
                        <>
                            <Form.Item
                                name="password"
                                label="密码"
                                labelCol={{ span: 3 }}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码不能为空！',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value.length >= 6) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('密码长度至少6位!'));
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="确认密码"
                                dependencies={['password']}
                                hasFeedback
                                labelCol={{ span: 3 }}
                                rules={[
                                    {
                                        required: true,
                                        message: '请确认你的密码！',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('输入的密码不匹配!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </>
                    )}

                    {/*编辑*/}
                    {editId !== undefined && (
                        <>
                            <Form.Item
                                name="password"
                                label="密码"
                                labelCol={{ span: 3 }}
                                hasFeedback>
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="确认密码"
                                dependencies={['password']}
                                labelCol={{ span: 3 }}
                                hasFeedback
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('输入的密码不匹配!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="roles"
                        label="角色"
                        labelCol={{ span: 3 }}
                        rules={[{ required: true, message: '名称是必填项！' }]}
                    >
                        <Select mode="multiple" options={roles} placeholder="请选择 角色" />
                    </Form.Item>
    
                    {!userRoles.includes('administrator') && <>
                        <Form.Item
                          name="permissions"
                          hidden
                        >
                            <Input
                              hidden
                            />
                        </Form.Item>
        
                        <Form.Item
                          label="权限"
                          labelCol={{ span: 3 }}
                        >
                            <Tree
                              checkable
                              defaultExpandAll={false}
                              defaultCheckedKeys={defaultCheckedKeys}
                              onSelect={onSelect}
                              onCheck={onCheck}
                              treeData={treeData}
                            />
                        </Form.Item>
                    </>}
                </Form>
            )}
        </Modal>
    )
}

export default CreateOrEdit;