import {FC,  useEffect, useRef, useState} from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import CustomerPageContainer from '@/components/CustomerPageContainer';
import { ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import {App, Button, Space, Popconfirm, Tag} from "antd";
import  {PlusOutlined} from "@ant-design/icons";
import {queryPermissions} from '@/api/auth/PermissionController';
import CreateOrEdit from './components/CreateOrEdit'
import {treeToList} from "@/utils/utils";

export type TableListItem = {
    id: number;
    name: string;
    slug: string;
    methods: any[];
    paths: any[];
    sort: number;
    parent_id: number;
    created_at: number;
    update_at: number;
};

const Permission: FC = () =>{
    const [ permissionTreeData, setPermissionTreeData ] = useState<any>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any>([])
    const [editId, setEditId] = useState<number | undefined>(0);

    const actionRef = useRef<ActionType>(null)

    const { t } = useTranslation();

    const { message } = App.useApp();


    //自定查询
    const requestData = async () =>{
        const res = await queryPermissions();
        setPermissionTreeData(res.data);

        const treeList = treeToList(res.data);
        const _defaultExpandedRowKeys = treeList.map((item)=>{
            return item.id;
        })
        setDefaultExpandedRowKeys(_defaultExpandedRowKeys);

        return {
            data: res.data,
            success: res.status === 200
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
            width: 50,
            dataIndex: 'id',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            hideInSearch: true,
        },
        {
            title: (
                t('pages.searchTable.slug')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'slug',
            render: (_, record) => (
                <Space>
                    <Tag color="#586cb1">{record.slug}</Tag>
                </Space>
            ),
        },
        {
            title: (
                t('pages.searchTable.name')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'name',
        },{
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
                t('admin.permission')
            }
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                search={false}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                    t('admin.permission.list')
                }
                expandable={{
                    expandedRowKeys: defaultExpandedRowKeys
                }}
                rowSelection={{ fixed: true }}
                pagination={false}
                toolBarRender={() => [
                    <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
                        {t('pages.searchTable.new')}
                    </Button>,
                ]}
            />

            {isModalVisible && (
                <CreateOrEdit
                    isModalVisible={isModalVisible}
                    isShowModal={isShowModal}
                    actionRef={actionRef}
                    permissionTreeData={permissionTreeData}
                    editId={editId}
                />
            )}


        </CustomerPageContainer>
    );
};


export default Permission;