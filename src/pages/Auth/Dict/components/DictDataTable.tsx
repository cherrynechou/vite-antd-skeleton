import {FC, useEffect, useRef, useState} from "react";
import { ProTable } from '@ant-design/pro-components';
import {useTranslation} from "react-i18next";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {nanoid} from "nanoid";
import {Popconfirm, Space, Switch, Tag, App, Button} from 'antd';
import {omit} from 'es-toolkit/compat'
import {queryDictDatas} from '@/api/auth/DictDataController'
import {PlusOutlined} from '@ant-design/icons'
import CreateOrEditDictData from './CreateOrEditDictData'

export interface IDictDataTableProps {
    currentDictId?: number | undefined;
}

export type TableListItem = {
    id: number;
    name: string;
    code: string;
    status: number;
    isDefault: number;
    createdAt: number;
    updateAt: number;
};

const DictDataTable:FC<IDictDataTableProps>=(props: any)=>{
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editId, setEditId] = useState<number | undefined>(0);
    const actionRef = useRef<ActionType>(null);

    const { message} = App.useApp();

    const {
        currentDictId
    } = props;


    useEffect(() => {
        actionRef?.current?.reload();
    }, [currentDictId]);


    //自定查询
    const requestData = async (params: any): Promise<any> =>{
        try{

            const filter = omit(params, ['current', 'pageSize']);

            const rename = {
                dictId: currentDictId,
                page: params.current,
                pageSize: params.pageSize,
            };

            const mergeParams = Object.assign({}, filter, rename);
            const ret = await queryDictDatas(mergeParams);

            return {
                data: ret.data.data,
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
    const isShowDataModal = (show: boolean, id?: number | undefined)=> {
        setEditId(id);
        setIsModalVisible(show);
    }

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
                t('pages.searchTable.dict.data.label')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'label'
        },{
            title: (
                t('pages.searchTable.dict.data.value')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'value'
        },{
            title: (
                t('pages.searchTable.dict.data.isDefault')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'isDefault',
            hideInSearch: true,
            render: (_, record) => (
                <Switch
                    key={nanoid()}
                    checkedChildren={t('global.switch.true.label')}
                    unCheckedChildren={t('global.switch.false.label')}
                    defaultChecked={record.isDefault === 1}
                />
            ),
        },{
            title: (
                t('pages.searchTable.dict.data.sort')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'sort',
            hideInSearch: true,
        },{
            title: (
                t('pages.searchTable.status')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'status',
            hideInSearch: true,
            render:(_,record)=>(
                record.status == 0 ?
                    <Tag color="red">{t('global.switch.unChecked.label')}</Tag> :
                    <Tag color="green">{t('global.switch.checked.label')}</Tag>
            )
        },{
            title: (
                t('pages.searchTable.action')
            ),
            width: 80,
            key: 'option',
            valueType: 'option',
            align: 'center',
            render: (_,record) => (
                <Space>
                    <a key="link" className="text-blue-500" onClick={()=>isShowDataModal(true,record.id)}>
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
                request={requestData}
                className={'h-full'}
                rowKey="id"
                options={false}
                search={false}
                actionRef={actionRef}
                dateFormatter="string"
                headerTitle={
                    t('admin.dict.data.list')
                }
                pagination={{
                    pageSize: 15,
                    showSizeChanger: false,
                    showQuickJumper: true
                }}
                toolBarRender={() => [
                    <Button key="button" type="primary" icon={<PlusOutlined />}  onClick={()=>isShowDataModal(true)}>
                        {t('pages.searchTable.new')}
                    </Button>,
                ]}
            />

            {isModalVisible&&
                <CreateOrEditDictData
                    isModalVisible={isModalVisible}
                    isShowModal={isShowDataModal}
                    actionRef = {actionRef}
                    dictId={currentDictId}
                    editId={editId}
                />
            }
        </>
    )
}

export default DictDataTable;