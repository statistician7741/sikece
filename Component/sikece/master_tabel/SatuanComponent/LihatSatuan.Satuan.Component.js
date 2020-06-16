import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select, Typography } from 'antd';
const { Option } = Select;
const { Text } = Typography;
import { PlusOutlined } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'

export default class LihatSatuan_Satuan extends React.Component {
    state = {
        
    }
    render() {
        const { xs, md, kabData, satuanData, kecData } = this.props
        const { onClickTambah } = this.props

        const kabColumns = [{
            title: 'Satuan',
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
                <Popconfirm title={`Hapus Satuan ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
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
                            dataSource={satuanData}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}