import {FC} from "react";
import {Button, Card, Col, Row, Space} from "antd";
import { useTranslation } from 'react-i18next';
import {
    MinusSquareOutlined,
    PlusSquareOutlined, ReloadOutlined,
    SaveOutlined
} from "@ant-design/icons";

const Menu:FC = () =>{
    const { t } = useTranslation();
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