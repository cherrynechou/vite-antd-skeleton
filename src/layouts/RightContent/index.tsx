import { FC } from 'react'
import AvatarDropDown from './AvatarDropDown'
import LanguageSwitcher from './LanguageSwitcher'
import { Space } from 'antd'

const RightContent: FC = () =>{
    return (
        <Space align="center" >
            <LanguageSwitcher size={"large"} type={'text'}/>
            <AvatarDropDown />
        </Space>
    )
}

export default RightContent;