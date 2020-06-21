import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { deleteSatuanbyId, getSatuan } from "../../../../redux/actions/master.action"

export default class LihatSatuan_Satuan extends React.Component {
    componentDidMount() {
        if (this.props.socket && !this.props.all_satuan.length) {
            this.props.dispatch(getSatuan(this.props.socket))
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getSatuan(this.props.socket))
        }
    }
    render() {
        const { all_satuan } = this.props
        const { onClickTambah, onClickEdit } = this.props

        const satuanColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t,r,i)=>(i+1)
        }, {
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
                <a onClick={() => onClickEdit(`Edit Satuan ${record.name}`, record)}>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Satuan ini?`} onConfirm={() => this.props.dispatch(deleteSatuanbyId(this.props.socket, record._id))}>
                    <a>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={24}>
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
                            size="small"
                            columns={satuanColumns}
                            dataSource={all_satuan}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}