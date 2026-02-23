import {FC, useEffect, useRef, useState} from "react";
import {ProTable} from "@ant-design/pro-components";
import {useTranslation} from "react-i18next";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {PlusOutlined} from "@ant-design/icons";
import {Button, App, type TableProps, Space, Popconfirm} from "antd";
import {omit} from "lodash-es";
import {queryDicts} from "@/api/auth/DictController";
import CreateOrEditDict from "./CreateOrEditDict";

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export interface IDictTableProps {
    setDictId?: (id:  number[] ) => void;
}

export type TableListItem = {
    id: number;
    name: string;
    createdAt: number;
    updateAt: number;
};

const DictTable:FC<IDictTableProps>=(props: any)=>{
    const { t } = useTranslation();
    const [editId, setEditId] = useState<number | undefined>(0);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const actionRef = useRef<ActionType>(null);

    const {
        setDictId
    } = props;

    const { message} = App.useApp();

    // 当表格数据更新时，检查是否需要设置默认选中
    useEffect(() => {
        if (tableData.length > 0 && selectedRowKeys.length === 0) {
            // 如果当前没有选中任何行，且数据已加载，则默认选中第一行
            setSelectedRowKeys([tableData[0].id]);
        }
    }, [tableData]);


    useEffect(() => {
        if(selectedRowKeys){
            setDictId(selectedRowKeys)
        }
    }, [selectedRowKeys]);


    //自定查询
    const requestData = async (params: any): Promise<any> =>{
        try{
            const filter = omit(params, ['current', 'pageSize']);

            const rename = {
                page: params.current,
                pageSize: params.pageSize,
            };

            const mergeParams = Object.assign({}, filter, rename);
            const ret = await queryDicts(mergeParams);

            const retData = ret?.data?.data;

            setTableData(retData);

            return {
                data: retData,
                total: ret.data.meta.pagination.total,
                success: ret.status === 200
            }

        }catch (error: any){
            message.error(error.message);
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

    const rowSelection: TableRowSelection<TableListItem> = {
        type:  'radio', // 关键：设置为 radio 实现单选
        selectedRowKeys,
        onChange: (newSelectedRowKeys: any) => {
            setSelectedRowKeys(newSelectedRowKeys);
            // 可在此处处理选中变化的逻辑，如获取选中行的完整数据
        },
        // 可选：设置列宽
        columnWidth: '60px',
    };

    /**
     * 删除id
     * @param id
     */
    const confirmDel = async (id: number) => {
        try {


        }catch (error: any){

        }
    }

    //列表
    const columns: ProColumns<TableListItem>[] = [
        {
            title: 'ID',
            width: 20,
            dataIndex: 'id',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            hideInSearch: true,
        },{
            title: (
                t('pages.searchTable.dict.name')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'name'
        },{
            title: (
                t('pages.searchTable.dict.code')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'code',
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
                    <a key="link" className="text-blue-500" onClick={()=>isShowModal(true,record.id)}>
                        {t('pages.searchTable.edit')}
                    </a>
                    <Popconfirm
                        key="del"
                        placement="top"
                        title={
                            t('pages.searchTable.okConfirm')
                        }
                        onConfirm={ () => confirmDel(record.id) }
                        okText={
                            t('pages.searchTable.ok')
                        }
                        cancelText={
                            t('pages.searchTable.cancel')
                        }
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
        <>
            <ProTable<TableListItem>
                columns={columns}
                rowSelection={rowSelection}
                request={requestData}
                className={'h-full'}
                rowKey="id"
                options={false}
                actionRef={actionRef}
                dateFormatter="string"
                headerTitle={
                    t('admin.dict.list')
                }
                pagination={{
                    pageSize: 15,
                    showSizeChanger: false,
                    showQuickJumper: true
                }}
                toolBarRender={() => [
                    <Button key="button" type="primary" icon={<PlusOutlined />}  onClick={()=>isShowModal(true)}>
                        {t('pages.searchTable.new')}
                    </Button>,
                ]}
            />

            {isModalVisible &&
                <CreateOrEditDict
                    isModalVisible={isModalVisible}
                    isShowModal={isShowModal}
                    actionRef={actionRef}
                    editId = {editId}
                />
            }
        </>
    )
}

export default DictTable;