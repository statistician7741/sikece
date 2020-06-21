import { Row, Col, Input, Space, Button, Form, Select } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import kecFields from '../../../../fields/kec.fields'
import { simpanKec } from "../../../../redux/actions/master.action"
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

export default class LihatTabel_Tabel extends React.Component {
    state = {
        ...func.getFormVar(kecFields, null, true),
        nestedHeaders: [
            ['Kode', 'Nama Kecamatan', 'Keterangan'],
            ['(1)', '(2)', '(3)']
        ],
        data: [],
        kab: undefined,
        kode: undefined,
        name: undefined,
    }

    get data() {
        return this.state.data
    }
    onChangeInput = (changedValues) => {
        this.setState(changedValues);
    }
    onChangeInputKab = ({ kab }) => {
        let newData = [...this.state.data]
        newData.forEach(row => row['kab'] = kab)
        this.setState({ kab, data: newData })
    }
    onChangeMultiple = (changes) => {
        let newData = [...this.state.data]
        for (let [row, column, oldValue, newValue] of changes) {
            if (!newData[row]) newData[row] = {}
            newData[row][column] = newValue;
        }
        newData.forEach(kec => {
            kec['kab'] = this.state.kab
        })
        this.setState({
            data: newData
        })
    }

    removeRowMultipleEdit = (rowsIndex) => {
        let newData = [...this.state.data]
        _.reverse(rowsIndex).forEach(row => {
            newData = _.filter(newData, (kec, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanKec = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(kecData => {
                kecData.name && this.props.dispatch(simpanKec(this.props.socket, func.getFormVar(kecFields, kecData), this.props, this.props.onBack))
            })
        } else {
            this.props.dispatch(simpanKec(this.props.socket, func.getFormVar(kecFields, this.state), this.props, this.props.onBack))
        }
    }
    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return /^\d{3}$/.test(this.state.data[0].kode) && this.state.data[0].name
        let isValid = true;
        this.state.data.forEach((kec, i) => {
            const { kode, name, ket } = kec;
            if (kode || name || ket) {
                if (!/^\d{3}$/.test(kode) || !name) isValid = false
            }
        })
        return isValid;
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(kecFields, this.props.activeRecord) : func.getFormVar(kecFields, { kab: this.props.all_kab.length ? this.props.all_kab[0]._id : undefined }))
        this.formRefKab.current && this.formRefKab.current.setFieldsValue({ kab: this.props.activeRecord ? func.getFormVar(kecFields, this.props.activeRecord).kab : this.props.all_kab.length ? this.props.all_kab[0]._id : undefined });
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(kecFields, this.props.activeRecord) : func.getFormVar(kecFields, undefined, true));
    }
    formRef = React.createRef();
    formRefKab = React.createRef();
    saveInputRef = input => this.input = input
    render() {
        const { isMultiple, all_kab } = this.props
        const { nestedHeaders, kab, name, kode } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Form
                            ref={this.formRefKab}
                            {...formItemLayout}
                            onValuesChange={(changedValues) => this.onChangeInputKab(changedValues)}
                            initialValues={{
                                kab: all_kab.length ? all_kab[0]._id : undefined
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
                        </Form>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    dataSchema={{ kab: null, kode: null, name: null, ket: null }}
                                    nestedHeaders={nestedHeaders}
                                    rowHeaders
                                    data={this.data}
                                    columns={[
                                        { data: 'kode', width: 60 },
                                        { data: 'name', width: 180 },
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
                                _id: undefined, kode: undefined, name: undefined, ket: undefined
                            }}
                        >
                                <Form.Item
                                    label="Kode"
                                    name="kode"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input 3 digit kode Kecamatan',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Kode Kecamatan"
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
                                            message: 'Mohon input nama Kecamatan',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nama Kecamatan"
                                        style={{ width: "70%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Keterangan"
                                    name="ket"
                                >
                                    <TextArea
                                        style={{ height: 50 }}
                                        allowClear
                                        placeholder="Keterangan"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Form>}
                        <Row>
                            <Col xs={24} md={24}>
                                <Space>
                                    <Button type="primary" disabled={!(!isMultiple && (/^\d{3}$/.test(kode) && kab && name)) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanKec}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}