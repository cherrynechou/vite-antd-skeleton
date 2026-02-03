import { FC } from 'react';
import { Tooltip, Button } from 'antd'
import { useFullScreen } from "@/hooks/useFullScreen";
import { useTranslation } from 'react-i18next';
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

interface Props {
    element?: Element | string;
}

const FullScreenSwitcher: FC<Props> = () => {
    const { isFullScreen,enterFullScreen,exitFullScreen } = useFullScreen();
    const { t } = useTranslation();

    if(isFullScreen){
        return (
            <Tooltip placement="bottom" title={t('global.layout.header.fullscreen.exit')}>
                <Button
                    icon={<FullscreenExitOutlined />}
                    size={"large"}
                    type={'text'}
                    onClick={()=>exitFullScreen()}
                />
            </Tooltip>
        )
    }else{
        return (
            <Tooltip placement="bottom" title={t('global.layout.header.fullscreen')}>
                <Button
                    icon={<FullscreenOutlined />}
                    size={"large"}
                    type={'text'}
                    onClick={()=>enterFullScreen()}
                />
            </Tooltip>
        )
    }

}

export default FullScreenSwitcher