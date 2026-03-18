import {FC, useRef} from "react";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import CustomerPageContainer from '@/components/CustomerPageContainer';
import {useTranslation} from "react-i18next";
import {ProTable} from "@ant-design/pro-components";
import {App} from "antd";
import {omit} from "es-toolkit/compat";
import {queryLogins} from "@/api/auth/LogController";

export type TableListItem = {
    id: number;
    created_by: string;
    created_at: number;
    update_at: number;
};

const Login:FC = () =>{
    const { t } = useTranslation();
    const actionRef = useRef<ActionType>(null)
    const { message } = App.useApp();

    //获取用户用户列表
    const requestData = async (params: any): Promise<any> => {
        try {
            const filter = omit(params, ['current', 'pageSize']);
            const rename = {
                page: params.current,
                pageSize: params.pageSize,
            };
            const mergeParams = Object.assign({}, filter, rename);
            const ret = await queryLogins(mergeParams);

            return {
                data: ret.data.data,
                total: ret.data.meta.pagination.total,
                success: ret.success,
            };
        }catch (error: any){
            message.error(error.data.message);
        }
    };

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
                t('pages.searchTable.account')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'account'
        },{
            title: (
                t('pages.searchTable.loginIp')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'login_ip'
        },{
            title: (
                t('pages.searchTable.browser')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'browser',
            hideInSearch: true,
        }, {
            title: (
                t('pages.searchTable.platform')
            ),
            width: 80,
            align: 'center',
            dataIndex: 'platform',
            hideInSearch: true,
        },{
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
        }
    ];

    return (
        <CustomerPageContainer
            title={
                t('admin.log.operation')
            }
        >
            <ProTable<TableListItem>
                columns={columns}
                actionRef={actionRef}
                request={requestData}
                rowKey="id"
                dateFormatter="string"
                search={false}
                headerTitle={
                    t('admin.log.operation.list')
                }
                rowSelection={{ fixed: true }}
            />
        </CustomerPageContainer>
    )
}

export default Login;