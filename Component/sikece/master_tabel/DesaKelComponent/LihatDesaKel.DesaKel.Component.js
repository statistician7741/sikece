import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select, Typography } from 'antd';
const { Option } = Select;
const { Text } = Typography;
import { PlusOutlined } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'

export default class LihatTabel_Tabel extends React.Component {
    state = {
        
    }
    render() {
        const { xs, md, kabData, desaKelData, kecData } = this.props
        const { onClickTambah } = this.props

        const kabColumns = [{
            title: 'Kode',
            dataIndex: '_id',
            key: '_id',
            width: 90,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Desa/Kel',
            dataIndex: 'name',
            width: 150,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            }
        }, {
            title: 'Klasifikasi',
            dataIndex: 'klasifikasi',
            width: 150,
            sorter: (a, b) => {
                return a.klasifikasi.localeCompare(b.klasifikasi)
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
                <Popconfirm title={`Hapus Desa/Kelurahan ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Desa/Kelurahan</strong></Col>
                        </Row>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kabData[0]._id} style={{ width: 200 }}>
                                {kabData.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                                <Option value="all_kab" key="all_kab">[----] Semua</Option>
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kecamatan' isWajib={false} left>
                            <Select defaultValue={kecData[0]._id} style={{ width: 200 }}>
                                {kecData.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                                <Option value="all_kec" key="all_kec">[----] Semua</Option>
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
                            dataSource={desaKelData}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}