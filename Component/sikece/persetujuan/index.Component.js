import { Row, Col, PageHeader, Button, Space, Table, Tag, Typography, Input, Alert } from 'antd';
const { Text } = Typography;
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons'
import { getKec, getTable, getVariable, getDeskel } from "../../../redux/actions/master.action"
import { replaceToKecName } from '../../../functions/basic.func'
import SlideShow from './SlideShow.Component'

const DisabledOpt = () => <Text disabled>Lihat</Text>

const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};

export default class IndexApproval extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        tables_obj: {},
        tables: [],
        active_index: undefined,
        hostname: ''
    }
    getNextIndex = (prevIndex, maxIndex, tables) => {
        const newIndex = prevIndex + 1 > maxIndex ? 0 : prevIndex + 1
        if (tables[newIndex].all_data) return newIndex
        else return this.getNextIndex(newIndex, maxIndex, tables)
    }
    onClickNext = () => {
        const maxIndex = this.state.tables.length - 1
        this.setState({ active_index: this.getNextIndex(this.state.active_index, maxIndex, this.state.tables) })
    }
    getPrevIndex = (prevIndex, maxIndex, tables) => {
        const newIndex = prevIndex - 1 < 0 ? maxIndex : prevIndex - 1
        if (tables[newIndex].all_data) return newIndex
        else return this.getPrevIndex(newIndex, maxIndex, tables)
    }
    onClickPrev = () => {
        const maxIndex = this.state.tables.length - 1
        this.setState({ active_index: this.getPrevIndex(this.state.active_index, maxIndex, this.state.tables) })
    }
    setRefinedTable = (all_kec, all_table) => {
        let tables = []
        let tables_obj = {}
        all_kec.forEach(kec => {
            all_table.forEach(table => {
                const { _id, judul, sumber, catatan, ket } = table
                tables_obj[`${kec._id}.${_id}`] = {
                    ...table,
                    _id: `${kec._id}.${_id}`,
                    _idKec: kec._id,
                    _idTable: _id,
                    all_data: undefined,
                    judul: replaceToKecName(judul, kec),
                    isApproved: false,
                    isSudahEntri: false,
                    sumber: undefined,
                    catatan: undefined,
                    ket: undefined
                }
                kec.table && kec.table.forEach(entrian_table => {
                    if (entrian_table._idTable === table._id) {
                        const { isApproved, all_data, sumber, catatan, ket } = entrian_table
                        tables_obj[`${kec._id}.${_id}`]['isApproved'] = isApproved
                        tables_obj[`${kec._id}.${_id}`]['all_data'] = entrian_table
                        tables_obj[`${kec._id}.${_id}`]['sumber'] = sumber
                        tables_obj[`${kec._id}.${_id}`]['catatan'] = catatan
                        tables_obj[`${kec._id}.${_id}`]['ket'] = ket
                        tables_obj[`${kec._id}.${_id}`]['isSudahEntri'] = true
                    }
                })
                tables.push(tables_obj[`${kec._id}.${_id}`])
            })
        })
        this.setState({ tables: tables.sort((a, b) => (a.bab.localeCompare(b.bab))), tables_obj })
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
    onClickLihat = (active_index) => {
        scrollToTop()
        this.setState({ active_index })
    }
    componentDidMount() {
        this.setState({hostname: window.location.hostname})
        if (this.props.socket) {
            (this.props.all_kec.length && this.props.all_table.length) && this.setRefinedTable(this.props.all_kec, this.props.all_table)
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_deskel.length && this.props.dispatch(getDeskel(this.props.socket))
            !this.props.all_variable.length && this.props.dispatch(getVariable(this.props.socket))
            if (this.state.tables.length) {
                if (this.state.tables[0].all_data) {
                    this.setState({ active_index: 0 })
                } else {
                    let active_index = undefined
                    this.state.tables.forEach((t, i) => {
                        if (t.all_data) active_index = i
                    })
                    this.setState({ active_index })
                }
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getDeskel(this.props.socket))
            this.props.dispatch(getVariable(this.props.socket))
        }
        if (this.props.all_kec !== prevProps.all_kec || this.props.all_table !== prevProps.all_table) {
            (this.props.all_kec.length && this.props.all_table.length) && this.setRefinedTable(this.props.all_kec, this.props.all_table)
        }
        if (this.state.tables.length !== prevState.tables.length) {
            if (this.state.tables[0].all_data) {
                this.setState({ active_index: 0 })
            } else {
                let active_index = undefined
                this.state.tables.forEach((t, i) => {
                    if (t.all_data) active_index = i
                })
                this.setState({ active_index })
            }
        }
    }
    render() {
        const { tables_obj, tables, active_index, hostname } = this.state
        const { active_user: { kec, table } } = this.props
        const total = kec ? kec.length * table.length : 0
        const approved = kec ? [].concat(...tables).filter(item => item.isApproved).length : 0
        const persentase = kec ? (approved / total * 100) : 0
        const columns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t, r, i) => (i + 1)
        }, {
            title: 'Judul',
            dataIndex: 'judul',
            key: '_id',
            showSorterTooltip: false,
            sorter: (a, b) => a.judul - b.judul,
            ...this.getColumnSearchProps('judul')
        }, {
            title: 'Status',
            dataIndex: 'isApproved',
            width: 65,
            render: (isApproved, record) => (<Tag color={isApproved ? "#87d068" : (record.isSudahEntri ? (record.isApproved === undefined ? "#f50" : "#2db7f5") : undefined)}>{isApproved ? "Disetujui" : (record.isSudahEntri ? (record.isApproved === undefined ? "Belum dicek" : "Belum disetujui") : "Belum tersedia")}</Tag>)
        },
        {
            title: 'Sumber',
            dataIndex: 'sumber'
        }, {
            title: 'Pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 65,
            render: (text, record, i) => <span>
                {record.isSudahEntri ? <a onClick={() => this.onClickLihat(i)}>Lihat</a> : <DisabledOpt />}
            </span>
        }]

        return (
            <PageHeader
                className="site-page-header"
                title="Persetujuan Data"
            >
                <SlideShow {...this.props} tables_obj={tables_obj} tables={tables} active_index={active_index} onClickNext={this.onClickNext} onClickPrev={this.onClickPrev} />
                {persentase >= 100 ? <Alert
                    message="Selesai"
                    description="Terima kasih, semua tabel telah selesai disetujui."
                    type="success"
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                /> : null}
                <Alert
                    message="Unduh Surat Pernyataan Pengisian Data"
                    description={<span>Klik untuk mengunduh file surat pernyataan pengisian data di sini: <a href={`http://${hostname}/sikece/other/template`}>Unduh template</a></span>}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Row>
                    <Col xs={24}>
                        <Table
                            size="small"
                            loading={tables.length}
                            columns={columns}
                            dataSource={tables}
                            rowKey="_id"
                            pagination={{ defaultPageSize: 50, showSizeChanger: true, position: 'top', pageSizeOptions: ['50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} tabel` }}
                        />
                    </Col>
                </Row>
            </PageHeader>
        )
    }
}