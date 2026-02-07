import { FC, Fragment, useState, ForwardRefExoticComponent, useEffect } from 'react';
import { App, Button, Input, Modal, Space,Radio, Tabs } from 'antd';
import type { RadioChangeEvent } from 'antd'
import {useTranslation} from "react-i18next";
import Icon, { AppstoreOutlined } from '@ant-design/icons'
import * as AntdIcons from '@ant-design/icons';
import { iconData } from './iconData'


const IconSelector: FC = (props: any)=>{
  const { t } = useTranslation();
  const [ currentIcon, setCurrentIcon ] = useState<string>('');
  const [viewData, setViewData] = useState<any[]>([])
  const [ isModalOpen, setIsModalOpen ] = useState<any>(false);

  const { message } = App.useApp();

  useEffect(()=>{
    const iconViewData: any[] = [];
    iconData.forEach(item => {
      const childrenData = item.icons;
      const locale = `component.selectIcon.${item.key}`;
      iconViewData.push({
        key: item.key,
        label: t(locale),
        children: (
          <Radio.Group>
            {
              childrenData.map((item: string,index: number) => {
                return (
                  <Radio.Button key={index} value={item} onChange={onChange}>
                    <Icon component={(AntdIcons as any)[item]} style={{fontSize: '16px'}}/>
                  </Radio.Button>
                )
              })
            }
          </Radio.Group>
        )
      })
    });

    setViewData(iconViewData)
  },[]);

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setCurrentIcon(value);
  };

  const handleOk = () =>{
    if(currentIcon === ''){
      const defaultIconErrorMessage = t('message.icon.empty.failure');
      message.error(defaultIconErrorMessage)
    }

    props.onChange(currentIcon);
    setIsModalOpen(false);
  }

  const onCancel = () =>{
    setCurrentIcon('');
    setIsModalOpen(false);
  }


  return (
    <Fragment>
      <Input
        style={{ width:200 }}
        placeholder={ props.placeholder }
        value={ props.value }
        prefix={ props.value && <Icon component={(AntdIcons as any)[props.value]} /> }
      />
      <Button
        type="primary"
        onClick={()=>{setIsModalOpen(!isModalOpen)}}
        style={{ borderRadius: 0 }}
      >
        <Space>
          <Icon component={ AppstoreOutlined  as ForwardRefExoticComponent<any>} />
        </Space>
      </Button>

      <Modal
        destroyOnHidden
        title={
          t('component.selectIcon.title')
        }
        open={isModalOpen}
        onCancel={() => onCancel()}
        onOk={handleOk}//提交图标关键字
        width={'60vw'}
      >
        <Tabs items={viewData}/>
      </Modal>

    </Fragment>
  )
}

export default IconSelector;