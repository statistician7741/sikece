import { Row, Col, Input, Space, Button, Form, AutoComplete, Radio, Transfer, Table, Select } from 'antd';
const { TextArea } = Input;
import difference from 'lodash/difference';
import func from '../../../functions/basic.func'
import userFields from '../../../fields/user.fields'
import { simpanUser } from "../../../redux/actions/user.action"
import { Fragment } from 'react';

const lc = (text) => (text ? text.toLowerCase() : text)

const leftTableColumnsTable = [
    {
        dataIndex: 'judul',
        title: 'Judul',
        ellipsis: {
            showTitle: true,
        },
        render: (text, row) => (`${row.nomor_tabel} ${text}`)
    }
];
const rightTableColumnsTable = (type) => ([
    {
        dataIndex: 'judul',
        title: 'Judul',
        ellipsis: {
            showTitle: true,
        },
        render: (text, row) => (`${row.nomor_tabel} ${text}`)
    }
]);

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false}>
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;

            const rowSelection = {
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ pointerEvents: listDisabled ? 'none' : null }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                    pagination={columns.length === 1 ? {} : { defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '25', '30', '50', '100'] }}
                />
            );
        }}
    </Transfer>
);

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const jenisPenggunaOpt = [
    { label: 'Penyedia Data', value: 'peny_data' },
    { label: 'Kepala BPS', value: 'ka_bps' },
    { label: 'Editor', value: 'editor' },
    { label: 'Operator Entri', value: 'pengentri' },
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Admin', value: 'admin' },
];

