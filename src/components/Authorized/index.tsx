import {FC} from "react";
import {Access, useAccess} from "@/context";
import {Button, Result} from "antd";
import {useTranslation} from "react-i18next";

export type AuthorizedProps =  {
    children: any,
    perms: string
}

const NoAuthorized: FC = () => {
    const { t } = useTranslation();
    return (
        <Result
            status="403"
            title="403"
            subTitle={t('pages.403.subTitle')}
            extra={
                <Button type="primary">
                    {t('pages.403.buttonText')}
                </Button>
            }
        />
    )
};


const Authorized:FC<AuthorizedProps> = (props: any) =>{
    const access = useAccess();
    const { children,perms } = props;
    return (
        <Access accessible={access.hasPermissions(perms)} fallback={ <NoAuthorized/> }>
            {children}
        </Access>
    )
}

export default Authorized;