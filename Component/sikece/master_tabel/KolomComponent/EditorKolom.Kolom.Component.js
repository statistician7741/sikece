import { Row, Col, Input, Form, Space, Button, Select, Table, Radio } from 'antd';
const { TextArea } = Input;
import Hot from '../../general/Hot.Component'
import func from '../../../../functions/basic.func'
import variableFields from '../../../../fields/variable.fields'
import _ from 'lodash'
import { simpanVariable } from "../../../../redux/actions/master.action"

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

export default class EditorVariabel_Variabel extends React.Component {
    state = {
        ...func.getFormVar(variableFields, null, true),
        nestedHeaders: [
            ['Nama', 'Kelompok', 'Satuan', 'Jenis', 'Desimal', 'Agregat', 'Grafik'],
            ['(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)']
        ],
        data: [],
        view_as: 'Kolom'
    }
    onChangeInput = (changedValues) => {
        this.setState(changedValues)
    }
    onClickSimpanVariable = () => {
        let newData = [...this.state.data]
        newData.forEach(deskel => {
            if (deskel.name) {
                deskel['subject'] = this.state.subject
                deskel['ket'] = this.state.ket
            }
        })
        this.setState({
            data: newData
        }, () => {
            this.state.data.forEach(variableData => {
                (variableData.name && variableData.subject) && this.props.dispatch(simpanVariable(this.props.socket, func.getFormVar(variableFields, variableData), this.props, this.props.onBack))
            })
        })
    }

