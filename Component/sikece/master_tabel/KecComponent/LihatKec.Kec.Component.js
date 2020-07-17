import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select } from 'antd';
const { Option } = Select;
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'
import { deleteKecbyId, getKec, getKab } from "../../../../redux/actions/master.action"

export default class LihatTabel_Tabel extends React.Component {
    componentDidMount() {
        if (this.props.socket) {
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket, this.props.kab))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getKab(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
        }
    }
    render() {
        const { all_kab, all_kec, kab } = this.props
        const { onClickTambah, onClickEdit, onChangeKabDropdown } = this.props

        const kecColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t, r, i) => (i + 1)
        }, {
            title: 'Kode',
            dataIndex: '_id',
            key: '_id',
            width: 90,
            showSorterTooltip: false,
            sorter: (a, b) => a._id - b._id
        }, {
            title: 'Kecamatan',
            dataIndex: 'name',
            width: 150,
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            }
        }, {
            title: 'Keterangan',
            dataIndex: 'ket',
        }, {
            title: 'Pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            align: 'center',
            width: 90,
            render: (text, record) => <span>
                <a onClick={() => onClickEdit(`Edit Kecamatan ${record.name}`, record)}><EditTwoTone /></a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Kecamatan ini?`} onConfirm={() => this.props.dispatch(deleteKecbyId(this.props.socket, record._id, this.props))}>
                    <DeleteTwoTone twoToneColor="#eb2f96" />
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={24}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kab} style={{ minWidth: 200 }} onChange={kab => onChangeKabDropdown(kab)}>
                                <Option value="all_kab" key="all_kab">[----] Semua</Option>
                                {all_kab.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
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
                            size="small"
                            columns={kecColumns}
                            dataSource={all_kec.filter(kec => (kab === 'all_kab' || kec.kab === kab))}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}