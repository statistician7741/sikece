import { Row, Col, Typography } from "antd";
import { Fragment } from "react";
const { Title, Paragraph } = Typography

export default ({menuName,closing}) => <Fragment>
    <Row>
        <Col sx={24}>
            <Title level={4}>Menu {menuName}</Title>
        </Col>
    </Row>
    <Row>
        <Col sx={24}>
            <Paragraph>
                Menu {menuName} adalah menu yang berisi informasi capaian (progress) persetujuan data. Selain itu, terdapat pula informasi terkini
                mengenai interaksi pihak yang telah melakukan penilaian terhadap tabel yang telah diperiksa. {closing}
    </Paragraph>
        </Col>
    </Row>
</Fragment>