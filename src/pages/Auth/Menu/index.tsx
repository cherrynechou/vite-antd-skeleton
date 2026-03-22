import {FC, useState} from "react";
import {Button, Card, Col, Row, Space} from "antd";
import { useTranslation } from 'react-i18next';
import {
    MinusSquareOutlined,
    PlusSquareOutlined, ReloadOutlined,
    SaveOutlined
} from "@ant-design/icons";
import {useAsyncEffect} from "ahooks";
import { queryMenus } from '@/api/auth/MenuController';

export interface IMenuItemProps  {
    item: any,
    level: number
}


const Menu:FC = () =>{
    const { t } = useTranslation();
    const [menuData,setMenuData] = useState<any>([]);

    //自定查询
    const requestData = async () =>{
        const ret = await queryMenus();
        setMenuData(ret.data);

    }


    useAsyncEffect(async () => {
        await requestData();
    }, []);


    const MenuItem:FC<IMenuItemProps>=({
        item,
        level
    })=>{
        return (
            <li style={{ paddingLeft: `${level * 20}px` }}>
                <div>
                    {item.name}
                </div>
                {item.children && item.children.length > 0 && (
                    <ol>
                        {item.children.map((child:any)=>(
                            <MenuItem key={child.id} item={child} level={level+1}/>
                        ))}
                    </ol>
                )}
            </li>
        )
    }


    return (
        <Row
            gutter={24}
            className={'h-full'}
        >
            <Col
                span={14}
                className={'h-full'}
            >
                <Card
                    title={
                        <Space>
                            <Button  type="primary" icon={<PlusSquareOutlined />}>{t('pages.menu.tree.expand')}</Button>
                            <Button  type="primary" icon={<MinusSquareOutlined />}>{t('pages.menu.tree.collapse')}</Button>
                            <Button  icon={<SaveOutlined />}>{t('pages.menu.tree.save')}</Button>
                            <Button  icon={<ReloadOutlined />}>{t('pages.menu.tree.refresh')}</Button>
                        </Space>
                    }
                >
                    <ol>
                        {menuData.map((item:any) => (
                            <MenuItem key={item.id} item={item} level={1}/>
                        ))}
                    </ol>
                </Card>
            </Col>
            <Col
                span={10}
                className={'h-full'}
            >
                <Card title={
                    t('pages.menu.add')
                }>

                </Card>
            </Col>
        </Row>
    )
}

export default Menu;