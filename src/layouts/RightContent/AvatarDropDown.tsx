import { FC } from 'react';
import {Avatar, Button, Dropdown, MenuProps, Spin} from 'antd';
import useAuthUserStore from '@/stores/user';
import {LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';


export type GlobalHeaderRightProps = {
    menu?: boolean;
};


const AvatarDropDown:FC<GlobalHeaderRightProps> = ({menu}   ) =>{
    const { t } = useTranslation();
    const currentUser = useAuthUserStore(state => state.currentUser);

    const menuItems: MenuProps['items'] = [
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: t('global.layout.header.settings'),
            onClick: async ()=>{
                console.log("setting");
            }
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('global.layout.header.logout'),
            onClick: async ()=>{
                logout().then(() => {
                    window.location.href = LOGIN_PATH;
                })
            }
        },
    ];

    const loading = (
        <span>
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

    return (
        <Dropdown
            menu={{
                items: menuItems
            }}
        >
            <Button size={"large"} type={'text'}  >
                <div>{currentUser.name}</div>
                <Avatar src={currentUser.avatarUrl} alt="avatar" size={32}  />
            </Button>
        </Dropdown>
    )
}

export default AvatarDropDown;