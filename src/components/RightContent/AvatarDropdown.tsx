import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import React, { useCallback } from 'react';
import { Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useNavigate } from 'react-router-dom'
import HeaderDropdown from '../HeaderDropdown';
import { loginPath } from '@/constants/pages'
import { userStore } from '@/stores'
import localforage from 'localforage';


export type GlobalHeaderRightProps = {
    menu?: boolean;
    children?: React.ReactNode;
};

export const AvatarName = () => {
    const currentUser = userStore(state=>state.currentUser);
    return <span className="anticon">{currentUser?.name}</span>;
};

const useStyles = createStyles(({ token }) => {
    return {
        action: {
            display: 'flex',
            height: '48px',
            marginLeft: 'auto',
            overflow: 'hidden',
            alignItems: 'center',
            padding: '0 8px',
            cursor: 'pointer',
            borderRadius: token.borderRadius,
            '&:hover': {
                backgroundColor: token.colorBgTextHover,
            },
        },
    };
});

/**
 * 清除accesstoken
 */
const clearAccessToken = async () =>{
  await localforage.removeItem('access_token');
  await localforage.removeItem('token_type');
}

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
    const navigate = useNavigate();
  
  const currentUser = userStore(state=>state.currentUser);
    /**
     * 退出登录，并且将当前的 url 保存
     */
    const loginOut = async () => {
        const { search, pathname } = window.location;
        const urlParams = new URL(window.location.href).searchParams;
        /** 此方法会跳转到 redirect 参数所在的位置 */
        const redirect = urlParams.get('redirect');
        // Note: There may be security issues, please note
        if (window.location.pathname !== loginPath && !redirect) {
          await clearAccessToken();
          navigate(loginPath,);
        }
    };
    
    const { styles } = useStyles();
    
    const onMenuClick = useCallback((event: MenuInfo) => {
            const { key } = event;
            if(key === 'logout'){
              loginOut();
              return ;
            }
        },
        [],
    );
  
  
    const loading = (
      <span className={styles.action}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
    
    if (!currentUser || !currentUser.name) {
      return loading;
    }
    
    const menuItems = [
        ...(menu
            ? [
                {
                    key: 'center',
                    icon: <UserOutlined />,
                    label: '个人中心',
                },
                {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: '个人设置',
                },
                {
                    type: 'divider' as const,
                },
            ]
            : []),
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
        },
    ];

    return (
        <HeaderDropdown
            menu={{
                selectedKeys: [],
                onClick: onMenuClick,
                items: menuItems,
            }}
        >
            {children}
        </HeaderDropdown>
    );
};