    isMultipleEditValid = () => {
        if (this.state.data.length < 1) return false
        if (this.state.data.length === 1) return this.state.data[0].name && this.state.subject
        let isValid = true;
        this.state.data.forEach((variable, i) => {
            const { name, kelompok, satuan, jenis, desimal, jenis_agregat, jenis_grafik } = variable;
            if (name || kelompok || satuan || jenis || desimal || jenis_agregat || jenis_grafik) {
                if (!name || !this.state.subject) isValid = false
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
            newData = _.filter(newData, (variable, i) => (row !== i))
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
        if (this.props.activeRecord.length) {
            this.formRef.current && this.formRef.current.setFieldsValue({
                subject: this.props.activeRecord[0].subject,
                ket: this.props.activeRecord[0].ket,
            });
            let newData = [...this.props.activeRecord]
            this.setState({ data: newData, subject: newData[0].subject, ket: newData[0].ket })
        }
    }

    saveInputRef = input => this.input = input
    formRef = React.createRef();

    render() {
        const { all_subject, all_satuan } = this.props
        const { nestedHeaders, data, view_as } = this.state
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Form
                            ref={this.formRef}
                            {...formItemLayout}
                            onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                            initialValues={{
                                _id: undefined, name: undefined, ket: undefined, view_as: 'Kolom'
                            }}
                        >
                            <Form.Item
                                label="Subjek"
                                name="subject"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mohon pilih subject',
                                    },
                                ]}
                            >
                                <Select
                                    ref={this.saveInputRef}
                                    placeholder="Pilih subject"
                                    style={{ width: 300 }}
                                    showSearch
                                    allowClear
                                >
                                    {all_subject.map(s => <Select.Option value={s.name} key={s._id}>{s.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Variable"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Hot
                                    dataSchema={{
                                        _id: null,
                                        name: null,
                                        kelompok: null,
                                        satuan: "Tidak ada",
                                        jenis: "Tidak ada",
                                        desimal: "Tidak ada",
                                        jenis_agregat: "Tidak ada",
                                        jenis_grafik: "Tidak ada",
                                    }}
                                    nestedHeaders={nestedHeaders}
                                    rowHeaders
                                    data={this.data}
                                    columns={[
                                        { data: 'name', width: 136 },
                                        { data: 'kelompok', width: 86 },
                                        {
                                            width: 86,
                                            data: 'satuan',
                                            type: "dropdown",
                                            source: ["Tidak ada", ...all_satuan.map(s => (s.name))]
                                        },
                                        {
                                            width: 86,
                                            data: 'jenis',
                                            type: "dropdown",
                                            source: ["Tidak ada", "Angka", "Teks"]
                                        },
                                        {
                                            width: 86,
                                            data: 'desimal',
                                            type: "dropdown",
                                            source: ["Tidak ada", "0", "1", "2", "3", "4"]
                                        },
                                        {
                                            width: 86,
                                            data: 'jenis_agregat',
                                            type: "dropdown",
                                            source: ["Tidak ada", "Jumlah", "Rata-rata"]
                                        },
                                        {
                                            width: 86,
                                            data: 'jenis_grafik',
                                            type: "dropdown",
                                            source: ["Tidak ada", "Bar", "Pie", "Line"]
                                        },
                                    ]}
                                    beforeChange={this.onChangeMultiple}
                                    beforeRemoveRow={(i, a, rowsIndex, s) => this.removeRowMultipleEdit(rowsIndex)}
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
                            <Form.Item
                                label="Preview"
                                name="view_as"
                            >
                                <Radio.Group>
                                    <Radio.Button value="Kolom">Kolom</Radio.Button>
                                    <Radio.Button value="Baris">Baris</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Table
                                style={{ marginBottom: 16 }}
                                size="small"
                                bordered
                                columns={(() => {
                                    if (data[0]) {
                                        if (!data[0].name) return [{
                                            title: 'Variable',
                                            dataIndex: "data"
                                        }]
                                    } else {
                                        return [{
                                            title: 'Variable',
                                            dataIndex: "data"
                                        }]
                                    }
                                    if (view_as === 'Baris') {
                                        let nama_kelompok_baris = 'Kelompok Baris'
                                        data.forEach((v, i) => {
                                            if (v.kelompok) nama_kelompok_baris = v.kelompok
                                        })
                                        return [{
                                            title: nama_kelompok_baris,
                                            dataIndex: "baris"
                                        }, {
                                            title: 'Contoh Kolom',
                                            children: [{
                                                title: 'Kolom 1',
                                                dataIndex: "data"
                                            }, {
                                                title: 'Kolom 2',
                                                dataIndex: "data"
                                            }]
                                        }]
                                    }
                                    const parents = {}
                                    const cols = []
                                    data.forEach((v, i) => {
                                        //apakah nama ada
                                        if (v.name) {
                                            //apakah ada kelompok
                                            if (v.kelompok !== "-" && v.kelompok !== "" && v.kelompok) {
                                                if (!parents[v.kelompok]) {
                                                    parents[v.kelompok] = {};
                                                    parents[v.kelompok].indexAnggota = [];
                                                }
                                                parents[v.kelompok].indexAnggota.push(i)
                                            } else {
                                                if (!parents[`no_parents_${i}`]) {
                                                    parents[`no_parents_${i}`] = {};
                                                    parents[`no_parents_${i}`].indexAnggota = [];
                                                }
                                                parents[`no_parents_${i}`].indexAnggota.push(i)
                                            }
                                        }
                                    })
                                    for (var parent in parents) {
                                        if (parents.hasOwnProperty(parent)) {
                                            if (parent.includes('no_parents')) {
                                                cols.push({
                                                    title: data[parents[parent].indexAnggota[0]].name,
                                                    dataIndex: "data"
                                                })
                                            } else {
                                                const calon_col = {}
                                                calon_col.title = parent
                                                calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                    title: data[indexVar].name,
                                                    dataIndex: "data"
                                                }));
                                                cols.push(calon_col)
                                            }
                                        }
                                    }
                                    return cols
                                })()}
                                dataSource={data.filter(d => (d.name)).map((d, i) => ({ _id: i, baris: d.name, data: 'data' }))}
                                pagination={false}
                                rowKey="_id"
                            />
                        </Form>
                        <Row>
                            <Col xs={24} md={24}>
                                <Space>
                                    <Button type="primary" disabled={!this.isMultipleEditValid()} onClick={this.onClickSimpanVariable}>Simpan</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}