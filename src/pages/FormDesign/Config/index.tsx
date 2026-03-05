import {FC, useState} from "react";
import { Col, Row } from "antd";

import {ConfigTable,ConfigFormTable} from './components';

const Config:FC = () =>{
    const [currentGroupId,setCurrentGroupId] = useState<number | undefined>(0);
    return (
        <>
            <Row
                gutter={24}
                className={'h-full'}
            >
                <Col
                    span={10}
                    className={'h-full'}
                >
                    <ConfigTable
                        setConfigGroupId={(value)=>{
                            let last  = value.pop();
                            if(last){
                                setCurrentGroupId(last);
                            }
                        }}
                    />
                </Col>
                <Col
                    span={14}
                    className={'h-full'}
                >
                    <ConfigFormTable
                        currentGroupId={currentGroupId}
                    />
                </Col>
            </Row>
        </>
    )
}

export default Config;
