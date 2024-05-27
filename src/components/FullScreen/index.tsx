import { FC, useState  } from 'react';
import { Tooltip } from 'antd';
import screenfull from 'screenfull';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

const FullScreen: FC = () =>{
  const [isFullScreen, setIsFullScreen] = useState(true);
  
  const toggleFullScreen = () =>{
    if (screenfull.isEnabled) {
      screenfull.toggle();
      setIsFullScreen(!isFullScreen)
    }
  }
  
  return (
    <Tooltip placement="bottom" title={<span>{isFullScreen ? '全屏' : '退出全屏'}</span>}>
      {isFullScreen ? (
        <FullscreenOutlined
          style={{
            fontSize: '24px',
          }}
          onClick={toggleFullScreen}
        />
      ) : (
        <FullscreenExitOutlined
          style={{
            fontSize: '24px',
          }}
          onClick={toggleFullScreen}
        />
      )}
    </Tooltip>
  )
}

export default FullScreen;