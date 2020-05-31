import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select, Typography } from 'antd';
const { Option } = Select;
const { Text } = Typography;
import { PlusOutlined } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'

export default class LihatTabel_Tabel extends React.Component {
    state = {
        kecData: [{
            _id: '060',
            name: 'Pasar Wajo',
            ket: 'Kecamatan pertama di Buton, didirikan tahun 1980'
        }, {
            _id: '050',
            name: 'Lasalimu',
            ket: '-'
        }, {
            _id: '051',
            name: 'Lasalimu Selatan',
            ket: 'Termasuk Kecamatan di Buton, didirikan tahun 2017. Kecamatan ini baru dimekarkan.'
        },]
    }
    render() {
        const { xs, md, kabData } = this.props
        const { onClickTambah } = this.props
        const { kecData } = this.state

        const kabColumns = [{
            title: 'Kode',
            dataIndex: '_id',
            key: '_id',
            width: 90,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Kecamatan',
            dataIndex: 'name',
            width: 150,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            }
        }, {
            title: 'Keterangan',
            dataIndex: 'ket',
        }, {
            title: 'pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 140,
            render: (text, record) => <span>
                <a>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Kecamatan ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Kecamatan</strong></Col>
                        </Row>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kabData[0]._id} style={{ width: 200 }}>
                                {kabData.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                                <Option value="all_kab" key="all_kab">[----] Semua</Option>
                            </Select>
                        </InputForm>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row><Col>
                            <Dropdown.Button
                                onClick={() => onClickTambah(false)}
                                type="primary" overlay={
                                    <Menu>
                                        <Menu.Item key="1" onClick={() => onClickTambah(true)}>Multi Penambahan</Menu.Item>
                                    </Menu>
                                }
                            >
                                <PlusOutlined /> Tambah
                            </Dropdown.Button>
                        </Col></Row>
                    </Col>
                </Row>
                <Row gutter={[64, 0]}>
                    <Col xs={24}>
                        <Table
                            scroll={{ x: 1000 }}
                            columns={kabColumns}
                            dataSource={kecData}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}