export default class EditorUser_User extends React.Component {
    state = {
        ...func.getFormVar(userFields, null, true),
        data: [],
        nestedHeaders: [
            ['Tahun Buku', 'Nomor', 'Nama User', 'Keterangan'],
            ['(1)', '(2)', '(3)', '(4)']
        ],
        autoCompleteDataSource: [],
        isUsernameDuplicate: false,
        prevUsername: undefined,
        selectedKecKeys: [],
        targetKecKeys: [],
        selectedTableKeys: [],
        targetTableKeys: []

    }
    filterOption = (inputValue, { name, kab }) => (name ? lc(name).indexOf(inputValue) > -1 : false) || (this.props.all_kab_obj[kab].name ? lc(this.props.all_kab_obj[kab].name).indexOf(lc(inputValue)) > -1 : false);
    filterOptionTable = (inputValue, { nomor_tabel, judul }) => (judul ? lc(`${nomor_tabel} ${judul}`).indexOf(inputValue) > -1 : false);
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }
    handleAutoCSearch = (query, field, Model) => {
        const { socket } = this.props;
        let q = { query: this.safeQuery(query), field, Model }
        socket.emit('api.general.autocomplete/getFieldByText', q, ({ data }) => {
            this.setState({ autoCompleteDataSource: query ? data : [] });
        })
    }
    isDuplicate = (query, field, Model) => {
        const { socket } = this.props;
        let q = { query: this.safeQuery(query), field, Model }
        socket.emit('api.general.autocomplete/isDuplicate', q, (response) => {
            if (response.type === 'ok') {
                this.setState({ isUsernameDuplicate: response.data })
            }
        })
    }
    isReallyUsernameDuplicate = (isUsernameDuplicate, username, prevUsername) => {
        return isUsernameDuplicate && username !== "" && prevUsername !== username
    }
    get data() {
        return this.state.data
    }
    onChangeInput = (changedValues) => {
        if (changedValues.username) {
            this.isDuplicate(changedValues.username, 'username', 'User')
        } else if (changedValues.tahun_buku) {
            this.setState({
                selectedTableKeys: [],
                targetTableKeys: [],
                table: [],
                ...changedValues
            }, () => {
                this.formRef.current && this.formRef.current.setFieldsValue({
                    table: []
                });
            })
            return
        }
        this.setState(changedValues)
    }
    onChangeMultiple = (changes) => {
        let newData = [...this.state.data]
        for (let [row, column, oldValue, newValue] of changes) {
            if (!newData[row]) newData[row] = {}
            newData[row][column] = newValue;
        }
        this.setState({
            data: newData
        })
    }
    handleKecChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            let kec = [...this.state.kec.concat(moveKeys)]
            this.setState({ targetKecKeys: kec, kec })
        } else {
            let kec = this.state.kec.filter(i => !moveKeys.includes(i))
            this.setState({ targetKecKeys: kec, kec })
        }
    }
    handleSelectKecChange = (sourceSelectedKeys, targetSelectedKeys) => this.setState({ selectedKecKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
    handleTableChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            let table = [...this.state.table.concat(moveKeys)]
            this.setState({ targetTableKeys: table, table })
        } else {
            let table = this.state.table.filter(i => !moveKeys.includes(i))
            this.setState({ targetTableKeys: table, table })
        }
    }
    handleSelectTableChange = (sourceSelectedKeys, targetSelectedKeys) => this.setState({ selectedTableKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })

    removeRowMultipleEdit = (rowsIndex) => {
        let newData = [...this.state.data]
        _.reverse(rowsIndex).forEach(row => {
            newData = _.filter(newData, (User, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanUser = () => {
        this.props.dispatch(simpanUser(this.props.socket, func.getFormVar(userFields, this.state), this.props, this.props.onBack))
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        if (this.props.activeRecord) {
            this.onChangeInput({ ...func.getFormVar(userFields, this.props.activeRecord), prevUsername: this.props.activeRecord.username })
            this.formRef.current && this.formRef.current.setFieldsValue(func.getFormVar(userFields, this.props.activeRecord));
            this.setState({ targetKecKeys: this.props.activeRecord.kec, targetTableKeys: this.props.activeRecord.table })
        } else {
            this.onChangeInput(func.getFormVar(userFields, undefined, true))
            this.formRef.current && this.formRef.current.setFieldsValue(func.getFormVar(userFields, undefined, true));
        }
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input

    render() {
        const {
            username,
            password,
            name,
            jenis_pengguna,
            autoCompleteDataSource,
            isUsernameDuplicate,
            prevUsername,
            targetKecKeys,
            selectedKecKeys,
            targetTableKeys,
            selectedTableKeys,
            tahun_buku,
            kec,
            table
        } = this.state
        const { all_kec, all_kab_obj, all_table, years } = this.props

        const leftTableColumns = [
            {
                dataIndex: 'name',
                title: 'Kecamatan',
                ellipsis: {
                    showTitle: true,
                }
            },
            {
                dataIndex: 'kab',
                title: 'Kab',
                ellipsis: {
                    showTitle: true,
                },
                render: (text) => all_kab_obj[text].name
            }
        ];
        const rightTableColumns = (type) => ([
            {
                dataIndex: 'name',
                title: 'Kecamatan',
                ellipsis: {
                    showTitle: true,
                }
            },
            {
                dataIndex: 'kab',
                title: 'Kab',
                ellipsis: {
                    showTitle: true,
                },
                render: (text) => all_kab_obj[text].name
            }
        ]);
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Form
                            ref={this.formRef}
                            {...formItemLayout}
                            onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                            initialValues={{
                                _id: undefined, name: undefined, ket: undefined
                            }}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon input username',
                                    },
                                ]}
                                validateStatus={this.isReallyUsernameDuplicate(isUsernameDuplicate, username, prevUsername) ? "error" : undefined}
                                help={this.isReallyUsernameDuplicate(isUsernameDuplicate, username, prevUsername) ? "Username sudah terpakai" : undefined}
                            >
                                <Input
                                    placeholder="Username"
                                    autoComplete="off"
                                    style={{ width: "25%" }}
                                    ref={this.saveInputRef}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon input password',
                                    },
                                ]}

                            >
                                <Input.Password
                                    placeholder="Password"
                                    autoComplete="off"
                                    style={{ width: "25%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nama"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon input nama pengguna',
                                    },
                                ]}

                            >
                                <AutoComplete
                                    allowClear
                                    options={autoCompleteDataSource}
                                    onSearch={q => this.handleAutoCSearch(q, 'name', 'User')}
                                    style={{ width: "40%" }}
                                >
                                    <Input
                                        placeholder="Nama pengguna"
                                    />
                                </AutoComplete>
                            </Form.Item>
                            <Form.Item
                                label="Jenis pengguna"
                                name="jenis_pengguna"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon pilih jenis pengguna',
                                    },
                                ]}
                            >
                                <Radio.Group options={jenisPenggunaOpt} />
                            </Form.Item>
                            {jenis_pengguna === 'peny_data' || jenis_pengguna === 'pengentri' ?
                                <Fragment>
                                    <Form.Item
                                        label="Tahun Buku"
                                        name="tahun_buku"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mohon pilih tahun buku',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Pilih tahun buku"
                                            style={{ width: 120 }}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            showSearch
                                            allowClear
                                        >
                                            {years.length ? years.map(y => (<Option value={y} key={y}>{y}</Option>)) : <Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Option>}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Kec"
                                        name="kec"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mohon pindahkan 1 atau beberapa Kecamatan',
                                            },
                                        ]}
                                    >
                                        <TableTransfer
                                            showSearch
                                            dataSource={all_kec}
                                            titles={['Semua Kecamatan', 'Kecamatan terpilih']}
                                            targetKeys={targetKecKeys}
                                            selectedKeys={selectedKecKeys}
                                            filterOption={this.filterOption}
                                            onChange={this.handleKecChange}
                                            onSelectChange={this.handleSelectKecChange}
                                            render={item => item.name}
                                            rowKey={item => item._id}
                                            leftColumns={leftTableColumns}
                                            rightColumns={rightTableColumns('Kec')}
                                            oneWay
                                            pagination
                                        />
                                    </Form.Item><Form.Item
                                        label="Tabel"
                                        name="table"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mohon pindahkan 1 atau beberapa Tabel',
                                            },
                                        ]}
                                    >
                                        <TableTransfer
                                            showSearch
                                            dataSource={all_table.filter(t => (tahun_buku && t.bab.match(new RegExp(tahun_buku, 'i'))))}
                                            titles={['Semua Tabel', 'Tabel terpilih']}
                                            targetKeys={targetTableKeys}
                                            selectedKeys={selectedTableKeys}
                                            filterOption={this.filterOptionTable}
                                            onChange={this.handleTableChange}
                                            onSelectChange={this.handleSelectTableChange}
                                            render={item => item.name}
                                            rowKey={item => item._id}
                                            leftColumns={leftTableColumnsTable}
                                            rightColumns={rightTableColumnsTable('Table')}
                                            oneWay
                                            pagination
                                        />
                                    </Form.Item>
                                </Fragment> : null}
                            <Form.Item
                                label="Keterangan"
                                name="ket"
                            >
                                <AutoComplete
                                    allowClear
                                    options={autoCompleteDataSource}
                                    onSearch={q => this.handleAutoCSearch(q, 'ket', 'User')}
                                    style={{ width: "50%" }}
                                >
                                    <TextArea
                                        placeholder="Keterangan"
                                        style={{ height: 50 }}
                                    />
                                </AutoComplete>
                            </Form.Item>
                        </Form>
                        <Row>
                            <Col xs={24} md={24}>
                                <Space>
                                    <Button type="primary" disabled={(isUsernameDuplicate && username !== prevUsername) || !(username && password && name && jenis_pengguna && ((jenis_pengguna !== 'peny_data' && jenis_pengguna !== 'pengentri') || (kec.length && table.length && tahun_buku)))} onClick={this.onClickSimpanUser}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}