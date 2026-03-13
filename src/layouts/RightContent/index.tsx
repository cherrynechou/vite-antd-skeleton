import { FC } from 'react'
import AvatarDropDown from './AvatarDropDown'
import LanguageSwitcher from './LanguageSwitcher'
import FullScreenSwitcher from './FullScreenSwitcher';
import { Space } from 'antd'

const RightContent: FC = () =>{
    return (
        <Space align="center" >
            <FullScreenSwitcher />
            <LanguageSwitcher/>
            <AvatarDropDown />
        </Space>
    )
}

export default RightContent;