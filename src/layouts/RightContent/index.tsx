import { FC } from 'react';
import AvatarDropDown from './AvatarDropDown.tsx';
import SelectLang from './SelectLang';
import {Space} from "antd";

const RightContent: FC = () =>{
    return (
        <Space>
            <SelectLang />
            <AvatarDropDown />
        </Space>
    )
}

export default RightContent;