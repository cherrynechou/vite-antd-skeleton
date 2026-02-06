import {FC, useRef, useState} from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import {App, Button, Space, Popconfirm, Tag, Switch} from "antd";
import  {PlusOutlined} from "@ant-design/icons";
import {omit} from "lodash-es";
import {queryUsers} from "@/api/auth/UserController";
import CustomerPageContainer from '@/components/CustomerPageContainer';
import CreateOrEdit  from './components/CreateOrEdit';

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
    const [editId, setEditId] = useState<number | undefined>(0);

    const actionRef = useRef<ActionType>(null)

    const { t } = useTranslation();

    const { message } = App.useApp();





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

    }

    /**
     *  显示对话框
     * @param show
     * @param id
     */
    const isShowModal = (show: boolean, id?: number | undefined) => {
        setEditId(id);
        setIsModalVisible(show);
    };


    /**
     * 删除id
     * @param id
     */
    const confirmDel = async (id: number) => {

    }

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
            title: (
                t('pages.searchTable.username')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'username',
        }, {
            title: (
                t('pages.searchTable.name')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'name',
            hideInSearch: true,
        }, {
            title: (
                t('pages.searchTable.role')
            ),
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
            title: (
                t('pages.searchTable.disabled')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'is_black',
            hideInSearch: true,
            render: (_, record) => (
                <Switch
                    checkedChildren={t('global.switch.checked.label')}
                    unCheckedChildren={t('global.switch.unChecked.label')}
                    defaultChecked={record.status === 1}
                    disabled={record.is_administrator}
                    onChange={() => handleBlockUser(record.id)}
                />
            ),
        }, {
            title: (
                t('pages.searchTable.loginCount')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'login_count',
            hideInSearch: true,
        }, {
            title: (
                t('pages.searchTable.createdAt')
            ),
            width: 120,
            align: 'center',
            dataIndex: 'created_at',
            hideInSearch: true,
        }, {
            title: (
                t('pages.searchTable.updatedAt')
            ),
            width: 120,
            align: 'center',
            dataIndex: 'updated_at',
            hideInSearch: true,
        }, {
            title: (
                t('pages.searchTable.action')
            ),
            width: 80,
            key: 'option',
            valueType: 'option',
            align: 'center',
            render: (_,record) => (
                <Space>
                    <a key="link" className="text-blue-500" onClick={() => isShowModal(true, record.id)}>
                        {t('pages.searchTable.edit')}
                    </a>
                    <Popconfirm
                        key="del"
                        placement="top"
                        title={t('pages.searchTable.okConfirm')}
                        onConfirm={ () => confirmDel(record.id) }
                        okText={t('pages.searchTable.ok')}
                        cancelText={t('pages.searchTable.cancel')}
                    >
                        <a key="delete" className="text-blue-500">
                            {t('pages.searchTable.delete')}
                        </a>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <CustomerPageContainer
            title={
                t('admin.user')
            }
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                    t('admin.user.list')
                }
                rowSelection={{ fixed: true }}
                pagination={false}
                toolBarRender={() => [
                    <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
                        {t('pages.searchTable.new')}
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

        </CustomerPageContainer>
    )
}

export default User;