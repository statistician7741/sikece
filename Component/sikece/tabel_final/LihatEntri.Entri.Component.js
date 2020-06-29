import { Row, Col, Select, Input, Button, Table, Space, Divider, Popconfirm, Tag, Typography, Tooltip } from 'antd';
const { Option } = Select
const { Text } = Typography;
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import InputForm from '../general/InputForm.Component'
import { replaceToKecName } from '../../../functions/basic.func'
import { deleteTableDatabyId, getKec } from '../../../redux/actions/master.action'

const DisabledOpt = () => <span>
    <Text disabled>Entri</Text>
    <Divider type="vertical" />
    <Text disabled>Hapus</Text>
</span>

export default class LihatTabel_Tabel extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        expandedRowKeys: []
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Cari...`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Cari
              </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : text}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    render() {
        const { expandedRowKeys } = this.state
        const { all_table, all_bab, all_kab, all_kec, all_kec_obj, all_kec_table_obj, bab, selectedYear, years, kab, kec, activeData } = this.props
        const { onClickEntri, onChangeDropdown, getDynamicTable, loadingData, activeRecord, getDataTable, setExpandLoading } = this.props
        const EnableOpt = ({ record }) => (
            <span>
                {loadingData && record._id === activeRecord._id ? <LoadingOutlined /> :
                    <a onClick={() => onClickEntri(`Entri Tabel ${record.nomor_tabel}`, record)}>Entri</a>}
                <Divider type="vertical" />
                <Popconfirm title={`Hapus entrian di tabel ini? Ini tidak akan menghapus tabel`} onConfirm={() => this.props.dispatch(deleteTableDatabyId(this.props.socket, { _idKec: kec, _idTable: record._id }, this.props, () => this.props.dispatch(getKec(this.props.socket))))}>
                    <a>Hapus</a>
                </Popconfirm>
            </span>
        )
        const tableColumns = [{
            title: 'No.',
            dataIndex: 'nomor_tabel',
            key: '_id',
            width: 45,
        }, {
            title: 'Judul',
            dataIndex: 'judul',
            key: '_id',
            showSorterTooltip: false,
            sorter: (a, b) => a.judul - b.judul,
            render: (text) => replaceToKecName(text, all_kec_obj[kec])
        },
        {
            title: 'Pesan Penyedia Data',
            dataIndex: '_id',
            width: 200,
            render: (_idTable, record) => (
                all_kec_table_obj[kec][_idTable] ? all_kec_table_obj[kec][_idTable].pesanPenyData : ""
            )
        },
        {
            title: 'Status',
            dataIndex: '_id',
            width: 65,
            render: (_idTable, record) => all_kec_table_obj[kec] ?
                (<Tooltip title={all_kec_table_obj[kec][_idTable] ? (all_kec_table_obj[kec][_idTable].isApproved === true ? "Telah disetujui oleh penyedia data" : (all_kec_table_obj[kec][_idTable].isApproved === false ? "Belum disetujui oleh penyedia data" : "Belum ditanggapi oleh penyedia data namun data sudah dientri")) : "Data tabel belum dientri"}>
                    <Tag
                        color={all_kec_table_obj[kec][_idTable] ? (all_kec_table_obj[kec][_idTable].isApproved ? "#87d068" : "#108ee9") : "#f50"}
                    >
                        {all_kec_table_obj[kec][_idTable] ? (all_kec_table_obj[kec][_idTable].isApproved === true ? "Disetujui" : (all_kec_table_obj[kec][_idTable].isApproved === false ? "Belum Disetujui" : "Belum Ditanggapi")) : "Belum entri"}
                    </Tag>
                </Tooltip>)
                : (<LoadingOutlined />)
        }
        ]
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={16}>
                        <InputForm xs={19} name='Tahun Buku' isWajib={false} left>
                            <Select
                                showSearch
                                style={{ width: 120 }}
                                placeholder="Tahun buku"
                                optionFilterProp="children"
                                onChange={(selectedYear) => onChangeDropdown({ selectedYear })}
                                value={selectedYear}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {years.length ? years.map(y => (<Option value={y} key={y}>{y}</Option>)) : <Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Option>}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kab} value={kab} style={{ width: 200 }} onChange={kab => onChangeDropdown({ kab })}>
                                {all_kab.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kecamatan' isWajib={false} left>
                            <Select defaultValue={kec} value={kec} style={{ width: 200 }} onChange={kec => onChangeDropdown({ kec })}>
                                {all_kec.filter(kec => kab === kec.kab).map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Bab' isWajib={false} left>
                            <Select defaultValue={bab} value={bab} style={{ width: 200 }} onChange={bab => onChangeDropdown({ bab })}>
                                <Option value="all_bab" key="all_bab">Semua Bab</Option>
                                {all_bab.filter(bab => selectedYear == bab.tahun_buku).map(b => <Option value={b._id} key={b._id}>Bab {b.nomor}. {b.name}</Option>)}
                            </Select>
                        </InputForm>
                    </Col>
                </Row>
                <Row gutter={[64, 0]}>
                    <Col xs={24}>
                        <Table
                            size="small"
                            columns={tableColumns}
                            dataSource={all_table.filter(t => (selectedYear == t.bab.substring(0, 4) && (bab === 'all_bab' || bab === t.bab)))}
                            rowKey="_id"
                            expandedRowKeys={expandedRowKeys}
                            expandable={{
                                expandedRowRender: ({ baris, kolom, nomor_tabel, judul, sumber, catatan }) => getDynamicTable(baris, kolom, nomor_tabel, judul, sumber, catatan, kec, activeData),
                            }}
                            onExpand={(expanded, record) => {
                                this.setState({ expandedRowKeys: expanded ? [record._id] : [] }, () => {
                                    if (expanded) {
                                        setExpandLoading(true, () => {
                                            getDataTable(this.props, kec, record, () => setExpandLoading(false))
                                        })
                                    }
                                })
                            }}
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} tabel` }}
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}