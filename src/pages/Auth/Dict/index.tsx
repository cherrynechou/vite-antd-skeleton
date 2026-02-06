import {FC, useRef, useState} from "react";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {App, Button, Popconfirm, Space, Tag} from "antd";
import {useTranslation} from "react-i18next";
import CustomerPageContainer from "@/components/CustomerPageContainer";
import {ProTable} from '@ant-design/pro-components';
import {PlusOutlined} from "@ant-design/icons";
import {destroyDict, queryDicts} from "@/api/auth/DictController";
import {omit} from "lodash-es";
import CreateOrEdit from "./components/CreateOrEdit.tsx";
import CreateOrEditData from "@/pages/Auth/Dict/components/CreateOrEditData.tsx";

export type TableListItem = {
    id: number;
    name: string;
    code: string;
    status: number;
    createdAt: number;
    updateAt: number;
};

const Dict: FC = ()=>{
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDataModalVisible,setIsDataModalVisible] = useState<boolean>(false);
    const [editId, setEditId] = useState<number| undefined>(0);

    const actionRef = useRef<ActionType>(null);

    const { message } = App.useApp();

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

            console.log(ret);

            return {
                data: ret.data.data,
                total: ret.data.meta.pagination.total,
                success: ret.status === 200,
            }

        }catch (error: any){
            message.error(error.data.message);
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
     * 显示字典数据
     * @param show
     * @param id
     */
    const isShowDataModal = (show: boolean, id?: number | undefined)=> {
        setEditId(id);
        setIsDataModalVisible(show);
    }

    /**
     * 删除id
     * @param id
     */
    const confirmDel = async (id: number) => {
        try {
            await destroyDict(id);

            const defaultDeleteSuccessMessage = t('global.delete.success');

            message.success(defaultDeleteSuccessMessage);
            actionRef.current?.reload();

        }catch (error: any){
            message.error(error.message);
        }
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
        },{
            title: (
                t('pages.searchTable.name')
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
            dataIndex: 'code'
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
                    <Tag color="red">
                        {t('global.switch.unChecked.label')}
                    </Tag> :
                    <Tag color="green">
                        {t('global.switch.checked.label')}
                    </Tag>
            )
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
                    <a key="link" className="text-blue-500" onClick={() => isShowModal(true, record.id)}>
                        {t('pages.searchTable.edit')}
                    </a>
                    <a key="config" className="text-blue-500" onClick={()=>isShowDataModal(true,record.id)}>
                        {t('pages.searchTable.dict.data')}
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
        <CustomerPageContainer
            title={
                t('admin.dict')
            }
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                    t('admin.dict.list')
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

            {isDataModalVisible &&
                <CreateOrEditData
                    isModalVisible={isDataModalVisible}
                    isShowModal={isShowDataModal}
                    actionRef={actionRef}
                    editId={editId}
                />
            }

        </CustomerPageContainer>
    )
}

export default Dict;