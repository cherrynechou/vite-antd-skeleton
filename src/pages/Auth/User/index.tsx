import { FC, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable ,TableDropdown  } from '@ant-design/pro-components';
import { Button, Space, Tag, message, Switch, Popconfirm } from 'antd';
import { queryUsers, blockUser, resetPassword, destroyUser } from '@/services/admin/auth/user';
import { omit } from 'lodash-es';
import { PlusOutlined } from '@ant-design/icons';
import CreateOrEdit from './components/CreateOrEdit';


export type TableListItem = {
    id: number;
    username: string;
    name: string;
    email: string;
    roles: {
        data: [];
    };
    is_administrator: boolean;
    phone: string;
    status: number;
    login_count: number;
    created_at: number;
    update_at: number;
};

export type RoleItem = {
    name: string;
};


const User: FC = () =>{

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editId, setEditId] = useState<number>(0);

    const actionRef = useRef<ActionType>();

    //获取用户用户列表
    const requestData = async (params: any) => {
        const filter = omit(params, ['current', 'pageSize']);
        const rename = {
            page: params.current,
            pageSize: params.pageSize,
        };
        const mergeParams = Object.assign({}, filter, rename);
        const ret = await queryUsers(mergeParams);

        return {
            data: ret.data.data,
            total: ret.data.meta.pagination.total,
            success: ret.status === 200,
        };
    };

    /**
     * 禁止用户登录
     * @param uid
     */
    const handleBlockUser = async (uid: number) => {
        const res = await blockUser(uid);
        if (res.status === 200) {
            message.success('更新成功');
        }
    };

    /**
     *  显示对话框
     * @param show
     * @param id
     */
    const isShowModal = (show: boolean, id?: number | undefined) => {
        // @ts-ignore
        setEditId(id);
        setIsModalVisible(show);
    };

    /**
     *
     * @param id
     */
    const confirmDel = async (id: number) => {
        const res = await destroyUser(id);
        if (res.status === 200) {
            message.success('删除成功');
        }
    };

    /**
     * 重置密码
     * @param id
     */
    const confirmResetPassword = async (id: number) => {
        const res = await resetPassword(id);
        if (res.status === 200) {
            message.success('重置成功');
        }
    };

    //列表
    const columns: ProColumns<TableListItem>[] = [
        {
            title: 'ID',
            width: 40,
            dataIndex: 'id',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            hideInSearch: true,
        }, {
            title: '用户名',
            width: 80,
            align: 'center',
            dataIndex: 'username',
        }, {
            title: '名称',
            width: 80,
            align: 'center',
            dataIndex: 'name',
            hideInSearch: true,
        }, {
            title: '角色',
            width: 80,
            align: 'center',
            dataIndex: 'roles',
            hideInSearch: true,
            renderFormItem: (_, { defaultRender }) => {
                return defaultRender(_);
            },
            render: (_, record) => (
                <Space>
                    {record.roles.data.map((item: RoleItem, index: number) => (
                        <Tag key={index} color="#586cb1">
                            {item.name}
                        </Tag>
                    ))}
                </Space>
            ),
        }, {
            title: '是否禁用',
            width: 80,
            align: 'center',
            dataIndex: 'is_black',
            hideInSearch: true,
            render: (_, record) => (
                <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    defaultChecked={record.status === 1}
                    disabled={record.is_administrator}
                    onChange={() => handleBlockUser(record.id)}
                />
            ),
        }, {
            title: '登录次数',
            width: 80,
            align: 'center',
            dataIndex: 'login_count',
            hideInSearch: true,
        }, {
            title: '创建时间',
            width: 120,
            align: 'center',
            dataIndex: 'created_at',
            hideInSearch: true,
        }, {
            title: '更新时间',
            width: 120,
            align: 'center',
            dataIndex: 'updated_at',
            hideInSearch: true,
        }, {
            title: '操作',
            width: 140,
            key: 'option',
            valueType: 'option',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <a key="link" onClick={() => isShowModal(true, record.id)}>
                        编辑
                    </a>
                    {!record.is_administrator && (
                        <Popconfirm
                            key="del"
                            placement="top"
                            title="确认操作?"
                            onConfirm={() => confirmDel(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a>删除</a>
                        </Popconfirm>
                    )}
                    <Popconfirm
                        key="reset"
                        placement="top"
                        title="确认操作?"
                        onConfirm={() => confirmResetPassword(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a>重置密码</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <PageContainer title="用户管理">
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                headerTitle="用户列表"
                pagination={{
                    pageSize: 15,
                    showSizeChanger: false,
                    showQuickJumper: true,
                }}
                toolBarRender={() => [
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
                        新增
                    </Button>,
                ]}
            />
    
            {isModalVisible &&
                <CreateOrEdit
                  isModalVisible={isModalVisible}
                  isShowModal={isShowModal}
                  actionRef={actionRef}
                  editId={editId}
                />
            }
        </PageContainer>
    )
}


export default User;