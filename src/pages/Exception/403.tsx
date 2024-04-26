import {
    Button,
    Result
} from 'antd';
import {
    useNavigate
} from 'react-router-dom';

export default () => {

    const navigate = useNavigate();
    const goHome = () => {
        navigate('/home');
    };
    return (
        <Result
            status="403"
            title="403"
            subTitle="无权限"
            extra={
                <Button type="primary" onClick={goHome} >
                    返回首页
                </Button>
            }
        />
    )
}

