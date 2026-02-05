import {FC,  useEffect, useRef, useState} from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import {App, Button, Space,Popconfirm} from "antd";
import * as icons from '@ant-design/icons';
import Icon, {PlusOutlined} from '@ant-design/icons';
import {queryMenus} from '@/api/auth/MenuController.ts';
import CustomerPageContainer from '@/components/CustomerPageContainer';
import {treeToList} from "@/utils/utils";

export type TableListItem = {
    id: number;
    icon: string;
    name: string;
    router: string;
    sort: number;
    status: number;
    created_at: number;
    update_at: number;
};

const Menu: FC = () =>{
    const [ menuData, setMenuData ] = useState([]);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any>([])
    const [ editId, setEditId] = useState<number | undefined>(0);

    const actionRef = useRef<ActionType>(null)

    const { t } = useTranslation();

    const { message } = App.useApp();

    //自定查询
    const requestData = async () =>{
        const ret = await queryMenus();
        setMenuData(ret.data);

        const treeList = treeToList(ret.data);
        const _defaultExpandedRowKeys = treeList.map((item)=>{
            return item.id;
        })

        console.log(_defaultExpandedRowKeys);
        setDefaultExpandedRowKeys(_defaultExpandedRowKeys);

        return {
            data: ret.data,
            success: ret.status === 200
        }
    }

    /**
     *  显示对话框
     * @param show
     * @param id
     */
    const isShowModal = (show: boolean, id?: number | undefined)=> {
        setEditId(id);
        setIsModalVisible(show);
    }

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
            width: 80,
            dataIndex: 'id',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            hideInSearch: true,
        }, {
            title: (
                t('pages.searchTable.icon')
            ),
            width: 20,
            align: 'center',
            dataIndex: 'icon',
            hideInSearch: true,
            render:(_,record)=>(
                record.icon && <Icon component={(icons as any)[record.icon]} style={{ fontSize: '16px' }} />
            )
        }, {
            title: (
                t('pages.searchTable.name')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'name'
        },{
            title: (
                t('pages.searchTable.locale')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'locale'
        },{
            title: (
                t('pages.searchTable.router')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'path',
            hideInSearch: true,
        }, {
            title: (
               t('pages.searchTable.sort')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'sort',
            hideInSearch: true,
        },
        {
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
                t('admin.menu')
            }
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                    t('admin.menu.list')
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
        </CustomerPageContainer>
    )
}

export default Menu;