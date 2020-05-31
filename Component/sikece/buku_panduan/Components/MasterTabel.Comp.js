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
                Menu {menuName} adalah menu yang digunakan untuk membuat/merancang tabel KCDA. Menu ini berisi beberapa tab/kelompok fitur yang masing-masing merupakan komponen penyusun
                tabel.
    </Paragraph>
        </Col>
    </Row>
</Fragment>