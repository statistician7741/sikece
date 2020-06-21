import { Row, Col, Input, Space, Button, Form } from 'antd';
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import babFields from '../../../../fields/bab.fields'
import { simpanBab } from "../../../../redux/actions/master.action"

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

export default class EditorBab_Bab extends React.Component {
    state = {
        ...func.getFormVar(babFields, null, true),
        data: [],
        nestedHeaders: [
            ['Tahun Buku', 'Nomor', 'Nama Bab', 'Keterangan'],
            ['(1)', '(2)', '(3)', '(4)']
        ]
    }
    get data() {
        return this.state.data
    }
    onChangeInput = (changedValues) => {
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

    removeRowMultipleEdit = (rowsIndex) => {
        let newData = [...this.state.data]
        _.reverse(rowsIndex).forEach(row => {
            newData = _.filter(newData, (bab, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanBab = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(babData => {
                babData.tahun_buku && this.props.dispatch(simpanBab(this.props.socket, func.getFormVar(babFields, babData), this.props, this.props.onBack))
            })
        } else {
            this.props.dispatch(simpanBab(this.props.socket, func.getFormVar(babFields, this.state), this.props, this.props.onBack))
        }
    }
    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return /^\d{4}$/.test(this.state.data[0].tahun_buku) &&  /^\d{1,2}$/.test(this.state.data[0].nomor) && this.state.data[0].name
        let isValid = true;
        this.state.data.forEach((bab, i) => {
            const { tahun_buku, name, nomor, ket } = bab;
            if (tahun_buku || nomor || name || ket) {
                if (!/^\d{4}$/.test(tahun_buku) || !/^\d{1,2}$/.test(nomor) || !name) isValid = false
            }
        })
        return isValid;
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(babFields, this.props.activeRecord) : func.getFormVar(babFields, undefined, true))
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(babFields, this.props.activeRecord) : func.getFormVar(babFields, undefined, true));
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input

    render() {
        const { isMultiple } = this.props
        const { nestedHeaders, name, tahun_buku, nomor } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    dataSchema={{ tahun_buku: null, nomor: null, name: null, ket: null }}
                                    nestedHeaders={nestedHeaders}
                                    rowHeaders
                                    data={this.data}
                                    columns={[
                                        { data: 'tahun_buku', width: 60 },
                                        { data: 'nomor', width: 60 },
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
                                _id: undefined, name: undefined, ket: undefined
                            }}
                        >
                                <Form.Item
                                    label="Tahun Buku"
                                    name="tahun_buku"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input 4 digit tahun buku',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Tahun buku"
                                        style={{ width: "35%" }}
                                        ref={this.saveInputRef}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nomor"
                                    name="nomor"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nomor bab',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Nomor bab"
                                        style={{ width: "35%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nama"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nama bab',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Nama bab"
                                        style={{ width: "35%" }}
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
                                    <Button type="primary" disabled={!(!isMultiple && (/^\d{4}$/.test(tahun_buku) && name && /^\d{1,2}$/.test(nomor))) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanBab}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}