import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
    Row,
    Form,
    Input,
    Button,
    message
} from 'antd';
import type { FormProps } from 'antd';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom'
import useStore from '@/stores'
import localforage from 'localforage';
import { login } from '@/services/admin/system/basic';
import { queryCurrentUser } from '@/services/admin/auth/user';

import logoSvg from '@/assets/images/logo.svg'

type TLoginFieldType = {
    username?: string;
    password?: string;
};

type TAccessTokenEntity = {
    access_token: string;
    token_type: string;
}

import './index.less';



/**
 * 设置凭证
 * @param data
 */
const setAccessToken = async (data: TAccessTokenEntity) =>{
     await localforage.setItem('access_token', data.access_token);
     await localforage.setItem('token_type', data.token_type);
}

const Login = ()=>{
    const setCurrentUser = useStore(state=>state.setCurrentUser);
    const navigate = useNavigate()
    const { t } = useTranslation();

    const fetchUserInfo = async ()=>{
        const userInfo = await queryCurrentUser();
        if(userInfo){
            await setCurrentUser(userInfo);
        }
    }

    /**
     * 用户登录
     * @param values
     */
    const onFinish: FormProps<TLoginFieldType>['onFinish'] = async (values) => {
        try {
            const res = await login(values);

            if(res.status === HttpStatusCode.Ok){
                const loginRes = res.data;
                await setAccessToken(loginRes);
                message.success(t('system.loginSuccess'));

                await fetchUserInfo();

                navigate( '/')

            }
        }catch (error){

        }
    }


    return (
        <div className="login-main">
            <Row
                align="top"
                justify="center"
                className="px-3"
                style={{ minHeight: '100vh', background: '#fff' }}
            >
                <div className="login-box">
                    <div className="login-page-header flex align-center">
                        <img className="login-logo" src={logoSvg} alt="logo" />
                        <span className="login-page-desc">{t('system.title')}</span>
                    </div>

                    <Form
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '用户名是必填项！' }]}
                        >
                            <Input
                                size="large"
                                prefix={<UserOutlined/>}
                                placeholder="请输入用户名"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '密码是必填项！' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined/>}
                                placeholder="请输入密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Row>
        </div>
    )
}

export default Login;