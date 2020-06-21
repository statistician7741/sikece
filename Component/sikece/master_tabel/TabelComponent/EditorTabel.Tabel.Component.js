import { Row, Col, Input, Space, Button, Table, Form, Select, Transfer, AutoComplete } from 'antd';
const { TextArea } = Input;
import func from '../../../../functions/basic.func'
import tableFields from '../../../../fields/table.fields'
import _ from 'lodash'
import difference from 'lodash/difference';
import { simpanTable } from "../../../../redux/actions/master.action"

const lc = (text) => (text ? text.toLowerCase() : text)

const leftTableColumns = [
    {
        dataIndex: 'name',
        title: 'Variabel',
        ellipsis: {
            showTitle: true,
        }
    },
    {
        dataIndex: 'kelompok',
        title: 'Kelompok',
        ellipsis: {
            showTitle: true,
        }
    },
    {
        dataIndex: 'subject',
        title: 'Subjek',
        ellipsis: {
            showTitle: true,
        }
    },
];
const rightTableColumns = (type) => ([
    {
        dataIndex: 'name',
        title: 'Variabel',
        ellipsis: {
            showTitle: true,
        }
    },
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
                    pagination={columns.length === 1 ? {} : { defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '25', '30'] }}
                />
            );
        }}
    </Transfer>
);

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
    },
};

export default class EditorTabel_Tabel extends React.Component {
    state = {
        ...func.getFormVar(tableFields, null, true),
        tahun_buku: new Date().getFullYear(),
        targetBarisKeys: [],
        selectedBarisKeys: [],
        targetKolomKeys: [],
        selectedKolomKeys: [],
        autoCompleteDataSource: []
    }
    saveInputRef = input => this.input = input
    formRef = React.createRef();
    onChangeInput = (changedValues) => {
        console.log(changedValues);
        if (changedValues.baris || changedValues.kolom) return;
        this.setState(changedValues)
    }
    onClickSimpanTable = () => {
        this.props.dispatch(simpanTable(this.props.socket, func.getFormVar(tableFields, this.state), this.props, this.props.onBack))
    }

