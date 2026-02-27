import {FC, useRef, useState} from "react";
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {useTranslation} from "react-i18next";
import {App, Button, Popconfirm, Space} from "antd";
import CustomerPageContainer from '@/components/CustomerPageContainer';
import {PlusOutlined} from "@ant-design/icons";
import {queryDepartments} from "@/api/auth/DepartmentController";
import CreateOrEdit from './components/CreateOrEdit'
import {treeToList} from "@/utils/utils.ts";


export type TableListItem = {
    id: number;
    name: string;
    created_at: number;
    update_at: number;
};


const Department:FC = () =>{
    const [ departmentData, setDepartmentData ] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState<any>([])
    const [editId, setEditId] = useState<number | undefined>(0);

    const actionRef = useRef<ActionType>(null)

    const { t } = useTranslation();

    const { message } = App.useApp();

    //获取用户用户列表
    const requestData = async (): Promise<any> => {
        try {
            const ret = await queryDepartments();
            setDepartmentData(ret.data);

            const treeList = treeToList(ret.data);
            const _defaultExpandedRowKeys = treeList.map((item)=>{
                return item.id;
            })
            setDefaultExpandedRowKeys(_defaultExpandedRowKeys);

            return {
                data: ret.data,
                success: ret.status === 200,
            };
        }catch (error: any){
            message.error(error.data.message);
        }
    };

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
                t('admin.department')
            }
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                headerTitle={
                    t('admin.department.list')
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

            {isModalVisible &&
                <CreateOrEdit
                    isModalVisible={isModalVisible}
                    isShowModal={isShowModal}
                    actionRef={actionRef}
                    departmentData ={departmentData}
                    editId={editId}
                />
            }
        </CustomerPageContainer>
    )
}

export default Department