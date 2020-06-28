import { Row, Col, Typography } from "antd";
import { Fragment } from "react";
const { Title, Paragraph } = Typography

export default ({ menuName, closing }) => <Fragment>
    <Row>
        <Col sx={24}>
            <Title level={4}>Menu {menuName}</Title>
        </Col>
    </Row>
    <Row>
        <Col sx={24}>
            <Paragraph>
                Menu {menuName} adalah menu yang digunakan untuk menampilkan semua tabel beserta statusnya.
                Menu ini berisi semua tabel KCDA yang ditampilkan menurut Kabupaten, Kecamatan, dan Bab. {closing}
    </Paragraph>
        </Col>
    </Row>
</Fragment>