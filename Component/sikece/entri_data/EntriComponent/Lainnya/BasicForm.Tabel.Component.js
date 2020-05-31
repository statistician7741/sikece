import { Row, Col, Select, Typography, Cascader } from 'antd';
const { Option } = Select;
const { Text } = Typography;

export default class BasicForm_Tabel extends React.Component {
    render() {
        const { kecData, withAllBab } = this.props
        const { loadDataKec, defaultValue } = this.props
        return (
            <Row gutter={[0, 8]}>
                <Col xs={24} md={5}>
                    <Select defaultValue="2020">
                        <Option value="2019">2019</Option>
                        <Option value="2018">2018</Option>
                        <Option value="2017">2017</Option>
                    </Select>
                    <div><Text type="secondary">Tahun Buku</Text></div>
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
                <Col xs={24} md={8}>
                    <Select defaultValue={defaultValue} style={{ width: '100%' }}>
                        {withAllBab ? <Option value="Semua">Semua</Option> : null}
                        <Option value="I">1. Geografi</Option>
                        <Option value="II">2. Pemerintahan</Option>
                        <Option value="III">3. Pertanian dan Pertambangan</Option>
                    </Select>
                    <div><Text type="secondary">Bab</Text></div>
                </Col>
            </Row>
        )
    }
}