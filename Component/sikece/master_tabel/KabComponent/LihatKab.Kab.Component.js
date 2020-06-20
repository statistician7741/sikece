import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { deleteKabbyId, getKab } from "../../../../redux/actions/master.action"

export default class LihatTabel_Tabel extends React.Component {
    componentDidMount() {
      if (this.props.socket && !this.props.all_kab.length) {
        this.props.dispatch(getKab(this.props.socket))
      }
    }
    componentDidUpdate(prevProps) {
      if (this.props.socket !== prevProps.socket) {
        this.props.dispatch(getKab(this.props.socket))
      }
    }
    render() {
        const { all_kab } = this.props
        const { onClickTambah, onClickEdit } = this.props

        const kabColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t,r,i)=>(i+1)
        }, {
            title: 'Kode',
            dataIndex: '_id',
            key: '_id',
            width: 90,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Kabupaten',
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
                <a onClick={() => onClickEdit(`Edit Kabupaten ${record.name}`, record)}>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Kabupaten ini?`} onConfirm={()=>this.props.dispatch(deleteKabbyId(this.props.socket, record._id, this.props))}>
                    <a>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col>
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
                            columns={kabColumns}
                            dataSource={all_kab}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}