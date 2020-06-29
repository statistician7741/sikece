import { Row, Col, Input, AutoComplete, Upload, Space, Button, Form } from 'antd';
const { TextArea } = Input;
import { UploadOutlined } from '@ant-design/icons'
import Hot from '../../general/Hot.Component'
import { simpanData } from "../../../../redux/actions/master.action"
import { replaceToKecName } from "../../../../functions/basic.func"
import axios from 'axios'
import _ from 'lodash'
import { getKec } from "../../../../redux/actions/master.action"

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
        autoCompleteDataSource: [],
        sumber: undefined,
        catatan: undefined,
        ket: undefined,
        all_data: [],
        activeKec: undefined,
        fileList: [],
        sending: false,
    }
    handleSubmitFile = (cb) => {
        let fileToDelete = [];
        let fileToKeep = [];
        if (this.props.activeData) {
            fileToDelete = this.props.activeData.arsip
        }
        const formData = new FormData();
        this.state.fileList.forEach(file => {
            if (file.status === 'done') {
                fileToKeep.push(file.name)
                if (fileToDelete.length) {
                    fileToDelete = _.remove(fileToDelete, f => {
                        return f !== file.name
                    })
                }
            } else {
                formData.append('files[]', file)
            }
        })
        formData.append('_idTable', this.props.activeRecord._id);
        formData.append('_idKec', this.props.kec);
        formData.append('_idKab', this.props.kab);
        axios.post('/sikece/entri_data/upload', formData)
            .then((response) => {
                if (response.data === 'ok') {
                    cb(fileToKeep, fileToDelete)
                } else {
                    this.props.showErrorMessage('Gagal mengunduh file. Harap hubungi Administrasi.')
                    this.setState({ sending: false })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    onClickSimpanData = () => {
        this.setState({ sending: true }, () => {
            this.handleSubmitFile((fileToKeep, fileToDelete) => {
                const { sumber, catatan, ket, all_data, activeKec: { _id: _idKec, kab: _idKab } } = this.state
                const { activeRecord: { _id: _idTable } } = this.props
                this.props.dispatch(simpanData(this.props.socket, { _idKec, _idKab, _idTable, sumber, catatan, ket, all_data, fileToKeep, fileToDelete }, this.props, () => {
                    this.props.dispatch(getKec(this.props.socket, () => {
                        this.setState({ sending: false }, this.props.onBack)
                    }))
                }))
            });
        })
    }
    isValid = () => {
        let isValid = true;
        if (!this.state.sumber) {
            return false
        }
        let i = 0
        for (let baris_item of this.state.all_data) {
            for (let _idKolom of this.props.activeRecord.kolom) {
                if (!baris_item[_idKolom]) return false
            }
        }
        return isValid;
    }
    safeQuery = (q) => {
        if (typeof q === 'string') return q.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")
        else return q
    }
    handleAutoCSearch = (query, field, Model) => {
        const { socket } = this.props;
        let q = { query: this.safeQuery(query), field, Model }
        socket.emit('api.general.autocomplete/getFieldByText', q, ({ data }) => {
            this.setState({ autoCompleteDataSource: query ? data.map(({ value }) => ({ value: replaceToKecName(value, this.state.activeKec) })) : [] });
        })
    }
    onChangeInput = (changedValues) => !changedValues.fileList && this.setState(changedValues)
    saveInputRef = input => this.input = input
    formRef = React.createRef();
    getDataSchema = (kolom) => {
        let field = { 'baris_name': null }
        kolom.forEach(_idKolom => {
            field[_idKolom] = null
        })
        return field
    }
    setAllData = (baris, kec, all_variable_obj, all_deskel) => {
        let all_data = []
        let index = 0
        baris.forEach((_idBaris, i) => {
            if (all_variable_obj[_idBaris].name.match(/^Desa\s?\/?\s?(Kelurahan)?\s?$/)) {
                const deskel = all_deskel.filter(d => (d.kec === kec))
                if (deskel.length) {
                    deskel.forEach((d, i) => {
                        let data = {}
                        data['_idBaris'] = d._id
                        data['baris_name'] = `${d.kode} ${d.name}`
                        all_data.push(data)
                        index++
                    })
                } else {
                    let data = {}
                    data['_idBaris'] = all_variable_obj[_idBaris]._id
                    data['baris_name'] = all_variable_obj[_idBaris].name
                    all_data.push(data)
                    index++
                }
            } else {
                let data = {}
                data['_idBaris'] = all_variable_obj[_idBaris]._id
                data['baris_name'] = all_variable_obj[_idBaris].name
                all_data.push(data)
                index++
            }
        })
        if (this.props.activeData) {
            this.props.activeData.all_data && all_data.forEach((data, i) => {
                this.props.activeData.all_data.forEach(row => {
                    if (data._idBaris === row._idBaris) {
                        all_data[i] = { ...data, ...row }
                    }
                })
            })
        }
        this.setState({ all_data })
    }
    onChangeEntri = (changes) => {
        let all_data = [...this.state.all_data.map(d => ({ ...d }))]
        for (let [row, column, oldValue, newValue] of changes) {
            all_data[row][column] = newValue
        }
        this.setState({ all_data })
    }
    componentDidMount = () => {
        this.input && this.input.focus()
        if (this.props.activeRecord) {
            const { nomor_tabel, judul, baris, sumber, catatan, ket } = this.props.activeRecord
            const activeKec = this.props.all_kec_obj[this.props.kec]
            let arsip = undefined;
            let sumberEdited = undefined;
            let catatanEdited = undefined;
            let ketEdited = undefined;
            console.log(this.props.activeData);
            if (this.props.activeData) {
                arsip = this.props.activeData.arsip
                sumberEdited = this.props.activeData.sumber
                catatanEdited = this.props.activeData.catatan
                ketEdited = this.props.activeData.ket
            }
            let fileList = arsip ? arsip.map((a, i) => ({
                uid: i,
                name: a,
                status: 'done',
                url: `http://${window.location.hostname}/sikece/other/arsip/${a}`
            })) : []
            this.formRef.current && this.formRef.current.setFieldsValue({
                judul: replaceToKecName(judul, activeKec),
                nomor_tabel,
                sumber: sumberEdited !== undefined ? sumberEdited : replaceToKecName(sumber, activeKec),
                catatan: catatanEdited !== undefined ? catatanEdited : replaceToKecName(catatan, activeKec),
                ket: ketEdited !== undefined ? ketEdited : replaceToKecName(ket, activeKec),
                fileList
            });
            this.setState({
                nomor_tabel,
                judul: replaceToKecName(judul, activeKec),
                sumber: sumberEdited !== undefined ? sumberEdited : replaceToKecName(sumber, activeKec),
                catatan: catatanEdited !== undefined ? catatanEdited : replaceToKecName(catatan, activeKec),
                ket: ketEdited !== undefined ? ketEdited : replaceToKecName(ket, activeKec),
                activeKec,
                fileList
            }, () => {
                this.setAllData(baris, this.props.kec, this.props.all_variable_obj, this.props.all_deskel)
            })
        }
    }
    render() {
        const {
            fileList,
            autoCompleteDataSource,
            nomor_tabel,
            judul,
            sumber,
            catatan,
            all_data,
            sending,
            ket
        } = this.state
        const { all_variable_obj, activeRecord: { baris, kolom } } = this.props

        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
            accept: ".doc,.docx, .pdf,.xls,.xlsx,.jpg,.jpeg,.png,",
            multiple: true
        };

        // console.log('state: ', this.state);
        // console.log('props: ', this.props);

        return (
            <Col xs={24}>
                <Form
                    ref={this.formRef}
                    {...formItemLayout}
                    onValuesChange={(changedValues) => this.onChangeInput(changedValues)}
                    initialValues={{
                        _id: undefined, name: undefined, ket: undefined, view_as: 'Kolom'
                    }}
                    onFinish={this.handleSubmit}
                >
                    <Form.Item
                        label="Sumber"
                        name="sumber"
                        rules={[
                            {
                                required: true,
                                message: 'Mohon input sumber data',
                            },
                        ]}

                    >
                        <AutoComplete
                            options={autoCompleteDataSource}
                            onSearch={q => this.handleAutoCSearch(q, 'sumber', 'Table')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                allowClear
                                ref={this.saveInputRef}
                                placeholder="Sumber data"
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
                            onSearch={q => this.handleAutoCSearch(q, 'catatan', 'Table')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                placeholder="Catatan data"
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
                            onSearch={q => this.handleAutoCSearch(q, 'ket', 'Table')}
                            style={{ width: "100%" }}
                        >
                            <TextArea
                                placeholder="Keterangan/fenomena mengenai data"
                                style={{ height: 50 }}
                            />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label="Arsip"
                        name="fileList"
                    >
                        <Upload {...props}>
                            <Button>
                                <UploadOutlined /> Pilih file
                </Button>
                        </Upload>
                    </Form.Item>
                    <Row justify="center" style={{ textAlign: "center" }}>
                        <Col xs={24}>
                            <strong> Tabel {nomor_tabel}</strong>
                        </Col>
                    </Row>
                    <Row justify="center" style={{ textAlign: "center" }} gutter={[0, 16]}>
                        <Col xs={24}>
                            <strong>{judul}</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24}>
                            <Hot
                                entryContextMenu
                                dataSchema={this.getDataSchema(kolom)}
                                nestedHeaders={(() => {
                                    console.log('=================================');
                                    const parents = {}
                                    const cols = []
                                    let position = 0
                                    //add kolom baris + kolom baris pertama
                                    let judul_kelompok_baris = ''
                                    baris.forEach((_idBaris, i) => {
                                        if (all_variable_obj[_idBaris].kelompok && judul_kelompok_baris === '') judul_kelompok_baris = all_variable_obj[_idBaris].kelompok
                                    })
                                    cols.push([judul_kelompok_baris === '' ? all_variable_obj[baris[0]].name : judul_kelompok_baris])
                                    cols.push(['']) //cols[1] = ['']
                                    position++; //position = 1
                                    kolom.forEach((_idKolom, i) => {
                                        let kelompok = all_variable_obj[_idKolom].kelompok
                                        if (kelompok !== "-" && kelompok !== "" && kelompok) {
                                            if (!parents[kelompok]) {
                                                parents[kelompok] = {};
                                                parents[kelompok].indexAnggota = [];
                                            }
                                            parents[kelompok].indexAnggota.push(_idKolom)
                                        } else {
                                            if (!parents[`no_parents_${i}`]) {
                                                parents[`no_parents_${i}`] = {};
                                                parents[`no_parents_${i}`].indexAnggota = [];
                                            }
                                            parents[`no_parents_${i}`].indexAnggota.push(_idKolom)
                                        }
                                    })
                                    for (var parent in parents) {
                                        if (parents.hasOwnProperty(parent)) {
                                            if (parent.includes('no_parents')) {
                                                cols[0].push(all_variable_obj[parents[parent].indexAnggota[0]].name)
                                                position++ //position = 3
                                                cols[1].push('')
                                                console.log('no parent: ',all_variable_obj[parents[parent].indexAnggota[0]].name, cols[1]);
                                            } else {
                                                //tambahkan parent di baris pertama col
                                                cols[0].push({ 'label': parent, 'colspan': parents[parent].indexAnggota.length })
                                                position++; //position = 2
                                                //buat row judul kolom utk child
                                                parents[parent].indexAnggota.forEach(_idKolom => cols[1].push(all_variable_obj[_idKolom].name))
                                            }
                                        }
                                    }
                                    let isRemoveRow2Header = true;
                                    cols[1].forEach(h=>{
                                        if(h !== '') isRemoveRow2Header = false
                                    })
                                    return isRemoveRow2Header?[cols[0]]:cols
                                })()}
                                columns={(() => {
                                    let cols = [{ 'data': 'baris_name', readOnly: true }]
                                    kolom.forEach((_idKolom, i) => {
                                        cols.push({ 'data': _idKolom, className: "htRight" })
                                    })
                                    return cols
                                })()}
                                data={all_data}
                                beforeChange={this.onChangeEntri}
                                noSpare
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24}>
                            Sumber: {sumber}
                        </Col>
                    </Row>
                    {catatan ? <Row>
                        <Col xs={24} md={24}>
                            {`Catatan: ${catatan}`}
                        </Col>
                    </Row> : null}
                    {ket ? <Row>
                        <Col xs={24} md={24}>
                            {`Keterangan: ${ket}`}
                        </Col>
                    </Row> : null}
                    <Row style={{ marginTop: 16 }}>
                        <Col xs={24} md={24}>
                            <Space>
                                <Button type="primary" loading={sending} disabled={!this.isValid()} onClick={this.onClickSimpanData}>Simpan</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Col>
        )
    }
}