import {FC, useState} from 'react'
import {App, Form, Input, Modal, Skeleton} from "antd";
import {useTranslation} from "react-i18next";
import type { TreeProps } from 'antd/es/tree';
import type { UploadFile } from 'antd/es/upload/interface';
import {ICreateOrEditProps} from "@/interfaces/modal";
import UploadImage from "@/components/UploadImage";

const CreateOrEdit : FC<ICreateOrEditProps> = (props: any)=>{
    const [initialValues, setInitialValues] = useState<any>({});
    const [roles, setRoles] = useState<any>([]);
    const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
    const [treeData, setTreeData] = useState<any>([]);
    const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
    const [userRoles, setUserRoles] = useState<any>([]);
    const { t } = useTranslation();
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [form] = Form.useForm();
    const { message} = App.useApp();


    const title = editId === undefined ? t('modal.createOrUpdateForm.create.title'): t('modal.createOrUpdateForm.edit.title');

    const handleAvatarImageChange = (fileList: UploadFile[])=>{
        form.setFieldsValue({
            avatar: fileList.length === 0 ? '' : fileList.map(v=>v.name),
        });
    }


    const handleOk = () =>{

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
                                    message: (t('modal.createOrUpdateForm.username.required'))
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


                    </Form>
                )
            }
        </Modal>
    )
}

export default CreateOrEdit;