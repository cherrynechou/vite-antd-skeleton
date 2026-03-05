import {FC, useState, ReactNode, useEffect} from "react";
import {Form, Button, Space, Input, App} from 'antd';
import CustomerPageContainer from '@/components/CustomerPageContainer';
import { Card } from 'antd';
import {useTranslation} from "react-i18next";
import {queryAllConfig} from "@/api/auth/ConfigController.ts";
import {useNavigate} from "react-router-dom";

const tailLayout = {
    wrapperCol: { offset: 2, span: 16 },
};

const AdvancedSetting: FC = () =>{
    const { t } = useTranslation();
    const [tabLoading, setTabLoading] = useState<boolean>(true);
    const [tabData, setTabData] = useState<any>([]);
    const [activeTabKey, setActiveTabKey] = useState('');
    const [ tabKey, setTabKey ] = useState<string>('');
    const navigate = useNavigate();

    const [ form ] = Form.useForm();
    const { message } = App.useApp();

    useEffect(() => {
        const fetchData = async () =>{
            try{
                const ret = await queryAllConfig();
                const retData = ret.data;
                const tabs = retData.map((item: any)=>({
                    key: item.key,
                    tab: item.name,
                    content: renderFormItems(item.configs)
                }));

                setTabData(tabs);
                if (tabs.length > 0) {
                    setActiveTabKey(tabs[0].key);
                }

            }catch(error: any){
                message.error(error.message);
            }
        }
        fetchData();
    }, []);


    useEffect(() => {

    }, [activeTabKey]);

    //表单内容
    const currentContent = tabData.find((item: any) => item.key === activeTabKey)?.content || '暂无内容';

    const onTabChange = (key: string) => {
        setTabKey(key);
    };


    const renderFormItems = (configItems: any[]) => {
        return configItems.map((field: any)=>{
            const commonProps = {
                name: field.key,
                label: field.label,
                rules: field.rules,
            };

            switch (field.type){
                case 'input':
                    return (
                        <Form.Item
                            {...commonProps}
                        >
                            <Input key={field.key}  placeholder={
                                field.placeholder
                            }/>
                        </Form.Item>
                    );
            }
        })
    }


    const onFinish = async (values: any) =>{
        console.log(values)
    }

    return (
        <CustomerPageContainer
            title={
                t('admin.config')
            }
            extra={[
                <Button key="config" type="primary" onClick={()=>navigate('/form-design/configs')}>表单配置</Button>,
            ]}
        >
            <Card
                style={{ width: '100%' }}
                tabList={tabData}
                activeTabKey={activeTabKey}
                onTabChange={key => {
                    onTabChange(key);
                }}
            >
                <Form
                    name="config-set"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {currentContent}

                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <Button htmlType="button">
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </CustomerPageContainer>
    )
}

export default AdvancedSetting;