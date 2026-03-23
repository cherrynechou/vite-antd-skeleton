import {FC, useState} from "react";
import {Button, Card, Col, Row, Space} from "antd";
import { useTranslation } from 'react-i18next';
import SortableMenuTree from './components/SortableMenuTree'
import {
    MinusSquareOutlined,
    PlusOutlined,
    PlusSquareOutlined,
    ReloadOutlined,
    SaveOutlined
} from "@ant-design/icons";


const Menu:FC = () =>{
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editId, setEditId] = useState<number | string | undefined>(0);

    /**
     *  显示对话框
     * @param show
     * @param id
     */
    const isShowModal = (show: boolean, id?: number | undefined) => {
        setEditId(id);
        setIsModalVisible(show);
    };

    return (
        <>
            <Row
                gutter={24}
                className={'h-full'}
            >
                <Col
                    span={24}
                    className={'h-full'}
                >
                    <Card
                        title={
                            <Space>
                                <Button  type="primary" icon={<PlusSquareOutlined />}>
                                    {t('pages.menu.tree.expand')}
                                </Button>
                                <Button  type="primary" icon={<MinusSquareOutlined />}>
                                    {t('pages.menu.tree.collapse')}
                                </Button>
                                <Button  icon={<SaveOutlined />}>
                                    {t('pages.menu.tree.save')}
                                </Button>
                                <Button  icon={<ReloadOutlined />}>
                                    {t('pages.menu.tree.refresh')}
                                </Button>
                            </Space>
                        }
                        extra={
                            <Button key="button" type="primary" icon={<PlusOutlined />} onClick={() => isShowModal(true)}>
                                {t('pages.searchTable.new')}
                            </Button>
                        }
                    >
                        <SortableMenuTree
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                            editId={editId}
                            setEditId={setEditId}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Menu;