    isMultipleEditValid = () => {
        let isValid = true;
        const { nomor_tabel, judul, bab, baris, kolom, sumber } = this.state;
        if (!nomor_tabel || !judul || !bab || !baris.length || !kolom.length || !sumber) isValid = false
        return isValid;
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

    removeRowMultipleEdit = (rowsIndex) => {
        let newData = [...this.state.data]
        _.reverse(rowsIndex).forEach(row => {
            newData = _.filter(newData, (table, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    get data() {
        return this.state.data
    }

    componentDidMount = () => {
        this.input && this.input.focus()
        if (this.props.activeRecord) {
            const { _id, bab, nomor_tabel, judul, baris, kolom, sumber, catatan, ket } = this.props.activeRecord
            const tahun_buku = nomor_tabel.match(/^\d{4}/) ? nomor_tabel.match(/^\d{4}/) : new Date().getFullYear();
            this.formRef.current && this.formRef.current.setFieldsValue({
                tahun_buku,
                bab,
                nomor_tabel,
                judul,
                baris,
                kolom,
                sumber,
                catatan,
                ket,
            });
            this.setState({
                _id, tahun_buku, bab, nomor_tabel, judul, baris, kolom, sumber, catatan, ket,
                targetBarisKeys: baris, targetKolomKeys: kolom
            })
        } else {
            let bab = this.props.all_bab.filter(bab => this.props.selectedYear == bab.tahun_buku).length ? this.props.all_bab.filter(bab => this.props.selectedYear == bab.tahun_buku)[0]._id : undefined
            this.formRef.current && this.formRef.current.setFieldsValue({
                tahun_buku: new Date().getFullYear(),
                bab,
            });
            this.setState({ bab })
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.tahun_buku !== prevState.tahun_buku) {
            let bab = this.props.all_bab.filter(bab => this.state.tahun_buku == bab.tahun_buku).length ? this.props.all_bab.filter(bab => this.state.tahun_buku == bab.tahun_buku)[0]._id : undefined
            this.formRef.current && this.formRef.current.setFieldsValue({
                bab
            });
            this.setState({ bab })
        }
    }
    filterOption = (inputValue, { name, kelompok, subject, ket }) => (name ? lc(name).indexOf(inputValue) > -1 : false) || (kelompok ? lc(kelompok).indexOf(lc(inputValue)) > -1 : false) || (subject ? lc(subject).indexOf(lc(inputValue)) > -1 : false) || (ket ? lc(ket).indexOf(lc(inputValue)) > -1 : false);
    handleBarisChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            let baris = [...this.state.baris.concat(moveKeys)]
            this.setState({ targetBarisKeys: baris, baris })
        } else {
            let baris = this.state.baris.filter(i => !moveKeys.includes(i))
            this.setState({ targetBarisKeys: baris, baris })
        }
    }
    handleSelectBarisChange = (sourceSelectedKeys, targetSelectedKeys) => this.setState({ selectedBarisKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
    handleKolomChange = (targetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            let kolom = [...this.state.kolom.concat(moveKeys)]
            this.setState({ targetKolomKeys: kolom, kolom })
        } else {
            let kolom = this.state.kolom.filter(i => !moveKeys.includes(i))
            this.setState({ targetKolomKeys: kolom, kolom })
        }
    }
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }
    handleAutoCSearch = (query, field) => {
        const { socket } = this.props;
        let q = { query: this.safeQuery(query), field, tahun: this.state.tahun_buku }
        socket.emit('api.master_tabel.table/getFieldByText', q, ({ data }) => {
            this.setState({ autoCompleteDataSource: query ? data : [] });
        })
    }
    handleSelectKolomChange = (sourceSelectedKeys, targetSelectedKeys) => this.setState({ selectedKolomKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
    render() {
        const {
            nomor_tabel,
            baris,
            kolom,
            judul,
            sumber,
            catatan,
            tahun_buku,
            targetBarisKeys,
            selectedBarisKeys,
            targetKolomKeys,
            selectedKolomKeys,
            autoCompleteDataSource
        } = this.state
        const { all_bab, all_variable, all_variable_obj, all_kec, years, getDynamicTable } = this.props
        return (
            <Col xs={24}>
                <Form
                    ref={this.formRef}
                    {...formItemLayout}
                    onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                    initialValues={{
                        _id: undefined, name: undefined, ket: undefined, view_as: 'Kolom'
                    }}
                >
                    <Form.Item
                        label="Tahun buku"
                        name="tahun_buku"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon pilih tahun buku',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{ width: 120 }}
                            placeholder="Tahun buku"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {years.length ? years.map(y => (<Select.Option value={y} key={y}>{y}</Select.Option>))
                                : <Select.Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Select.Option>}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Bab"
                        name="bab"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon pilih bab',
                            },
                        ]}
                    >
                        <Select style={{ width: 300 }}>
                            {all_bab.filter(bab => tahun_buku == bab.tahun_buku).map(b => <Select.Option value={b._id} key={b._id}>Bab {b.nomor}. {b.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Nomor"
                        name="nomor_tabel"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon input nomor tabel',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nomor tabel"
                            style={{ width: "16%" }}
                            ref={this.saveInputRef}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Judul"
                        name="judul"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon input judul tabel',
                            },
                        ]}
                    >
                        <AutoComplete
                            allowClear
                            options={autoCompleteDataSource}
                            onSearch={q => this.handleAutoCSearch(q, 'judul')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                placeholder="Judul tabel"
                                style={{ height: 50 }}
                            />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label="Baris"
                        name="baris"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon pindahkan beberapa variabel sebagai baris',
                            },
                        ]}
                    >
                        <TableTransfer
                            showSearch
                            dataSource={all_variable.filter(i => !kolom.includes(i._id))}
                            titles={['Semua variabel', 'Variabel terpilih']}
                            targetKeys={targetBarisKeys}
                            selectedKeys={selectedBarisKeys}
                            filterOption={this.filterOption}
                            onChange={this.handleBarisChange}
                            onSelectChange={this.handleSelectBarisChange}
                            render={item => item.name}
                            rowKey={item => item._id}
                            leftColumns={leftTableColumns}
                            rightColumns={rightTableColumns('Baris')}
                            oneWay
                            pagination
                        />
                    </Form.Item>
                    <Form.Item
                        label="Kolom"
                        name="kolom"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon pindahkan beberapa variabel sebagai kolom',
                            },
                        ]}
                    >
                        <TableTransfer
                            showSearch
                            dataSource={all_variable.filter(i => !baris.includes(i._id))}
                            titles={['Semua variabel', 'Variabel terpilih']}
                            targetKeys={targetKolomKeys}
                            selectedKeys={selectedKolomKeys}
                            filterOption={this.filterOption}
                            onChange={this.handleKolomChange}
                            onSelectChange={this.handleSelectKolomChange}
                            render={item => item.name}
                            rowKey={item => item._id}
                            leftColumns={leftTableColumns}
                            rightColumns={rightTableColumns('Kolom')}
                            oneWay
                            pagination
                        />
                    </Form.Item>
                    <Form.Item
                        label="Sumber"
                        name="sumber"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon input sumber tabel',
                            },
                        ]}

                    >
                        <AutoComplete
                            allowClear
                            options={autoCompleteDataSource}
                            onSearch={q => this.handleAutoCSearch(q, 'sumber')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                placeholder="Sumber tabel"
                                style={{ height: 50 }}
                            />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label="Catatan"
                        name="catatan"

                    >
                        <AutoComplete
                            allowClear
                            options={autoCompleteDataSource}
                            onSearch={q => this.handleAutoCSearch(q, 'catatan')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                placeholder="Catatan tabel"
                                style={{ height: 50 }}
                            />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label="Keterangan"
                        name="ket"
                    >
                        <AutoComplete
                            allowClear
                            options={autoCompleteDataSource}
                            onSearch={q => this.handleAutoCSearch(q, 'ket')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                placeholder="Keterangan tabel"
                                style={{ height: 50 }}
                            />
                        </AutoComplete>
                    </Form.Item>
                </Form>
                <Row gutter={[0, 8]}>
                    <Col xs={24}><strong>Preview</strong></Col>
                </Row>
                {getDynamicTable(baris, kolom, nomor_tabel, judul, sumber, catatan)}
                <Row>
                    <Col xs={24} md={24}>
                        <Space>
                            <Button type="primary" disabled={!this.isMultipleEditValid()} onClick={this.onClickSimpanTable}>Simpan</Button>
                        </Space>
                    </Col>
                </Row>
            </Col>
        )
    }
}