import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter} from "@ant-design/pro-components";

const FooterRender: FC = ()=> {
  
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  
  const defaultMessage = t('system.copyright')
  
  return (
    <DefaultFooter
      copyright={ `${currentYear} ${defaultMessage}`  }
      links={[
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  )
  
}


export default FooterRender;