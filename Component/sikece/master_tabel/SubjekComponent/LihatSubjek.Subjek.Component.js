import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { deleteSubjectbyId, getSubject } from "../../../../redux/actions/master.action"

export default class LihatSubjek_Subjek extends React.Component {
    componentDidMount() {
        if (this.props.socket && !this.props.all_kab.length) {
            this.props.dispatch(getSubject(this.props.socket))
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getSubject(this.props.socket))
        }
    }
    render() {
        const { all_subject } = this.props
        const { onClickTambah, onClickEdit } = this.props

        const subjectColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t,r,i)=>(i+1)
        }, {
            title: 'Subjek',
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
                <a onClick={() => onClickEdit(`Edit Subjek ${record.name}`, record)}>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Subjek ini?`} onConfirm={() => this.props.dispatch(deleteSubjectbyId(this.props.socket, record._id))}>
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
                            columns={subjectColumns}
                            dataSource={all_subject}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}