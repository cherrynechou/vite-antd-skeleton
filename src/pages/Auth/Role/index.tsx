import {FC,  useEffect, useRef, useState} from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import {App, Button, Space,Popconfirm} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {omit} from 'lodash-es';
import {queryRoles} from '@/api/auth/RoleController';
import CustomerPageContainer from "@/components/CustomerPageContainer";

export type TableListItem = {
    id: number;
    name: string;
    created_at: number;
    update_at: number;
};


const Role: FC = () =>{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editId, setEditId] = useState<number | undefined>(0);


    const { t } = useTranslation();

    const { message } = App.useApp();

    const actionRef = useRef<ActionType>(null);


    //自定查询
    const requestData = async (params: any) =>{
        const filter = omit(params,['current','pageSize']);
        const rename = {
            page: params.current,
            pageSize: params.pageSize
        }
        const mergeParams = Object.assign({} , filter , rename);
        const ret = await queryRoles(mergeParams);

        return {
            data: ret.data.data,
            total: ret.data.meta.pagination.total,
            success: ret.status === 200
        }
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
                t('pages.searchTable.slug')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'slug',
        }, {
            title: (
                t('pages.searchTable.name')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'name',
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
        <CustomerPageContainer title={
            t('admin.role')}
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                    t('admin.role.list')
                }
                rowSelection={{ fixed: true }}
                pagination={false}
                toolBarRender={() => [
                    <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
                        {t('pages.searchTable.new')}
                    </Button>,
                ]}
            />
        </CustomerPageContainer>
    )
}

export default Role;