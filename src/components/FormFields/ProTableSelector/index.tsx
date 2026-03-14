import {FC, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Select,App,Modal} from 'antd';
import type {  TableProps } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {omit,map} from "es-toolkit/compat";
import {useAsyncEffect} from "ahooks";

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export interface IProTableSelectorProps {
    title: string;
    onChange?: (value: number | number[] | null) => void;
    mode?: 'single' | 'multiple';
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    rowKey?: string; // 表格行key
    value?: number | number[] | null; // 受控值
}

export type TableListItem = {
    id: number;
    created_at: number;
    update_at: number;
};

const ProTableSelector:FC<IProTableSelectorProps> = ({
         title,
         rowKey = "id",
         onChange,
         mode,
         placeholder,
         disabled,
         readonly,
         value
}) =>{

    const { t } = useTranslation();
    const [rowDataList,setRowDataList] = useState<any>([]);
    const [selectedRows,setSelectedRows] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] =useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const actionRef = useRef<ActionType>(null)

    const { message } = App.useApp();

    useAsyncEffect(async() => {
        if(!value){
            setSelectedRows([]);
            setSelectedRowKeys([]);
            return;
        }

        const keys = Array.isArray(value) ? value : [value];
        const searchKeys = {
            ids: keys.join(',')
        }

        //const searchArticleRes = await queryAllArticles(searchKeys)
        //const searchArticleData = searchArticleRes.data;
        //setRowDataList(searchArticleData);
        //setSelectedRows(searchArticleData);

        //const rowKeys = searchArticleData.map((article: any)=>article.id);
        //setSelectedRowKeys(rowKeys);
    }, [value]);


    //获取用户用户列表
    // const requestData = async (params: any): Promise<any> => {
    //     setLoading(true);
    //     try {
    //         const filter = omit(params, ['current', 'pageSize']);
    //         const rename = {
    //             page: params.current,
    //             pageSize: params.pageSize,
    //         };
    //         const mergeParams = Object.assign({}, filter, rename);
    //         const ret = await queryArticles(mergeParams);
    //
    //         const tableData = ret?.data?.data;
    //
    //         setRowDataList(tableData);
    //         setLoading(false);
    //         return {
    //             data: tableData,
    //             total: ret.data.meta.pagination.total,
    //             success: ret.success,
    //         };
    //     }catch (error: any){
    //         setLoading(false);
    //         message.error(error.message);
    //     }
    // };

    //选择行
    const rowSelection: TableRowSelection<TableListItem> = {
        type: mode === 'single' ? 'radio' : 'checkbox', // 关键：设置为 radio 实现单选
        selectedRowKeys,
        onChange: (selectedRowKeys: any,selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
            // 可在此处处理选中变化的逻辑，如获取选中行的完整数据
        },
        // 可选：设置列宽
        columnWidth: '60px',
        ...(mode === 'single' && {
            alwaysShowAlert: false,
        }),
    };


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
                t('pages.searchTable.title')
            ),
            width: 140,
            align: 'center',
            dataIndex: 'title',
        }
    ];

    const selectOptions = useMemo(()=>{
        return rowDataList.map((item: any)=>({
            label: item.title,
            value: item.id!
        }));
    },[rowDataList])

    //提交
    const handleOk = async () =>{
        try {
            onChange?.(mode === 'single' ? (selectedRows[0]?.id || null): selectedRows.map((u: any)=>u.id!));
            setOpen(false);
        }catch (error: any){
            message.error(error.message);
        }finally {
            setOpen(false);
        }
    }

    //取消
    const handleCancel = async() =>{
        if(!value){
            setSelectedRows([]);
            setSelectedRowKeys([]);
        }else{
            const keys = Array.isArray(value) ? value : [value];
            setSelectedRowKeys(keys);
        }

        setOpen(false)
    }

    return (
        <>
            <Select
                mode={mode === 'multiple' ? 'multiple' : undefined}
                value={mode == 'single' ? selectedRows[0].id || undefined : selectedRows.map((u: any)=>u.id)}
                placeholder={placeholder}
                options={selectOptions}
                open={false}
                onClick={() => !disabled && !readonly &&  setOpen(true)}
                style={{ width: '100%' }}
                disabled={disabled}
                loading={loading}
                allowClear
                onClear={()=>{
                    setSelectedRows([]);
                    setSelectedRowKeys([]);
                    onChange?.(mode === 'single' ? null : []);
                }}
            />

            <Modal
                title={title}
                open={open}
                width={1000}
                onCancel={handleCancel}
                onOk={handleOk}
                destroyOnHidden
            >
                <ProTable<TableListItem>
                    columns={columns}
                    actionRef={actionRef}
                    //request={requestData}
                    rowKey={rowKey}
                    dateFormatter="string"
                    search={false}
                    tableAlertRender={false}    // 去掉默认的信息提示框
                    rowSelection={rowSelection}
                />
            </Modal>
        </>
    )
}

export default ProTableSelector;