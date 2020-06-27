import { Row, Col, PageHeader, Progress, Button, Space, Table, Tag, Carousel, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import { ArrowRightOutlined, ArrowLeftOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { getKec, getTable, getVariable, getDeskel } from "../../../redux/actions/master.action"
import { replaceToKecName } from '../../../functions/basic.func'
import SlideShow from './SlideShow.Component'

export default class IndexApproval extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        tables: [],
        tables_obj: {},
        dataIndikators: [{
            _id: 1,
            name: 'Tabel 1.2 Dusun dan Dasawisma di Kecamatan Pasarwajo (Hektar), 2019',
            status: 'Desetujui',
            ket: "-",
            judul_baris: {
                _id: 'a',
                name: 'Desa/Kelurahan',
                vars: ['Holimombo Jaya', 'Kondowa', 'Dongkala', 'Holimombo', 'Takimpo', 'Kombeli', 'Awainulu']
            },
            judul_kolom: [{
                _id: 'b',
                name: 'Jumlah penduduk',
                vars: [
                    ["Laki-laki", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Perempuan", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Jumlah", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Pie', '-', "-"],
                ]
            }, {
                _id: 'c',
                name: 'Kematian',
                vars: [
                    ["Kematian", "Jiwa", "Angka", 0, 'Bar', '-', "-"],
                ]
            }, {
                _id: 'd',
                name: 'Kelahiran',
                vars: [
                    ["Kelahiran", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                ]
            }],
        }]
    }
    setAllTable = (all_kec, all_table) => {
        let tables = []
        let tables_obj = {}
        all_kec.forEach(kec => {
            all_table.forEach(table => {
                let { _id, judul, sumber, catatan, ket } = table
                let hasil_entry = undefined
                kec.table.forEach(t => {
                    if (t._idTable === _id) hasil_entry = t
                })
                if (hasil_entry) {
                    sumber = hasil_entry.sumber
                    catatan = hasil_entry.catatan
                    ket = hasil_entry.ket
                }
                tables_obj[`${kec._id}.${_id}`] = {
                    ...table,
                    _id: `${kec._id}.${_id}`,
                    _idKec: kec._id,
                    _idTable: _id,
                    isApproved: hasil_entry ? hasil_entry.isApproved : undefined,
                    judul: replaceToKecName(judul, kec),
                    sumber: replaceToKecName(sumber, kec),
                    catatan: replaceToKecName(catatan, kec),
                    ket: replaceToKecName(ket, kec)
                }
                tables.push(tables_obj[`${kec._id}.${_id}`])
            })
        })
        this.setState({ tables, tables_obj })
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
    onClickLihat = (record) => {
        console.log(record);
    }
    componentDidMount() {
        if (this.props.socket) {
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_deskel.length && this.props.dispatch(getDeskel(this.props.socket))
            !this.props.all_variable.length && this.props.dispatch(getVariable(this.props.socket))
            this.props.all_kec.length && this.props.all_table.length && this.setAllTable(this.props.all_kec, this.props.all_table)
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getDeskel(this.props.socket))
            this.props.dispatch(getVariable(this.props.socket))
        }
        if (this.props.all_table !== prevProps.all_table || this.props.all_kec !== prevProps.all_kec) {
            if (this.props.all_table.length && this.props.all_kec.length) {
                this.setAllTable(this.props.all_kec, this.props.all_table)
            }
        }
    }
    render() {
        const { tables } = this.state
        const { all_table, all_kec, all_kec_obj, all_variable } = this.props
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
            width: 310,
            showSorterTooltip: false,
            sorter: (a, b) => a.judul - b.judul,
            ...this.getColumnSearchProps('judul')
        }, {
            title: 'Status',
            dataIndex: 'isApproved',
            width: 65,
            render: (isApproved, record) => (<Tag color={isApproved ? "#87d068" : undefined}>{isApproved ? "Disetujui" : "Belum Disetujui"}</Tag>)
        },
        {
            title: 'Keterangan',
            dataIndex: 'ket'
        }, {
            title: 'pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 65,
            render: (text, record) => <span>
                <a onClick={() => this.onClickLihat(record)}>Lihat</a>
            </span>
        }]

        const sliderSettings = {
            dots: true,
            fade: false
        };

        return (
            <PageHeader
                className="site-page-header"
                title="Persetujuan Data"
            >
                <SlideShow {...this.props} />
                <Row>
                    <Col xs={24}>
                        <Table
                            size="small"
                            loading={!tables.length}
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