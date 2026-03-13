import {FC, useState} from "react";
import { Col, Row } from "antd";

import {DictTable,DictDataTable} from './components';


const Dict:FC = () =>{
    const [currentDictId,setCurrentDictId] = useState<number | undefined>(0);

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
                    <DictTable
                        setDictId={(value)=>{
                            let last  = value.pop();
                            if(last){
                                setCurrentDictId(last);
                            }
                        }}
                    />
                </Col>
                <Col
                    span={14}
                    className={'h-full'}
                >
                    <DictDataTable
                        currentDictId={currentDictId}
                    />
                </Col>
            </Row>
        </>
    )
}

export default Dict;