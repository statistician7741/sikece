import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

export default class LihatTabel_Tabel extends React.Component {
    state = {
        kabData: [{
            _id: '7401',
            name: 'Buton',
            ket: 'Kabupaten pertama di Buton, didirikan tahun 1980'
        }, {
            _id: '7414',
            name: 'Buton Tengah',
            ket: '-'
        }, {
            _id: '7415',
            name: 'Buton Selatan',
            ket: 'Kabupaten pertama di Buton, didirikan tahun 1980. Kabupaten ini baru dimekarkan.'
        },]
    }
    render() {
        const { xs, md } = this.props
        const { onClickTambah } = this.props
        const { kabData } = this.state

        const kabColumns = [{
            title: 'Kode',
            dataIndex: '_id',
            key: '_id',
            width: 30,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Kabupaten',
            dataIndex: 'name',
            width: 150,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            }
        }, {
            title: 'Keterangan',
            dataIndex: 'ket',
            width: 300
        }, {
            title: 'pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 140,
            render: (text, record) => <span>
                <a>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Kabupaten ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Kabupaten</strong></Col>
                        </Row>
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
                            columns={kabColumns}
                            dataSource={kabData}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}