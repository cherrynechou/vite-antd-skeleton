import { FC } from 'react';
import {Avatar, Dropdown, MenuProps, Space, Spin} from 'antd';
import useAuthUserStore from '@/stores/user';
import {LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';


export type GlobalHeaderRightProps = {
    menu?: boolean;
};


const AvatarDropDown:FC = () =>{
    const { t } = useTranslation();
    const currentUser = useAuthUserStore(state => state.currentUser);
    const onMenuClick:MenuProps['onClick']=(event)=>{
        const { key } = event;

        console.log(key);

    }

    const menuItems: MenuProps['items'] = [
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: t('global.layout.header.settings'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('global.layout.header.logout'),
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
                onClick: onMenuClick,
                items: menuItems,
            }}
        >
            <div className="flex">
                <Avatar src={currentUser.avatarUrl} alt="avatar"/>
                <span style={{color: 'black', fontSize: '14px'}}>
                    {currentUser.name}
                </span>
            </div>
        </Dropdown>
    )
}

export default AvatarDropDown;