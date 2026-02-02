import { FC } from 'react';
import React from 'react';
import * as AntdIcons from '@ant-design/icons';

const allIcons: any = AntdIcons;

//https://github.com/mkgrow/szdt-admin-components
interface iconProps {
    /**
     * @description 图标样式
     * */
    className?: React.CSSProperties;

    /**
     * @description IconFont中上传的图标名称
     * */
    name?: string;

    /**
     * @description 图标样式
     * */
    style?: object;

    /**
     * @description 图标大小
     * */
    size?: string;

    /**
     * @description 点击回调
     * */
    onClick?: () => void;
}

const IconFont: FC<iconProps> = (props: any) => {

    return (
        React.createElement(allIcons[props.name] , {style: props.style})
    );
}

export default IconFont;