import { FC } from 'react';
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@/stores';

const Collapse : FC = ()=>{
    const collapsed = useGlobalStore(state => state.collapsed);
    const setCollapsed = useGlobalStore(state => state.setCollapsed);

    return (
        <div className="flex items-center relative">
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
        </div>
    )
}

export default Collapse;