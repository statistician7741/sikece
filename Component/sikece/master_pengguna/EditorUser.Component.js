import { Row, Col, Input, Space, Button, Form, AutoComplete } from 'antd';
const { TextArea } = Input;
import Hot from '../general/Hot.Component'
import func from '../../../functions/basic.func'
import userFields from '../../../fields/user.fields'
import { simpanUser } from "../../../redux/actions/user.action"

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

export default class EditorUser_User extends React.Component {
    state = {
        ...func.getFormVar(userFields, null, true),
        data: [],
        nestedHeaders: [
            ['Tahun Buku', 'Nomor', 'Nama User', 'Keterangan'],
            ['(1)', '(2)', '(3)', '(4)']
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
            newData = _.filter(newData, (User, i) => (row !== i))
        })
        this.setState({
            data: newData
        })
    }

    onClickSimpanUser = () => {
        if (this.props.isMultiple) {
            this.state.data.forEach(UserData => {
                UserData.tahun_buku && this.props.dispatch(simpanUser(this.props.socket, func.getFormVar(userFields, UserData), this.props, this.props.onBack))
            })
        } else {
            this.props.dispatch(simpanUser(this.props.socket, func.getFormVar(userFields, this.state), this.props, this.props.onBack))
        }
    }
    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return /^\d{4}$/.test(this.state.data[0].tahun_buku) && /^\d{1,2}$/.test(this.state.data[0].nomor) && this.state.data[0].name
        let isValid = true;
        this.state.data.forEach((User, i) => {
            const { tahun_buku, name, nomor, ket } = User;
            if (tahun_buku || nomor || name || ket) {
                if (!/^\d{4}$/.test(tahun_buku) || !/^\d{1,2}$/.test(nomor) || !name) isValid = false
            }
        })
        return isValid;
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        this.onChangeInput(this.props.activeRecord ? func.getFormVar(userFields, this.props.activeRecord) : func.getFormVar(userFields, undefined, true))
        this.formRef.current && this.formRef.current.setFieldsValue(this.props.activeRecord ? func.getFormVar(userFields, this.props.activeRecord) : func.getFormVar(userFields, undefined, true));
    }
    formRef = React.createRef();
    saveInputRef = input => this.input = input

    render() {
        const { isMultiple } = this.props
        const { nestedHeaders, name, tahun_buku, nomor, autoCompleteDataSource } = this.state
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
                                            message: 'Mohon input nomor User',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Nomor User"
                                        style={{ width: "35%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nama"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input nama User',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder="Nama User"
                                        style={{ width: "35%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Keterangan"
                                    name="ket"
                                >
                                    <AutoComplete
                                        allowClear
                                        options={autoCompleteDataSource}
                                        onSearch={q => this.handleAutoCSearch(q, 'ket', 'User')}
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
                                    <Button type="primary" disabled={!(!isMultiple && (/^\d{4}$/.test(tahun_buku) && name && /^\d{1,2}$/.test(nomor))) && !(isMultiple && this.isMultipleEditValid())} onClick={this.onClickSimpanUser}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}