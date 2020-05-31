import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select, Typography, Input } from 'antd';
const { Option } = Select;
const { Text } = Typography;
import { PlusOutlined } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'

export default class LihatBab_Bab extends React.Component {
    state = {

    }
    render() {
        const { xs, md, kabData, babData, kecData } = this.props
        const { onClickTambah } = this.props

        const kabColumns = [{
            title: 'Tahun Buku',
            dataIndex: 'tahun_buku',
            key: '_id',
            width: 90,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Nomor',
            dataIndex: '_id',
            key: '_id',
            width: 90,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Bab',
            dataIndex: 'name',
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
                <Popconfirm title={`Hapus Bab ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Bab</strong></Col>
                        </Row>
                        <InputForm xs={19} name='Tahun Buku' isWajib={false} left>
                            <Input
                                placeholder="Tahun buku"
                                style={{ width: "35%" }}
                            />
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
                            dataSource={babData}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}