import {FC} from "react";
import {Button, Card, Dropdown, Empty, MenuProps, Space, Spin, Tag} from "antd";
import {EllipsisOutlined, PlusOutlined, SyncOutlined, UserOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

/**
 * 字典卡面
 * @param props
 * @constructor
 */
const DictCard : FC<{
    dictDataList: any[],
    isShowModal: (show: boolean, id?: number | undefined) => void,
    reloadData: () => void,
    onTagClick: (idx: number) => void,
    isLoading: boolean,
    current: number
}> = (props: any)=>{
    const { t } = useTranslation();
    const { dictDataList, isShowModal, reloadData, isLoading, onTagClick, current } = props;

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
        if(e.key == "modify"){
            isShowModal(true, current)
        }else if(e.key == "delete"){

        }
    };

    const items: MenuProps['items'] = [
        {
            label: t('global.modify'),
            key: 'modify',
        },{
            label: t('global.delete'),
            key: 'delete'
        }
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const tagClick = (idx: number)=>{
        console.log(idx)
        onTagClick(idx);
    }

    return (
        <Card
            title={
                t('pages.tree.dict')
            }
            className={'h-full'}
            loading={isLoading}
            extra={
                <Space>
                    <Button type="text" icon={<SyncOutlined />}  onClick={reloadData}/>
                    <Button type="text" icon={<PlusOutlined />}  onClick={isShowModal} />
                </Space>
            }
        >
            {dictDataList.length ==0 && <Empty/>}
            {dictDataList.length >=0 &&
                dictDataList.map((item: any)=>{
                    return (
                        <Tag
                            className={'w-full text-sm flex items-center justify-between'}
                            key={item.id}
                            color={current == item.id ? 'processing' : 'default'}
                            style={{marginBottom: '2px'}}
                            onClick={()=>tagClick(item.id)}
                        >
                            {item.name}
                            <Dropdown
                                menu={menuProps}
                                placement="bottomRight"
                            >
                                <Button icon={<EllipsisOutlined />} type={'text'}/>
                            </Dropdown>
                        </Tag>
                    )
                })
            }
        </Card>
    )
}

export default DictCard;