import { Row, Col, Input, Space, Button, Form, AutoComplete } from 'antd';
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import satuanFields from '../../../../fields/satuan.fields'
import { simpanSatuan } from "../../../../redux/actions/master.action"
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

export default class EditorSatuan_Satuan extends React.Component {
    state = {
        ...func.getFormVar(satuanFields, null, true),
        nestedHeaders: [
            ['Satuan', 'Keterangan'],
            ['(1)', '(2)']
        ],
        data: [],
        name: undefined,
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
            newData = _.filter(newData, (satuan, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanSatuan = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(satuanData => {
                satuanData.name && this.props.dispatch(simpanSatuan(this.props.socket, func.getFormVar(satuanFields, satuanData), this.props, this.props.onBack))
            })
        } else {
            console.log(func.getFormVar(satuanFields, this.state));
            this.props.dispatch(simpanSatuan(this.props.socket, func.getFormVar(satuanFields, this.state), this.props, this.props.onBack))
        }
    }
    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return this.state.data[0].name
        let isValid = true;
        this.state.data.forEach((satuan, i) => {
            const { name, ket } = satuan;
            if (name || ket) {
                if (!name) isValid = false
            }
        })
        return isValid;
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(satuanFields, this.props.activeRecord) : func.getFormVar(satuanFields, undefined, true))
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(satuanFields, this.props.activeRecord) : func.getFormVar(satuanFields, undefined, true));
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input

    render() {
        const { isMultiple } = this.props
        const { nestedHeaders, name, autoCompleteDataSource } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    dataSchema={{ name: null, ket: null }}
                                    nestedHeaders={nestedHeaders}
                                    rowHeaders
                                    data={this.data}
                                    columns={[
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
                                    label="Satuan"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nama satuan',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Nama satuan"
                                        style={{ width: "50%" }}
                                        ref={this.saveInputRef}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Keterangan"
                                    name="ket"
                                >
                                    <AutoComplete
                                        allowClear
                                        options={autoCompleteDataSource}
                                        onSearch={q => this.handleAutoCSearch(q, 'ket', 'Satuan')}
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
                                    <Button type="primary" disabled={!(!isMultiple && name) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanSatuan}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}