import { Row, Col, Select, Typography, Cascader } from 'antd';
const { Option } = Select;
const { Text } = Typography;

export default class BasicForm_Tabel extends React.Component {
    render() {
        const { kecData, bab } = this.props
        const { loadDataKec } = this.props
        return (
            <Row gutter={[0, 8]}>
                <Col xs={24} md={5}>
                    <Select defaultValue="2019">
                        <Option value="2019">2019</Option>
                        <Option value="2018">2018</Option>
                        <Option value="2017">2017</Option>
                    </Select>
                    <div><Text type="secondary">Tahun Data</Text></div>
                </Col>
                <Col xs={24} md={11}>
                    <Cascader
                        defaultValue={['buton', 'kec1']}
                        options={kecData}
                        loadData={loadDataKec}
                        changeOnSelect
                        placeholder="Pilih kec"
                        allowClear={false}
                        style={{ width: '90%' }}
                    />
                    <div><Text type="secondary">Kecamatan</Text></div>
                </Col>
                {bab ? <Col xs={24} md={8}>
                    <Select defaultValue="Semua" style={{ width: '100%' }}>
                        <Option value="Semua">Semua</Option>
                        <Option value="I">Geografi</Option>
                        <Option value="II">Pemerintahan</Option>
                        <Option value="III">Pertanian dan Pertambangan</Option>
                    </Select>
                    <div><Text type="secondary">Bab</Text></div>
                </Col> : null}
            </Row>
        )
    }
}