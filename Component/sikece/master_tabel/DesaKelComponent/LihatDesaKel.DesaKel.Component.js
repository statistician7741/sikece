import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select } from 'antd';
const { Option } = Select;
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'
import { deleteDeskelbyId, getKec, getKab, getDeskel } from "../../../../redux/actions/master.action"

export default class LihatDeskel_Deskel extends React.Component {
    componentDidMount() {
        if (this.props.socket) {
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_deskel.length && this.props.dispatch(getDeskel(this.props.socket))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getKab(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getDeskel(this.props.socket))
        }
        if (this.props.kab !== prevProps.kab) {
            this.props.onChangeDropdown({ kec: 'all_kec' })
        }
    }
    render() {
        const { all_kab, all_kec, all_deskel, kab, kec } = this.props
        const { onClickTambah, onClickEdit, onChangeDropdown } = this.props

        const deskelColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t, r, i) => (i + 1)
        }, {
            title: 'Kode',
            dataIndex: 'kode',
            key: '_id',
            width: 90,
            showSorterTooltip: false,
            sorter: (a, b) => a.kode - b.kode
        }, {
            title: 'Desa/Kel',
            dataIndex: 'name',
            width: 150,
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            }
        }, {
            title: 'Klasifikasi',
            dataIndex: 'klasifikasi',
            width: 150,
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.klasifikasi.localeCompare(b.klasifikasi)
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
                <a onClick={() => onClickEdit(`Edit ${record.klasifikasi} ${record.name}`, record)}><EditTwoTone /></a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus ${record.klasifikasi} ini?`} onConfirm={() => this.props.dispatch(deleteDeskelbyId(this.props.socket, record._id, this.props))}>
                    <DeleteTwoTone twoToneColor="#eb2f96" />
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={24}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kab} value={kab} style={{ minWidth: 200 }} onChange={kab => onChangeDropdown({ kab })}>
                                <Option value="all_kab" key="all_kab">[----] Semua</Option>
                                {all_kab.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kecamatan' isWajib={false} left>
                            <Select defaultValue={kec} value={kec} style={{ minWidth: 200 }} onChange={kec => onChangeDropdown({ kec })}>
                                <Option value="all_kec" key="all_kec">[----.---] Semua</Option>
                                {all_kec.filter(kec => kab === 'all_kab' || kab === kec.kab).map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
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
                            columns={deskelColumns}
                            dataSource={all_deskel.filter(
                                deskel => (kab === 'all_kab' && kec === 'all_kec' || (kec === 'all_kec' && kab === deskel.kab) || (kec !== 'all_kec' && kec === deskel.kec))
                            )}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}