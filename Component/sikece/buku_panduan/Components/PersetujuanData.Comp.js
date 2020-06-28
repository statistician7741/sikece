import { Row, Col, Typography } from "antd";
import { Fragment } from "react";
const { Title, Paragraph } = Typography

export default ({menuName, closing}) => <Fragment>
    <Row>
        <Col sx={24}>
            <Title level={4}>Menu {menuName}</Title>
        </Col>
    </Row>
    <Row>
        <Col sx={24}>
            <Paragraph>
                Menu {menuName} adalah menu yang digunakan untuk menilai tabel yang telah berisi data hasil pengumpulan data. Menu ini dapat diakses oleh
                pihak eksternal atau penyedia data. {closing}
    </Paragraph>
        </Col>
    </Row>
</Fragment>