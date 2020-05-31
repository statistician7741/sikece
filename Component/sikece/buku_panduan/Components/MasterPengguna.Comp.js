import { Row, Col, Typography } from "antd";
import { Fragment } from "react";
const { Title, Paragraph } = Typography

export default ({menuName}) => <Fragment>
    <Row>
        <Col sx={24}>
            <Title level={4}>Menu {menuName}</Title>
        </Col>
    </Row>
    <Row>
        <Col sx={24}>
            <Paragraph>
                Menu {menuName} adalah menu yang digunakan untuk membuat atau mengatur akun pengguna yang akan mengakses SIKECE.
    </Paragraph>
        </Col>
    </Row>
</Fragment>