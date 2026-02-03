import { FC } from "react"
import { Button, Dropdown, type ButtonProps } from "antd"
import { TranslationOutlined } from "@ant-design/icons"
import { useLanguage } from '@/hooks/useLanguage'

/**
 * 切换语言
 * @constructor
 */
const LanguageSwitcher: FC = () => {
    const { getLanguageMenuItems, language } = useLanguage();
    return (
        <Dropdown
            menu={{
                items: getLanguageMenuItems(),
                selectedKeys:[ language ]
            }}
        >
            <Button icon={<TranslationOutlined />} size={"large"} type={'text'} />
        </Dropdown>
    )
};

export default LanguageSwitcher;