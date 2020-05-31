import { Row, Col, Table, Divider, Popconfirm, Button, Input, Space, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

export default class LihatBaris_Baris extends React.Component {
    state = {
        bariss: [{
            _id: 1,
            name: 'Desa/Kelurahan',
            subjek: 'Sosial Kependudukan',
            ket: '-'
        }, {
            _id: 2,
            name: 'Bulan',
            subjek: 'Lainnya',
            ket: '-'
        }, {
            _id: 3,
            name: 'Detail Kecamatan',
            subjek: 'Lainnya',
            ket: '-'
        },],
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
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
                    textToHighlight={text.toString()}
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
        const { xs, md } = this.props
        const { bariss } = this.state

        const columns = [{
            title: 'Judul Baris',
            dataIndex: 'name',
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            },
            ...this.getColumnSearchProps('name')
        }, {
            title: 'Subjek',
            dataIndex: 'subjek',
            sorter: (a, b) => {
                return a.subjek.localeCompare(b.subjek)
            },
            width: 300,
            ...this.getColumnSearchProps('subjek')
        }, {
            title: 'Keterangan',
            dataIndex: 'ket',
            width: 300
        }, {
            title: 'pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 140,
            render: (text, record) => <span>
                <a>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Judul Baris ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Baris Baris</strong></Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row><Col>
                            <Button type="primary">
                                <PlusOutlined /> Tambah
                            </Button>
                        </Col></Row>
                    </Col>
                </Row>
                <Row gutter={[64, 0]}>
                    <Col xs={24}>
                        <Table
                            scroll={{ x: 1000 }}
                            columns={columns}
                            dataSource={bariss}
                            rowKey="_id"
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }}
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}