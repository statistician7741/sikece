import { Row, Col } from "antd";

export default ({ xs, name, children, isWajib }) => {
    return <Row style={{ marginBottom: 10 }}>
        <Col xs={5}>
            <span style={{ color: 'red' }}>{isWajib ? '*' : null}</span> {name}
        </Col>
        <Col xs={xs}>
            {children}
        </Col>
    </Row>
}