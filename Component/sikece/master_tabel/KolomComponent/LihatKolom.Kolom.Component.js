import { Row, Col, Table, Divider, Popconfirm, Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { deleteVariablebyId } from "../../../../redux/actions/master.action"

export default class LihatBab_Bab extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        selectedRowKeys: []
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

    multipleDeleteById = (selectedRowKeys) => {
        selectedRowKeys.forEach(_id => this.props.dispatch(deleteVariablebyId(this.props.socket, _id, this.props)))
        this.props.setActiveRecord([], [])
    }

    render() {
        const { all_variable } = this.props
        const { onClickTambah, onClickEdit, setActiveRecord } = this.props
        const { selectedRowKeys } = this.props

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                setActiveRecord([...selectedRows.map(v=>({...v}))], selectedRowKeys)
            },
            selectedRowKeys
        }

        const columns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t, r, i) => (i + 1)
        }, {
            title: 'Variabel',
            dataIndex: 'name',
            showSorterTooltip: false,
            width: 150,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            },
            ...this.getColumnSearchProps('name')
        }, {
            title: 'Kelompok',
            dataIndex: 'kelompok',
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.kelompok.localeCompare(b.kelompok)
            },
            ...this.getColumnSearchProps('kelompok')
        }, {
            title: 'Subjek',
            dataIndex: 'subject',
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.subject.localeCompare(b.subject)
            },
            ...this.getColumnSearchProps('subject')
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
                <a onClick={() => onClickEdit(`Edit Variabel ${record.name}`, record)}>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Variabel ini?`} onConfirm={() => this.props.dispatch(deleteVariablebyId(this.props.socket, record._id, this.props))}>
                    <a>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={24}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={8}>
                        <Row><Col>
                            <Space>
                                <Button type="primary" onClick={() => onClickTambah()}>
                                    <PlusOutlined /> Tambah
                            </Button>
                                <Button type="primary" disabled={!selectedRowKeys.length} onClick={() => onClickEdit(`Edit Variabel`)}>
                                    <EditOutlined /> Edit
                            </Button>
                                <Popconfirm title={`Hapus Variabel ini?`} onConfirm={() => this.multipleDeleteById(selectedRowKeys)}>
                                    <Button type="primary" danger disabled={!selectedRowKeys.length}>
                                        <DeleteOutlined /> Hapus
                            </Button>
                                </Popconfirm>
                            </Space>
                        </Col></Row>
                    </Col>
                </Row>
                <Row gutter={[64, 0]}>
                    <Col xs={24}>
                        <Table
                            size="small"
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={all_variable}
                            rowKey="_id"
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }}
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}