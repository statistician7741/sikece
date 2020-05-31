import { Row, Col, Table, Divider, Popconfirm, Button, Input, Space, Select, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

export default class LihatIndikator_Indikator extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Cari judul`}
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
        const { xs, md, babData, dataIndikators } = this.props

        const columns = [{
            title: 'Indikator',
            dataIndex: 'name',
            width: 250,
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            },
            ...this.getColumnSearchProps('name')
        }, {
            title: 'Judul baris',
            dataIndex: 'judul_baris',
            render: (value, record) => {
                return value.name
            }
        },
        {
            title: 'Judul Kolom',
            dataIndex: 'judul_kolom',
            render: (value, record) => {
                return value.map(kolom => <Tag color="default" style={{ marginTop: 2 }} key={kolom._id}>{kolom.name}</Tag>)
            }
        },
        {
            title: 'Keterangan',
            dataIndex: 'ket',
        }, {
            title: 'pilihan',
            dataIndex: 'pilihan',
            fixed: 'right',
            width: 140,
            render: (text, record) => <span>
                <a>Edit</a>
                <Divider type="vertical" />
                <Popconfirm title={`Hapus Indikator ini?`}>
                    <a disabled={record.isSudahDibayar}>Hapus</a>
                </Popconfirm>
            </span>
        }]

        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Indikator</strong></Col>
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
                            dataSource={dataIndikators}
                            rowKey="_id"
                            pagination={{ defaultPageSize: 15, showSizeChanger: true, position: 'top', pageSizeOptions: ['15', '30', '50', '100', '200', '500'], showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} baris` }}
                        />
                    </Col>
                </Row>
            </Col>
        )
    }
}