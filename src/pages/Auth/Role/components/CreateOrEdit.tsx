import { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Tree, message, Skeleton } from 'antd';

const CreateOrEdit: FC = (props: any)=>{

    const [ initialValues, setInitialValues ] = useState<any>({});
    const [ treeData, setTreeData] = useState<any>([]);
    const [ treeLeafRecord, setTreeLeafRecord ] = useState<any>([]);
    const [ defaultCheckedKeys, setDefaultCheckedKeys ] = useState<any>([]);
    const { isModalVisible, isShowModal, editId, actionRef } = props;

    const [ form ] = Form.useForm();

    const title = editId === undefined ? '添加' : '编辑';

    const handleOk = ()=>{

    }

    return (
        <Modal
            title={title}
            bodyStyle={{'height':'calc(100vh - 400px)','overflowY':'auto'}}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={()=>isShowModal(false)}
            destroyOnClose={true}
            width={750}
        >
            {
                Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> :
                    <Form
                        name="role-update"
                        form={form}
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="name"
                            label="名称"
                            rules={[{ required: true, message: '名称是必填项！' }]}
                        >
                            <Input placeholder="请输入 名称" />
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label="标识"
                            rules={[{ required: true, message: '标识是必填项！' }]}
                        >
                            <Input placeholder="请输入 名称" />
                        </Form.Item>

                        <Form.Item
                            name="permissions"
                            hidden
                        >
                            <Input hidden placeholder="请输入 名称" />
                        </Form.Item>

                        <Form.Item
                            label="权限"
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
                    </Form>
            }

        </Modal>
    )

}



export default CreateOrEdit;