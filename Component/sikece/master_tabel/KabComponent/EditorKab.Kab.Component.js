import { Row, Col, Input, Form, Space, Button, AutoComplete } from 'antd';
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import kabFields from '../../../../fields/kab.fields'
import _ from 'lodash'
import { simpanKab } from "../../../../redux/actions/master.action"

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
        ...func.getFormVar(kabFields, null, true),
        data: [],
        nestedHeaders: [
            ['Kode',
                'Nama',
                'Keterangan'],
            ['(1)', '(2)', '(3)']
        ],
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
    onChangeInput = (changedValues) => {
        this.setState(changedValues)
    }
    onClickSimpanKab = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(kabData => {
                kabData._id && this.props.dispatch(simpanKab(this.props.socket, func.getFormVar(kabFields, kabData), this.props, this.props.onBack))
            })
        } else {
            this.props.dispatch(simpanKab(this.props.socket, func.getFormVar(kabFields, this.state), this.props, this.props.onBack))
        }
    }

    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return /\d{4}/.test(this.state.data[0]._id) && this.state.data[0].name
        let isValid = true;
        this.state.data.forEach((kab, i) => {
            const { _id, name, ket } = kab;
            if (_id || name || ket) {
                if (!/\d{4}/.test(_id) || !name) isValid = false
            }
        })
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
            newData = _.filter(newData, (kab, i) => (row !== i))
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
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(kabFields, this.props.activeRecord) : func.getFormVar(kabFields, undefined, true))
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(kabFields, this.props.activeRecord) : func.getFormVar(kabFields, undefined, true));
    }

    formRef = React.createRef();
    saveInputRef = input => this.input = input

    render() {
        const { isMultiple } = this.props
        const { nestedHeaders, _id, name, autoCompleteDataSource } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    dataSchema={{ _id: null, name: null, ket: null }}
                                    nestedHeaders={nestedHeaders}
                                    rowHeaders
                                    data={this.data}
                                    columns={[
                                        { data: '_id', width: 60 },
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
                                    label="Kode"
                                    name="_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input 4 digit kode Kabupaten',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Kode"
                                        style={{ width: "30%" }}
                                        ref={this.saveInputRef}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nama Kabupaten"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nama Kabupaten',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nama Kabupaten"
                                        style={{ width: "70%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Keterangan"
                                    name="ket"
                                >
                                    <AutoComplete
                                        allowClear
                                        options={autoCompleteDataSource}
                                        onSearch={q => this.handleAutoCSearch(q, 'ket', 'Kab')}
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
                                    <Button type="primary" disabled={!(!isMultiple && (/^\d{4}$/.test(_id) && name)) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanKab}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}