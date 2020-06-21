import { Row, Col, Input, Space, Table, Divider, Popconfirm, Select, Button, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
const { Option } = Select;
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import InputForm from '../../general/InputForm.Component'
import { deleteTablebyId, getBab, getTable, getVariable, getKec, getDeskel } from "../../../../redux/actions/master.action"

export default class LihatTabel_Tabel extends React.Component {
    state = {
        searchText: '',
        searchedColumn: ''
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
    componentDidMount() {
        if (this.props.socket) {
            !this.props.all_bab.length && this.props.dispatch(getBab(this.props.socket))
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_variable.length && this.props.dispatch(getVariable(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_deskel.length && this.props.dispatch(getDeskel(this.props.socket))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getBab(this.props.socket))
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getVariable(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getDeskel(this.props.socket))
        }
    }
    render() {
        const { all_table, all_variable_obj, all_bab, bab, selectedYear, years } = this.props
        const { onClickTambah, onClickEdit, onChangeDropdown, getDynamicTable } = this.props
        const tableColumns = [{
            title: 'No.',
            dataIndex: 'nomor_tabel',
            key: '_id',
            width: 45,
        }, {
            title: 'Judul',
            dataIndex: 'judul',
            key: '_id',
            width: 220,
            showSorterTooltip: false,
            sorter: (a, b) => a.judul - b.judul,
            ...this.getColumnSearchProps('judul')
        }, {
            title: 'Baris',
            dataIndex: 'baris',
            width: 130,
            render: (baris) => baris.length ? baris.map(b_id => <Tag style={{ marginTop: 2 }} key={b_id}>{all_variable_obj[b_id] ? all_variable_obj[b_id].name : <LoadingOutlined />}</Tag>) : null,
        }, {
            title: 'Kolom',
            dataIndex: 'kolom',
            width: 210,
            render: (kolom) => kolom.length ? kolom.map(k_id => <Tag style={{ marginTop: 2 }} key={k_id}>{all_variable_obj[k_id] ? all_variable_obj[k_id].name : <LoadingOutlined />}</Tag>) : null,

        }, {
            title: 'Keterangan',
            dataIndex: 'ket',
            ...this.getColumnSearchProps('ket')
        }, {
            title: 'pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 140,
            render: (text, record) => <span>
                <a onClick={() => onClickEdit(`Edit tabel ${record.judul}`, record)}>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus tabel ini?`} onConfirm={() => this.props.dispatch(deleteTablebyId(this.props.socket, record._id, this.props))}>
                    <a>Hapus</a>
                </Popconfirm>
            </span>
        }]
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
                        <InputForm xs={19} name='Bab' isWajib={false} left>
                            <Select defaultValue={bab} value={bab} style={{ width: 200 }} onChange={bab => onChangeDropdown({ bab })}>
                                <Option value="all_bab" key="all_bab">Semua Bab</Option>
                                {all_bab.filter(bab => selectedYear == bab.tahun_buku).map(b => <Option value={b._id} key={b._id}>Bab {b.nomor}. {b.name}</Option>)}
                            </Select>
                        </InputForm>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row><Col>
                            <Button type="primary" onClick={() => onClickTambah()}>
                                <PlusOutlined /> Tambah
                            </Button>
                        </Col></Row>
                    </Col>
                </Row>
                <Row gutter={[64, 0]}>
                    <Col xs={24}>
                        <Table
                            scroll={{ x: 1200 }}
                            size="small"
                            columns={tableColumns}
                            dataSource={all_table.filter(t => (bab === 'all_bab' || bab === t.bab)).sort((a, b) => a.nomor_tabel.localeCompare(b.nomor_tabel))}
                            rowKey="_id"
                            expandable={{
                                expandedRowRender: ({baris, kolom, nomor_tabel, judul, sumber, catatan}) => getDynamicTable(baris, kolom, nomor_tabel, judul, sumber, catatan),
                            }}
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} tabel` }}
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}