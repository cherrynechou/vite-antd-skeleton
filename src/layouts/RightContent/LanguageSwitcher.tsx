import {Button, ButtonProps, Dropdown} from "antd";
import {TranslationOutlined} from "@ant-design/icons";
import {FC} from "react";
import {useLanguage} from "@/hooks/useLanguage";

const LanguageSwitcher:FC<ButtonProps> = (props) => {

    const { getLanguageMenuItems, language } = useLanguage();

    return (
        <Dropdown
            menu={{
                items: getLanguageMenuItems(),
                selectedKeys:[ language ]
            }}
        >
            <Button icon={<TranslationOutlined />} {...props} />
        </Dropdown>
    )
};

export default LanguageSwitcher;