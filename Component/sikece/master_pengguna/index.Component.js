import dynamic from 'next/dynamic';
import { PageHeader, Table, Row, Col, Divider, Popconfirm, Menu, Dropdown } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

export default class IndexMasterPengguna extends React.Component {
    state = {
        activePage: 'list',
        activeEditingtitle: undefined,
        users: [{
            _id: 1,
            name: 'Admin 1',
            jenis_pengguna: 'Admin',
            ket: 'Bisa mengakses semua fitur SIKECE',
        }, {
            _id: 2,
            name: 'Kepala BPS Kab',
            jenis_pengguna: 'Kepala BPS Kabupaten Kota',
            ket: 'Bisa mengakses fitur Monitoring dan Buku Panduan',
        }, {
            _id: 2,
            name: 'Kasi IPDS',
            jenis_pengguna: 'Supervisor',
            ket: 'Bisa mengakses fitur Monitoring, Master tabel, Entri Data, dan Buku Panduan',
        }, {
            _id: 3,
            name: 'Nurul Husna Khairunnisa S.Tr.Stat',
            jenis_pengguna: 'Editor',
            ket: 'Bisa mengakses fitur Master Tabel, Entri Data, dan Buku Panduan',
        }, {
            _id: 4,
            name: ' Reka Sri Wigati S.Tr.Stat.',
            jenis_pengguna: 'Editor',
            ket: 'Bisa mengakses fitur Master Tabel, Entri Data, dan Buku Panduan',
        }, {
            _id: 5,
            name: 'Sudarwo',
            jenis_pengguna: 'Operator Entri',
            ket: 'Bisa mengakses fitur Entri data dan Buku Panduan',
        }, {
            _id: 6,
            name: 'Yerni',
            jenis_pengguna: 'Admin',
            ket: 'Bisa mengakses fitur Entri data dan Buku Panduan',
        }, {
            _id: 7,
            name: 'Puskesmas Lasalimu Selatan',
            jenis_pengguna: 'Eksternal',
            ket: 'Bisa mengakses fitur persetujuan Data',
        }, {
            _id: 8,
            name: 'Kecamatan Pasar Wajo',
            jenis_pengguna: 'Eksternal',
            ket: 'Bisa mengakses fitur persetujuan Data',
        },]
    }

    render() {
        const { users } = this.state
        const userColumns = [{
            title: 'Nama',
            dataIndex: 'name',
            key: '_id',
            width: 200,
        }, {
            title: 'Jenis Pengguna',
            dataIndex: 'jenis_pengguna',
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
                <Popconfirm title={`Hapus Pengguna ini?`}>
                    <a>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <PageHeader
                className="site-page-header"
                title="Master Pengguna"
            >
                <Row>
                    <Col xs={24} md={16}>
                        <Dropdown.Button
                            type="primary" overlay={
                                <Menu>
                                    <Menu.Item key="1">Multi Penambahan</Menu.Item>
                                </Menu>
                            }
                        >
                            <PlusOutlined /> Tambah
                            </Dropdown.Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={16}>
                        <Table
                            size="small"
                            scroll={{ x: 800 }}
                            columns={userColumns}
                            dataSource={users}
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </PageHeader>
        )
    }
}