import React from 'react';
import { Card, Row, Col, Button } from 'antd';

const BaseDetail = ({ type, title, children, closeHandler }) => {
    return (
        <Card bodyStyle={{ padding: 10 }}>
            <Row>
                <Col span={16}>
                    <span
                        style={{
                            fontWeight: 100,
                            fontStyle: 'italic',
                            fontSize: '10px',
                        }}
                    >
                        {type}{' '}
                    </span>
                    <br />
                    <span>{title}</span>
                </Col>
                {closeHandler ? (
                    <Col span={8}>
                        <Button
                            style={{ float: 'right' }}
                            icon="close"
                            type="primary"
                            shape="circle"
                            size="small"
                            ghost
                            onClick={closeHandler}
                        />
                    </Col>
                ) : null}
            </Row>
            <hr />
            {children}
        </Card>
    );
};

export default BaseDetail;
