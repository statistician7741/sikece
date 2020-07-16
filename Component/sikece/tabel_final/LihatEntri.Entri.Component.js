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
        expandedRowKeys: [],
        downloadingTableId: undefined
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
    getHeader = (baris, kolom) => {
        const parents = {}
        const cols = []
        const { all_variable_obj } = this.props
        let position = 0
        //add kolom baris + kolom baris pertama
        let judul_kelompok_baris = ''
        baris.forEach((_idBaris, i) => {
            if (all_variable_obj[_idBaris].kelompok && judul_kelompok_baris === '') judul_kelompok_baris = all_variable_obj[_idBaris].kelompok
        })
        cols.push([judul_kelompok_baris === '' ? all_variable_obj[baris[0]].name : judul_kelompok_baris])
        cols.push(['']) //cols[1] = ['']
        position++; //position = 1
        kolom.forEach((_idKolom, i) => {
            let kelompok = all_variable_obj[_idKolom].kelompok
            if (kelompok !== "-" && kelompok !== "" && kelompok) {
                if (!parents[kelompok]) {
                    parents[kelompok] = {};
                    parents[kelompok].indexAnggota = [];
                }
                parents[kelompok].indexAnggota.push(_idKolom)
            } else {
                if (!parents[`no_parents_${i}`]) {
                    parents[`no_parents_${i}`] = {};
                    parents[`no_parents_${i}`].indexAnggota = [];
                }
                parents[`no_parents_${i}`].indexAnggota.push(_idKolom)
            }
        })
        for (var parent in parents) {
            if (parents.hasOwnProperty(parent)) {
                if (parent.includes('no_parents')) {
                    cols[0].push(all_variable_obj[parents[parent].indexAnggota[0]].name)
                    position++ //position = 3
                    cols[1].push('')
                } else {
                    //tambahkan parent di baris pertama col
                    cols[0].push({ 'label': parent, 'colspan': parents[parent].indexAnggota.length })
                    position++; //position = 2
                    //buat row judul kolom utk child
                    parents[parent].indexAnggota.forEach(_idKolom => cols[1].push(all_variable_obj[_idKolom].name))
                }
            }
        }
        let isRemoveRow2Header = true;
        cols[1].forEach(h => {
            if (h !== '') isRemoveRow2Header = false
        })
        return isRemoveRow2Header ? [cols[0]] : cols
    }
    getBarisDataSource = (baris, kolom, kec, activeData) => {
        const { all_variable_obj, all_deskel } = this.props;
        let judul_baris = [];
        let data = [];
        let indexKolom = {}
        let indexBaris = {}
        let posBaris = 0
        kolom.forEach((kolom_id, i)=>indexKolom[kolom_id] = i+1)
        console.log(kolom, indexKolom);
        baris.forEach((_id, i) => {
            if (all_variable_obj[_id].name.match(/^Desa\s?\/?\s?(Kelurahan)?\s?$/)) {
                const deskel = all_deskel.filter(d => (d.kec === kec))
                if (deskel.length) {
                    deskel.forEach((d, i) => {
                        judul_baris.push({ '_id': d._id })
                        data.push([`${d.kode} ${d.name}`])
                        indexBaris[d._id] = posBaris++
                    })
                } else {
                    judul_baris.push({ '_id': _id })
                    data.push([all_variable_obj[_id].name])
                    indexBaris[_id] = posBaris++
                }
            } else if (all_variable_obj[_id].name.match(/^Jumlah|Total\s?$/) && i === baris.length - 1) {
                judul_baris.push({ '_id': _id })
                data.push([all_variable_obj[_id].name])
                indexBaris[_id] = posBaris++
            } else {
                judul_baris.push({ '_id': _id })
                data.push([all_variable_obj[_id].name])
                indexBaris[_id] = posBaris++
            }
        })
        if (activeData) {
            activeData.all_data && judul_baris.forEach((activeBaris, i) => {
                activeData.all_data.forEach(row => {
                    if (activeBaris._id === row._idBaris) {
                        judul_baris[i] = { ...data, ...row }
                        kolom.forEach((kolom_id, i)=>{
                            data[indexBaris[activeBaris._id]][indexKolom[kolom_id]] = isNaN(row[kolom_id])?row[kolom_id]:+row[kolom_id]
                        })
                    }
                })
            })
        }
        return data;//judul_baris
    }
    unduhTable = (id, props, record, kec, nama, activeData) => {
        this.setState({ downloadingTableId: id }, () => {
            const { baris, kolom, nomor_tabel, judul, catatan } = record
            props.socket.emit('api.general.unduh/unduhTable', { baris, kolom, header: this.getHeader(baris, kolom), data: this.getBarisDataSource(baris,kolom,kec,activeData), nomor_tabel, judul, catatan, kec, nama, activeData }, (response) => {
                if (response.type === 'ok') {
                    this.setState({ downloadingTableId: undefined }, ()=>{
                        window.open(`/view/${response.data}`, "_top")
                    })
                } else {
                    props.showErrorMessage(response.additionalMsg)
                }
            })
        })
    }
    render() {
        const { expandedRowKeys, downloadingTableId } = this.state
        const { all_table, all_bab, all_kab, all_kec, all_kec_obj, all_kec_table_obj, bab, selectedYear, years, kab, kec, activeData } = this.props
        const { onChangeDropdown, getDynamicTable, getDataTable, setExpandLoading } = this.props
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
                all_kec_table_obj[kec] ? (all_kec_table_obj[kec][_idTable] ? all_kec_table_obj[kec][_idTable].pesanPenyData : "-") : "-"
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
        },
        {
            title: 'Pilihan',
            dataIndex: '_id',
            fixed: 'right',
            width: 85,
            render: (_idTable, record) =>
                downloadingTableId === record._id ?
                    <span><a disabled={true}>Unduh</a> <LoadingOutlined /></span>
                    : <span><a disabled={all_kec_table_obj[kec] ? (all_kec_table_obj[kec][_idTable]?!all_kec_table_obj[kec][_idTable].isApproved:true) : true} onClick={() => this.unduhTable(record._id, this.props, record, kec, all_kec_obj[kec] ? all_kec_obj[kec].name : '{nama}', all_kec_table_obj[kec][_idTable] ? all_kec_table_obj[kec][_idTable] : {})}>Unduh</a></span>
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
                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {years.length ? years.map(y => (<Option value={y} key={y}>{y}</Option>)) : <Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Option>}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kab} value={kab} style={{ minWidth: 200 }} onChange={kab => onChangeDropdown({ kab })}>
                                {all_kab.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kecamatan' isWajib={false} left>
                            <Select defaultValue={kec} value={kec} style={{ minWidth: 200 }} onChange={kec => onChangeDropdown({ kec })}>
                                {all_kec.filter(kec => kab === kec.kab).map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Bab' isWajib={false} left>
                            <Select defaultValue={bab} value={bab} style={{ minWidth: 200 }} onChange={bab => onChangeDropdown({ bab })}>
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