import { Row, Col, Table, Divider, Popconfirm, Input, Space, Button } from 'antd';
import { PlusOutlined, SearchOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { deleteUserbyId, getUser } from "../../../redux/actions/user.action"
import Highlighter from 'react-highlight-words';

const jenisPengguna = {
    peny_data: 'Penyedia Data',
    ka_bps: 'Kepala BPS',
    editor: 'Editor',
    pengentri: 'Operator Entri',
    supervisor: 'Supervisor',
    admin: 'Admin'
};

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
        if (this.props.socket && !this.props.all_user.length) {
            this.props.dispatch(getUser(this.props.socket))
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getUser(this.props.socket))
        }
    }
    render() {
        const { all_user } = this.props
        const { onClickTambah, onClickEdit } = this.props

        const userColumns = [{
            title: 'No.',
            dataIndex: '_id',
            key: '_id',
            width: 45,
            render: (t, r, i) => (i + 1)
        }, {
            title: 'Nama',
            dataIndex: 'name',
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            },
            ...this.getColumnSearchProps('name')
        }, {
            title: 'Username',
            dataIndex: 'username',
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.username.localeCompare(b.username)
            },
            ...this.getColumnSearchProps('username')
        }, {
            title: 'Jenis Pengguna',
            dataIndex: 'jenis_pengguna',
            showSorterTooltip: false,
            sorter: (a, b) => {
                return a.jenis_pengguna.localeCompare(b.jenis_pengguna)
            },
            render: (text) => jenisPengguna[text]
        }, {
            title: 'Keterangan',
            dataIndex: 'ket',
            ...this.getColumnSearchProps('username')
        }, {
            title: 'Pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            align: 'center',
            width: 90,
            render: (text, record) => <span>
                <a onClick={() => onClickEdit(`Edit Pengguna ${record.name}`, record)}><EditTwoTone /></a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Pengguna ini?`} onConfirm={() => this.props.dispatch(deleteUserbyId(this.props.socket, record._id, this.props))}>
                    <DeleteTwoTone twoToneColor="#eb2f96" />
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={24}>
                <Row gutter={[64, 16]}>
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
                            size="small"
                            loading={!all_user.length}
                            columns={userColumns}
                            dataSource={all_user}
                            pagination={false}
                            rowKey="_id"
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} tabel` }}
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}