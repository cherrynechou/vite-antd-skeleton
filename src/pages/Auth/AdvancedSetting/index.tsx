import {FC, useState, useEffect} from "react";
import {Form, Button, Space, Input, App, Skeleton, InputNumber, Select, Radio, Switch} from 'antd';
import CustomerPageContainer from '@/components/CustomerPageContainer';
import { Card,Empty } from 'antd';
import {useTranslation} from "react-i18next";
import {updateConfigByGroup, queryAllConfig} from "@/api/auth/SettingController";
import {useNavigate} from "react-router-dom";
import {useAsyncEffect} from "ahooks";

const tailLayout = {
    wrapperCol: { offset: 2, span: 16 },
};

const { TextArea } = Input;

const AdvancedSetting: FC = () =>{
    const { t } = useTranslation();
    const [ initialValues, setInitialValues ] = useState<any>({});
    const [tabData, setTabData] = useState<any>([]);
    const [isEmpty,setIsEmpty] = useState<boolean>(false);
    const [activeTabKey, setActiveTabKey] = useState('');
    const navigate = useNavigate();

    const [ form ] = Form.useForm();
    const { message } = App.useApp();

    const fetchApi = async () => {
        try{
            const ret = await queryAllConfig();
            const retData = ret.data;
            if(retData.length == 0){
                setIsEmpty(true);
                return;
            }

            const tabs = retData.map((item: any)=>({
                key: item.key,
                tab: item.name,
                content: renderFormItems(item.configs)
            }));

            //配置数组
            const configData:any = {};
            retData.forEach((sub: any) => {
                sub.configs.forEach((element: any) => {
                    configData[element.key] = element.value;
                });
            });

            setInitialValues(configData);
            setTabData(tabs);
            if (tabs.length > 0) {
                setActiveTabKey(tabs[0].key);
            }

        }catch(error: any){
            message.error(error.message);
        }
    }

    useAsyncEffect(async () => {
        await fetchApi();
    }, []);


    //表单内容
    const currentContent = tabData.find((item: any) => item.key === activeTabKey)?.content || '暂无内容';

    const onTabChange = (key: string) => {
        setActiveTabKey(key);
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
                            key={field.key}
                            {...commonProps}
                        >
                            <Input  placeholder={
                                field.placeholder
                            }/>
                        </Form.Item>
                    );
                case 'inputNumber':
                    return (
                        <Form.Item
                            key={field.key}
                            {...commonProps}
                        >
                            <InputNumber placeholder={
                                field.placeholder
                            }/>
                        </Form.Item>
                    );
                case 'select':
                    return (
                        <Form.Item
                            key={field.key}
                            {...commonProps}
                        >
                            <Select
                                options={field.options}
                                style={{ width: 400 }}
                                placeholder={
                                    field.placeholder
                                }
                            />
                        </Form.Item>
                    )
                case 'textArea':
                    return (
                        <Form.Item
                            key={field.key}
                            {...commonProps}
                        >
                            <TextArea
                                rows={field.rows}
                            />
                        </Form.Item>
                    )
                case 'radio':
                    return (
                        <Form.Item
                            key={field.key}
                            {...commonProps}
                        >
                            <Radio.Group
                                options={field.options}
                            />
                        </Form.Item>
                    )
                case 'switch':
                    return (
                        <Form.Item
                            key={field.key}
                            {...commonProps}
                        >
                            <Switch />
                        </Form.Item>
                    )
            }
        })
    }


    const onFinish = async (values: any) =>{
        try{
            await updateConfigByGroup(activeTabKey, values);
            message.success(t('global.update.success'));
        }catch (error: any){
            message.error(error.message);
        }
    }


    const FormCard = ()=>{
        return (
            <Card
                style={{ width: '100%' }}
                tabList={tabData}
                activeTabKey={activeTabKey}
                onTabChange={key => {
                    onTabChange(key);
                }}
            >
                {
                    Object.keys(initialValues).length === 0 ? <Skeleton paragraph={{ rows: 4 }} /> : (
                        <Form
                            name="config-set"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 16 }}
                            form={form}
                            initialValues={initialValues}
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
                    )
                }
            </Card>
        )
    }

    return (
        <CustomerPageContainer
            title={
                t('admin.config')
            }
            extra={[
                <Button key="config" type="primary" onClick={()=>navigate('/tool/config')}>{t('pages.tool.config')}</Button>,
            ]}
        >
            {isEmpty && <Empty /> }
            {!isEmpty && <FormCard /> }
        </CustomerPageContainer>
    )
}

export default AdvancedSetting;