import { FC } from 'react';
import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import { Space, Tabs, message, theme } from 'antd';
import {
    LoginFormPage,
    ProFormText
} from '@ant-design/pro-components'

const Login: FC=()=>{
    const { token } = theme.useToken();


    return (
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
            <LoginFormPage
                backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
                logo="https://jinpika-1308276765.cos.ap-shanghai.myqcloud.com/images/logo.png"
                title="JinPiKa"
                subTitle="全球最大的代码托管平台"
            >
                <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'用户名: admin or user'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                />

                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                        strengthText:
                            'Password should contain numbers, letters and special characters, at least 8 characters long.',
                        statusRender: (value) => {
                            const getStatus = () => {
                                if (value && value.length > 12) {
                                    return 'ok';
                                }
                                if (value && value.length > 6) {
                                    return 'pass';
                                }
                                return 'poor';
                            };
                            const status = getStatus();
                            if (status === 'pass') {
                                return (
                                    <div style={{ color: token.colorWarning }}>
                                        强度：中
                                    </div>
                                );
                            }
                            if (status === 'ok') {
                                return (
                                    <div style={{ color: token.colorSuccess }}>
                                        强度：强
                                    </div>
                                );
                            }
                            return (
                                <div style={{ color: token.colorError }}>强度：弱</div>
                            );
                        },
                    }}
                    placeholder={'密码: ant.design'}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />

            </LoginFormPage>

        </div>
    )
}

export default Login;