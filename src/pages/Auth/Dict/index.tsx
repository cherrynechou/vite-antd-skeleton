import { FC, useRef, useState } from 'react';
import {App, Button, Col, Popconfirm, Row, Space, Switch, Tag} from "antd";
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {useTranslation} from "react-i18next";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {PlusOutlined} from "@ant-design/icons";
import {useAsyncEffect} from "ahooks";
import DictCard from "./components/DictCard.tsx";
import {nanoid} from "nanoid";
import {queryDicts} from "@/api/auth/DictController.ts";
import {queryDictDatas} from "@/api/auth/DictDataController";
import {omit,first} from "lodash-es";
import CreateOrEdit from "./components/CreateOrEdit";
import CreateOrEditData from "./components/CreateOrEditData";


export type TableListItem = {
    id: number;
    name: string;
    code: string;
    status: number;
    isDefault: number;
    createdAt: number;
    updateAt: number;
};

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};


const Dict : FC = () =>{
    const { t } = useTranslation();
    const [currentDictId,setCurrentDictId] = useState<number>(0);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [dictDataList,setDictDataList] = useState<any>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDataModalVisible,setIsDataModalVisible] = useState<boolean>(false);
    const [editId, setEditId] = useState<number | undefined>(0);
    const [dictId,setDictId] = useState<number | undefined>(0);
    const actionRef = useRef<ActionType>(null);

    const { message} = App.useApp();

    const fetchApi = async () => {
        setIsLoading(true);
        const dictRes = await queryDicts();
        const currentData = dictRes.data;
        const firstDict: any = first(currentData.data);
        setCurrentDictId( firstDict.id );
        setDictDataList( currentData.data );
        setIsLoading(false);
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);


    //自定查询
    const requestData = async (params: any): Promise<any> =>{
        try{
            await waitTime(1000);

            const filter = omit(params, ['current', 'pageSize']);
            setDictId(currentDictId);

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
     * 删除id
     * @param id
     */
    const confirmDel = async (id: number) => {
        try {


        }catch (error: any){

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
    const isShowDataModal = (show: boolean, id?: number | undefined)=> {
        setEditId(id);
        setIsDataModalVisible(show);
    }

    /**
     * 点击 数据
     * @param idx
     */
    const onTagClick =  (idx: number)=>{
        setCurrentDictId(idx);
        actionRef?.current?.reload();
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
                t('pages.searchTable.createdAt')
            ),
            width: 120,
            align: 'center',
            dataIndex: 'created_at',
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
            <Row
                gutter={24}
                className={'h-full'}
            >
                <Col
                    span={4}
                    className={'h-full'}
                >
                    <DictCard
                        dictDataList={dictDataList}
                        current={currentDictId}
                        isShowModal={isShowModal}
                        reloadData={()=>fetchApi()}
                        isLoading={isLoading}
                        onTagClick={(idx: number)=>onTagClick(idx)}
                    />
                </Col>
                <Col
                    span={20}
                    className={'h-full'}
                >
                    <ProTable<TableListItem>
                        columns={columns}
                        request={requestData}
                        className={'h-full'}
                        rowKey="dataId"
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
                            <Button key="button" type="primary" icon={<PlusOutlined />}  onClick={()=>isShowDataModal(true)}>
                                {t('pages.searchTable.new')}
                            </Button>,
                        ]}
                    />
                </Col>
            </Row>

            {isModalVisible &&
                <CreateOrEdit
                    isModalVisible={isModalVisible}
                    isShowModal={isShowModal}
                    actionRef = {actionRef}
                    editId = {editId}
                />
            }

            {isDataModalVisible&&
                <CreateOrEditData
                    isModalVisible={isDataModalVisible}
                    isShowModal={isShowDataModal}
                    actionRef = {actionRef}
                    dictId={dictId}
                    editId={editId}
                />
            }
        </>
    )
}

export default Dict;