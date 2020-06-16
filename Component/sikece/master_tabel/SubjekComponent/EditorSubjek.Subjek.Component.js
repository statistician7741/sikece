import { Row, Col, Input, Space, Button, Form } from 'antd';
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import subjectFields from '../../../../fields/subject.fields'
import { simpanSubject } from "../../../../redux/actions/master.action"
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

export default class EditorSubjek_Subjek extends React.Component {
    state = {
        ...func.getFormVar(subjectFields, null, true),
        nestedHeaders: [
            ['Subjek', 'Keterangan'],
            ['(1)', '(2)']
        ],
        data: [],
        name: undefined
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
            newData = _.filter(newData, (subject, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanSubject = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(subjectData => {
                subjectData.name && this.props.dispatch(simpanSubject(this.props.socket, func.getFormVar(subjectFields, subjectData), this.props))
            })
        } else {
            this.props.dispatch(simpanSubject(this.props.socket, func.getFormVar(subjectFields, this.state), this.props))
        }
    }
    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return this.state.data[0].name
        let isValid = true;
        this.state.data.forEach((subject, i) => {
            const { name, ket } = subject;
            if (name || ket) {
                if (!name) isValid = false
            }
        })
        return isValid;
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(subjectFields, this.props.activeRecord) : func.getFormVar(subjectFields, undefined, true))
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(subjectFields, this.props.activeRecord) : func.getFormVar(subjectFields, undefined, true));
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input

    render() {
        const { isMultiple } = this.props
        const { nestedHeaders, name } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    dataSchema={{ name: null, ket: null }}
                                    nestedHeaders={nestedHeaders}
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
                                    label="Subject"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nama Subject',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Nama Subject"
                                        style={{ width: "50%" }}
                                        ref={this.saveInputRef}
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
                                    <Button type="primary" disabled={!(!isMultiple && name) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanSubject}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}