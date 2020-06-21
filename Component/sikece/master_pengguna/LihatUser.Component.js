import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { deleteUserbyId, getUser } from "../../../redux/actions/user.action"

export default class LihatTabel_Tabel extends React.Component {
    componentDidMount() {
      if (this.props.socket && !this.props.all_user.length) {
        this.props.dispatch(getUser(this.props.socket))
      }
    }
    componentDidUpdate(prevProps) {
      if (this.props.socket !== prevProps.socket) {
        this.props.dispatch(getUser(this.props.socket))
      }
    }
    render() {
        const { all_user } = this.props
        const { onClickTambah, onClickEdit } = this.props

        const userColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t,r,i)=>(i+1)
        }, {
            title: 'Nama',
            dataIndex: 'name',
            showSorterTooltip: false,
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
                <a onClick={() => onClickEdit(`Edit Pengguna ${record.name}`, record)}>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Pengguna ini?`} onConfirm={()=>this.props.dispatch(deleteUserbyId(this.props.socket, record._id, this.props))}>
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
                            columns={userColumns}
                            dataSource={all_user}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}