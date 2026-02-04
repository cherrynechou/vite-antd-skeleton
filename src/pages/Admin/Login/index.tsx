import { FC, useState } from 'react';
import { Form, Input,App } from 'antd';
import type { FormProps } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import type { Rule } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import useAuthUserStore from '@/stores/user'

export type LoginFieldProps = {
    username?: string;
    password?: string;
};

const Login: FC = () =>{
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const login = useAuthUserStore(state => state.login);
    const { message } = App.useApp();

    // 表单验证规则
    const emailRules: Rule[] = [
        { required: true, message: '请输入您的帐号' },
        { min:2, type: 'string', message: '请输入有效的帐号,至少两个字符' },
    ];

    const passwordRules: Rule[] = [
        { required: true, message: '请输入您的密码' },
    ];

    const onFinish: FormProps<LoginFieldProps>['onFinish'] = async (values) =>{
        try {
            console.log(values);
            setIsLoading(true);
            await login(values);
            message.success(t('login.success'));
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }catch (error: any){
            console.log(error);
            setIsLoading(false);
            message.error(error.data.message);
        }
    }

    return (
        <div className={"min-h-screen gradient-bg flex items-center justify-center p-4"}>
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col lg:flex-row min-h-96">
                {/* 左侧品牌区域 */}
                <div className="lg:w-1/2 p-12 flex flex-col justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
                    {/* 装饰性背景元素 */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">欢迎回来</h1>
                            <p className="text-blue-100 text-lg">登录您的企业账户，开启高效办公之旅</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                </div>
                                <span className="text-blue-100">企业级安全保障</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span className="text-blue-100">极速响应体验</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span className="text-blue-100">7×24小时技术支持</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧登录表单 */}
                <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">账号登录</h2>
                            <p className="text-gray-500">请使用您的企业账号登录系统</p>
                        </div>
                        <Form
                            onFinish={onFinish}
                            autoComplete="off"
                            className="space-y-2"
                        >
                            {/* 邮箱输入框 */}
                            <Form.Item
                                name="username"
                                rules={emailRules}
                                className="mb-6"
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="请输入您的帐号"
                                    size="large"
                                    className="py-3"
                                />
                            </Form.Item>

                            {/* 密码输入框 */}
                            <Form.Item
                                name="password"
                                rules={passwordRules}
                                className="mb-4"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder="请输入您的密码"
                                    size="large"
                                    className="py-3"
                                    iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>登录中...</span>
                                    </>
                                ) : (
                                    <span>登 录</span>
                                )}
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;