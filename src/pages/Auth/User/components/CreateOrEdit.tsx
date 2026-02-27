import { FC, useState } from 'react'
import { App, Form, Input, Modal, Select, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import type { UploadFile } from 'antd/es/upload/interface';
import { ICreateOrEditProps } from "@/interfaces/modal";
import UploadImage from "@/components/UploadImage";
import {useAsyncEffect} from "ahooks";
import {queryAllRoles} from "@/api/auth/RoleController";
import {buildAntdTreeData, treeToOrderList} from "@/utils/utils";
import {createUser, getUser, updateUser} from "@/api/auth/UserController";
import {queryDepartments} from "@/api/auth/DepartmentController";
import {queryPosts} from "@/api/auth/PostController";
import {pick} from "lodash-es";


const CreateOrEdit : FC<ICreateOrEditProps> = (props: any)=>{
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<any>({});
    const [roleOptions, setRoleOptions] = useState<any>([]);
    const [postOptions, setPostOptions] = useState<any>([]);
    const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
    const [treeData, setTreeData] = useState<any>([]);

    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title'): t('modal.createOrUpdateForm.edit.title');

    const fetchApi = async () => {
        try{
            const roleRes = await queryAllRoles();
            const roleData = roleRes.data;
            const roleList: any[] = [];
            roleData.forEach((item: any) => {
                roleList.push({ label: item.name, value: item.id });
            });
            setRoleOptions(roleList);

            //部门
            const departmentRes = await queryDepartments();
            const departmentData = departmentRes.data;
            const orderList = treeToOrderList(departmentData);
            const treeValues = buildAntdTreeData(orderList,{
                rootLabel: t('global.tree.root')
            })
            setTreeData(treeValues);

            //岗位
            const postRes = await queryPosts();
            const postData = postRes.data;
            const postList: any[] = [];
            postData.forEach((item: any) => {
                postList.push({ label: item.name, value: item.id });
            });
            setPostOptions(postList);


            if(editId !== undefined){
                const userRes = await getUser(editId);
                const currentData = userRes.data;

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
                    },
                ]);

                let permissionList: any[] = [];
                if (currentData.permissions.length > 0) {
                    permissionList = currentData.permissions.map((item: any) => {
                        return item.id;
                    });
                }
                setInitialValues({
                    username: currentData.username,
                    name: currentData.name,
                    avatar: currentData.avatar,
                    roles: roleList,
                    permissions: JSON.stringify(permissionList),
                });
            }
        }catch (error: any){
            console.log(error);
        }
    };

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);

    const handleAvatarImageChange = (fileList: UploadFile[])=>{
        form.setFieldsValue({
            avatar: fileList.length === 0 ? '' : fileList.map(v=>v.name),
        });
    }

    const handleOk =async () =>{
        try{
            const fieldsValue = await form.validateFields();

            //去掉 confirm
            const fieldsPostValue = pick(fieldsValue, ['name', 'username', 'avatar', 'roles', 'password', 'permissions']);

            if (editId === undefined) {
                await createUser(fieldsPostValue);
            } else {
                await updateUser(editId, fieldsPostValue);
            }

            isShowModal(false);

            const defaultUpdateSuccessMessage = editId === undefined ? t('global.create.success'): t('global.update.success');

            message.success(defaultUpdateSuccessMessage);
            actionRef.current.reload();
        }catch (error: any){

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
                        <Form.Item
                            name="username"
                            label={
                                t('modal.createOrUpdateForm.username')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('modal.createOrUpdateForm.username.required')
                                    )
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.username.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label={
                                t('modal.createOrUpdateForm.name')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: t('modal.createOrUpdateForm.name.required')
                                }
                            ]}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.name.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item name="avatar" hidden>
                            <Input hidden />
                        </Form.Item>

                        {/*部门*/}
                        <Form.Item
                            name="department_id"
                            label={
                                t('modal.createOrUpdateForm.department')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Select
                                options={treeData}
                                style={{ width: 400 }}
                                placeholder={
                                    t('modal.createOrUpdateForm.department.placeholder')
                                }
                            />
                        </Form.Item>

                        {/*岗位*/}
                        <Form.Item
                            name="post_id"
                            label={
                                t('modal.createOrUpdateForm.post')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <Select
                                options={postOptions}
                                style={{ width: 400 }}
                                placeholder={
                                    t('modal.createOrUpdateForm.post.placeholder')
                                }
                            />
                        </Form.Item>

                        {/*头像*/}
                        <Form.Item
                            label={
                                t('modal.createOrUpdateForm.avatar')
                            }
                            labelCol={{ span: 4 }}
                        >
                            <UploadImage
                                accept="image/*"
                                listType="picture-card"
                                initialFileList={avatarFileList}
                                maxCount={1}
                                maxSize={100}
                                onUploadChange={handleAvatarImageChange}
                            />
                        </Form.Item>

                        {/*添加*/}
                        {editId === undefined && (
                            <>
                                <Form.Item
                                    name="password"
                                    label={
                                        t('modal.createOrUpdateForm.password')
                                    }
                                    labelCol={{ span: 4 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                t('modal.createOrUpdateForm.password.required')
                                            ),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value.length >= 6) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error( t('message.password.length.failure')));
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password
                                        placeholder={
                                            t('modal.createOrUpdateForm.password.placeholder')
                                        }
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label={
                                        t('modal.createOrUpdateForm.password.confirm')
                                    }
                                    labelCol={{ span: 4 }}
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                               t('modal.createOrUpdateForm.password.confirm.required')
                                            ),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(t('message.password.not.match'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        placeholder={
                                            t('modal.createOrUpdateForm.password.confirm.placeholder')
                                        }
                                    />
                                </Form.Item>
                            </>
                        )}

                        {/*编辑*/}
                        {editId !== undefined && (
                            <>
                                <Form.Item
                                    name="password"
                                    label={
                                        t('modal.createOrUpdateForm.password')
                                    }
                                    labelCol={{ span: 4 }}
                                    hasFeedback
                                >
                                    <Input.Password
                                        placeholder={
                                            t('modal.createOrUpdateForm.password.placeholder')
                                        }
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label={
                                        t('modal.createOrUpdateForm.password.confirm')
                                    }
                                    labelCol={{ span: 4 }}
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(t('message.password.not.match')));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        placeholder={
                                            t('modal.createOrUpdateForm.password.confirm.placeholder')
                                        }
                                    />
                                </Form.Item>
                            </>
                        )}

                        {/*手机号*/}
                        <Form.Item
                            name="telephone"
                            label={
                                t('modal.createOrUpdateForm.telephone')
                            }
                            labelCol={{ span: 4 }}
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
                            labelCol={{ span: 4 }}
                        >
                            <Input placeholder={
                                t('modal.createOrUpdateForm.email.placeholder')
                            }
                            />
                        </Form.Item>

                        <Form.Item
                            name="roles"
                            label={
                                t('modal.createOrUpdateForm.role')
                            }
                            labelCol={{ span: 4 }}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        t('validator.admin.role.required')
                                    )
                                }
                            ]}
                        >
                            <Select
                                mode="multiple"
                                options={roleOptions}
                                placeholder={
                                    t('modal.createOrUpdateForm.role.placeholder')
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