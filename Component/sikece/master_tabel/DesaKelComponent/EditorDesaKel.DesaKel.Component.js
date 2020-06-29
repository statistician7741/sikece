import { Row, Col, Input, Space, Button, Form, Select, Radio, AutoComplete } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import deskelFields from '../../../../fields/deskel.fields'
import { simpanDeskel } from "../../../../redux/actions/master.action"
import _ from 'lodash'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

export default class EditDeskel_Deskel extends React.Component {
    state = {
        ...func.getFormVar(deskelFields, null, true),
        nestedHeaders: [
            ['Kode', 'Desa/Kel', 'Klasifikasi', 'Keterangan'],
            ['(1)', '(2)', '(3)', '(4)']
        ],
        data: [],
        kab: undefined,
        kec: undefined,
        kode: undefined,
        name: undefined,
        klasifikasi: undefined,
        autoCompleteDataSource: []
    }
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

    get data() {
        return this.state.data
    }
    getAllKecByKab = (kab) => {
        return this.props.all_kec.length ? this.props.all_kec.filter(kec => (kab === kec.kab)) : []
    }
    onChangeInput = (changedValues) => {
        this.setState(changedValues);
    }
    onChangeInputKabKec = (changedValues) => {
        if (changedValues.kab) {
            let kec = this.getAllKecByKab(changedValues.kab)[0]?this.getAllKecByKab(changedValues.kab)[0]._id:undefined;
            (this.formRefKabKec.current && this.getAllKecByKab(changedValues.kab)[0])
                && this.formRefKabKec.current.setFieldsValue({ kec })
            changedValues['kec'] = kec
        }
        this.setState(changedValues, () => {
            let newData = [...this.state.data]
            newData.forEach(deskel => {
                deskel['kab'] = this.state.kab
                deskel['kec'] = this.state.kec
            })
            this.setState({ data: newData })
        })
    }
    onChangeMultiple = (changes) => {
        let newData = [...this.state.data]
        for (let [row, column, oldValue, newValue] of changes) {
            if (!newData[row]) newData[row] = {}
            newData[row][column] = newValue;
        }
        newData.forEach(deskel => {
            deskel['kab'] = this.state.kab
            deskel['kec'] = this.state.kec
        })
        this.setState({
            data: newData
        })
    }

    removeRowMultipleEdit = (rowsIndex) => {
        let newData = [...this.state.data]
        _.reverse(rowsIndex).forEach(row => {
            newData = _.filter(newData, (deskel, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanDeskel = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(deskelData => {
                deskelData.name && this.props.dispatch(simpanDeskel(this.props.socket, func.getFormVar(deskelFields, deskelData), this.props, this.props.onBack))
            })
        } else {
            this.props.dispatch(simpanDeskel(this.props.socket, func.getFormVar(deskelFields, this.state), this.props, this.props.onBack))
        }
    }
    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return /^\d{3}$/.test(this.state.data[0].kode) && this.state.data[0].name && this.state.data[0].klasifikasi
        let isValid = true;
        let isExist = false
        this.state.data.forEach((deskel, i) => {
            const { kode, name, klasifikasi, ket } = deskel;
            if (kode || name || klasifikasi || ket) {
                if (!/^\d{3}$/.test(kode) || !name || !['Desa', 'Kelurahan'].includes(klasifikasi)) isValid = false
                    else isExist = true
            }
        })
        return isValid && isExist;
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(deskelFields, this.props.activeRecord)
            : func.getFormVar(
                deskelFields,
                this.props.all_kab.length ? { kab: this.props.all_kab[0]._id, kec: this.getAllKecByKab(this.props.all_kab[0]._id)[0] ? this.getAllKecByKab(this.props.all_kab[0]._id)[0]._id : undefined } : { kab: undefined, kec: undefined }
            ))
        this.formRefKabKec.current && this.formRefKabKec.current.setFieldsValue(this.props.activeRecord ? {
            kab: func.getFormVar(deskelFields, this.props.activeRecord).kab,
            kec: func.getFormVar(deskelFields, this.props.activeRecord).kec
        } : (
                this.props.all_kab.length ? { kab: this.props.all_kab[0]._id, kec: this.getAllKecByKab(this.props.all_kab[0]._id)[0] ? this.getAllKecByKab(this.props.all_kab[0]._id)[0]._id : undefined } : { kab: undefined, kec: undefined }
            ));
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(deskelFields, this.props.activeRecord) : func.getFormVar(deskelFields, undefined, true));
    }
    formRef = React.createRef();
    formRefKabKec = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { isMultiple, all_kab, all_kec } = this.props
        const { nestedHeaders, kab, kec, name, kode, klasifikasi, autoCompleteDataSource } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Form
                            ref={this.formRefKabKec}
                            {...formItemLayout}
                            onValuesChange={(changedValues) => this.onChangeInputKabKec(changedValues)}
                            initialValues={{
                                kab: undefined, kec: undefined
                            }}
                        >
                            <Form.Item
                                label="Kabupaten"
                                name="kab"
                                rules={[
                                    {
                                        required: true
                                    },
                                ]}

                            >
                                <Select style={{ width: 200 }}>
                                    {all_kab.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Kecamatan"
                                name="kec"
                                rules={[
                                    {
                                        required: true
                                    },
                                ]}

                            >
                                <Select style={{ width: 250 }}>
                                    {all_kec.filter(kec => kab === kec.kab).map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Form>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    dataSchema={{ kab: null, kec: null, kode: null, name: null, klasifikasi: null, ket: null }}
                                    nestedHeaders={nestedHeaders}
                                    rowHeaders
                                    data={this.data}
                                    columns={[
                                        { data: 'kode', width: 60 },
                                        { data: 'name', width: 180 },
                                        {
                                            data: "klasifikasi",
                                            type: "dropdown",
                                            source: ["Desa", "Kelurahan"]
                                        },
                                        { data: 'ket' },
                                    ]}
                                    beforeChange={this.onChangeMultiple}
                                    beforeRemoveRow={(i, a, rowsIndex, s) => this.removeRowMultipleEdit(rowsIndex)}
                                />
                            </Col>
                        </Row> : <Form
                            ref={this.formRef}
                            {...formItemLayout}
                            onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                            initialValues={{
                                kode: undefined, name: undefined, klasifikasi: 'Desa', ket: undefined
                            }}
                        >
                                <Form.Item
                                    label="Kode"
                                    name="kode"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input 3 digit kode Desa/Kelurahan',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Kode Desa/Kelurahan"
                                        style={{ width: "30%" }}
                                        ref={this.saveInputRef}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nama"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nama Desa/Kelurahan',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nama Desa/Kelurahan"
                                        style={{ width: "70%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Klasifikasi"
                                    name="klasifikasi"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon pilih klasifikasi Desa/Kelurahan',
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio.Button value="Desa">Desa</Radio.Button>
                                        <Radio.Button value="Kelurahan">Kelurahan</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="Keterangan"
                                    name="ket"
                                >
                                    <AutoComplete
                                        allowClear
                                        options={autoCompleteDataSource}
                                        onSearch={q => this.handleAutoCSearch(q, 'ket', 'Deskel')}
                                        style={{ width: "100%" }}
                                    >
                                        <TextArea
                                            placeholder="Keterangan"
                                            style={{ height: 50 }}
                                        />
                                    </AutoComplete>
                                </Form.Item>
                            </Form>}
                        <Row>
                            <Col xs={24} md={24}>
                                <Space>
                                    <Button type="primary" disabled={!(!isMultiple && (/^\d{3}$/.test(kode) && kab && kec && klasifikasi && name)) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanDeskel}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}