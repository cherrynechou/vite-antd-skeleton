import React from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import * as allIcons from '@ant-design/icons';

// FIX从接口获取菜单时icon为string类型
const fixMenuItemIcon = (menus: MenuDataItem[], iconType = 'Outlined'): MenuDataItem[] => {
    menus.forEach((item: MenuDataItem) => {
        const { icon, children } = item;
        if (typeof icon === 'string' && icon) {
            const fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType;
            item.icon = React.createElement((allIcons as any)[fixIconName] || (allIcons as any)[icon]);
            if (!item.redirect) {
                delete item.redirect;
            }
            if (!item.component) {
                delete item.component;
            }
            if (item.id) {
                delete item.id;
            }
            if (item.pid >= 0) {
                delete item.pid;
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        children && children.length > 0 ? (item.children = fixMenuItemIcon(children)) : null;
    });
    return menus;
};

export default fixMenuItemIcon;
