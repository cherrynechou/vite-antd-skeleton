import {FC, useEffect, useRef, useState} from "react";
import { ProTable } from '@ant-design/pro-components';
import {useTranslation} from "react-i18next";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {nanoid} from "nanoid";
import {omit} from 'es-toolkit/compat'
import {App, Button, Popconfirm, Space} from "antd";
import {queryConfigDatas} from "@/api/auth/ConfigController.ts";
import {PlusOutlined} from "@ant-design/icons";
import CreateOrEditConfigFormData from "./CreateOrEditConfigFormData";
import CreateOrEditConfigFormOption from "./CreateOrEditConfigFormOption";

export interface IConfigDataTableProps {
    currentGroupId?: number | undefined
}

export type TableListItem = {
    id: number;
    key: string;
    label: string;
    value: number;
    type: string;
    createdAt: number;
    updateAt: number;
};

const ConfigFormTable: FC<IConfigDataTableProps> = (props: any) =>{
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDrawerVisible,setIsDrawerVisible] = useState<boolean>(false);
    const [editId, setEditId] = useState<number | undefined>(0);
    const actionRef = useRef<ActionType>(null);

    const { message} = App.useApp();

    const {
        currentGroupId
    } = props;


    useEffect(() => {
        actionRef?.current?.reload();
    }, [currentGroupId]);

    //自定查询
    const requestData = async (params: any): Promise<any> =>{
        try{

            const filter = omit(params, ['current', 'pageSize']);

            const rename = {
                groupId: currentGroupId,
                page: params.current,
                pageSize: params.pageSize,
            };

            const mergeParams = Object.assign({}, filter, rename);
            const ret = await queryConfigDatas(mergeParams);

            return {
                data: ret.data.data,
                total: ret.data.meta.pagination.total,
                success: ret.success,
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

    /**
     *  显示对话框
     * @param show
     * @param id
     */
    const isShowDrawer = (show: boolean, id?: number | undefined) => {
        setEditId(id);
        setIsDrawerVisible(show);
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
            width: 40,
            dataIndex: 'id',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            hideInSearch: true,
        },{
            title: (
                t('pages.searchTable.config.data.label')
            ),
            width: 40,
            align: 'center',
            dataIndex: 'label'
        },{
            title: (
                t('pages.searchTable.config.data.key')
            ),
            width: 20,
            align: 'center',
            dataIndex: 'key'
        },{
            title: (
                t('pages.searchTable.config.data.type')
            ),
            width: 10,
            align: 'center',
            dataIndex: 'type'
        },{
            title: (
                t('pages.searchTable.config.data.value')
            ),
            width: 20,
            align: 'center',
            dataIndex: 'value'
        },{
            title: (
                t('pages.searchTable.action')
            ),
            width: 60,
            key: 'option',
            valueType: 'option',
            align: 'center',
            render: (_,record) => (
                <Space>
                    <a key="link" className="text-blue-500" onClick={()=>isShowModal(true,record.id)}>
                        {t('pages.searchTable.edit')}
                    </a>
                    {(record.type === 'select' || record.type === 'radio') && <>
                        <a key="link-permission" className="text-blue-500" onClick={()=>isShowDrawer(true,record.id)}>
                            {t('pages.searchTable.config.option.select.edit')}
                        </a>
                    </>}
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
                request={requestData}
                className={'h-full'}
                rowKey="id"
                search={false}
                actionRef={actionRef}
                dateFormatter="string"
                headerTitle={
                    t('admin.config.data.list')
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

            {isModalVisible&&
                <CreateOrEditConfigFormData
                    isModalVisible={isModalVisible}
                    isShowModal={isShowModal}
                    actionRef = {actionRef}
                    groupId={currentGroupId}
                    editId={editId}
                />
            }

            {isDrawerVisible&&
                <CreateOrEditConfigFormOption
                    isDrawerVisible={isDrawerVisible}
                    isShowDrawer={isShowDrawer}
                    editId={editId}
                    actionRef={actionRef}
                />
            }

        </>
    )
}

export default ConfigFormTable;