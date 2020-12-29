import { Row, Col, Dropdown, Menu, Table, Divider, Popconfirm, Select, Typography, Input } from 'antd';
const { Option } = Select;
const { Text } = Typography;
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'
import { deleteBabbyId, getBab } from "../../../../redux/actions/master.action"

export default class LihatBab_Bab extends React.Component {
    state = {
        years: [],
        selectedYear: new Date().getFullYear()
    }
    getAllYearsBab = (props) => {
        props.socket.emit('api.master_tabel.bab/getAllYearsBab', (response) => {
            if (response.type === 'ok') {
                this.setState({ years: response.data, selectedYear: this.props.tahun_buku_monitoring })
            } else {
                props.showErrorMessage(response.additionalMsg)
            }
        })
    }
    componentDidMount() {
        if (this.props.socket) {
            this.getAllYearsBab(this.props)
            if (!this.props.all_bab.length) {
                this.props.dispatch(getBab(this.props.socket))
            }
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
            this.props.dispatch(getBab(this.props.socket))
        }
    }
    render() {
        const { years, selectedYear } = this.state
        const { all_bab } = this.props
        const { onClickTambah, onClickEdit } = this.props

        const kabColumns = [{
            title: 'Tahun Buku',
            dataIndex: 'tahun_buku',
            key: 'tahun_buku',
            width: 90,
            sorter: (a, b) => a.tahun_buku - b.tahun_buku
        }, {
            title: 'Nomor',
            dataIndex: 'nomor',
            key: 'nomor',
            width: 90,
            sorter: (a, b) => a.nomor - b.nomor
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
            title: 'Pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            align: 'center',
            width: 90,
            render: (text, record) => <span>
                <a onClick={() => onClickEdit(`Edit Bab ${record.nomor}. ${record.name}`, record)}><EditTwoTone /></a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Bab ini?`} onConfirm={() => this.props.dispatch(deleteBabbyId(this.props.socket, { _id: record._id, tahun_buku: record.tahun_buku }))}>
                    <DeleteTwoTone twoToneColor="#eb2f96" />
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={24}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <InputForm xs={19} name='Tahun Buku' isWajib={false} left>
                            <Select
                                showSearch
                                style={{ width: 120 }}
                                placeholder="Tahun buku"
                                optionFilterProp="children"
                                onChange={(selectedYear) => this.setState({ selectedYear })}
                                value={selectedYear}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="all_year" key="all_year">Semua</Option>
                                {years.length ? years.map(y => (<Option value={y} key={y}>{y}</Option>)) : <Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Option>}
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
                            columns={kabColumns}
                            dataSource={all_bab.filter(b => (selectedYear === 'all_year' || selectedYear == b.tahun_buku))}
                            pagination={false}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}