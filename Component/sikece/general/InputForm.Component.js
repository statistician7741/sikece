import { Row, Col } from "antd";

export default ({ xs, name, children, isWajib, left }) => {
    return <Row style={{ marginBottom: 10 }} gutter={[16,0]}>
        <Col xs={5} style={{textAlign: left?"left":"right"}}>
            {name} <span style={{ color: 'red' }}>{isWajib ? '*' : null}</span>
        </Col>
        <Col xs={xs}>
            {children}
        </Col>
    </Row>
}