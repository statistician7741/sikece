import { Row, Col, Input, AutoComplete, Upload, Space, Button, Form, Checkbox, Tooltip, Alert } from 'antd';
const { TextArea } = Input;
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Hot from '../../general/Hot.Component'
import { simpanData } from "../../../../redux/actions/master.action"
import { replaceToKecName } from "../../../../functions/basic.func"
import axios from 'axios'
import _ from 'lodash'
import { getKec } from "../../../../redux/actions/master.action"
import XLSX from 'xlsx'

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
        needFenomena: undefined,
        needFenomenaQ: undefined,
        all_data: [],
        activeKec: undefined,
        fileList: [],
        fileListXlsx: [],
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
                const { sumber, catatan, ket, all_data, activeKec: { _id: _idKec, kab: _idKab }, needFenomena, needFenomenaQ } = this.state
                const { activeRecord: { _id: _idTable } } = this.props
                this.props.dispatch(simpanData(this.props.socket, {
                    _idKec, _idKab, _idTable, sumber, catatan, ket, all_data, fileToKeep, fileToDelete, needFenomena, needFenomenaQ
                }, this.props, () => {
                    this.props.dispatch(getKec(this.props.socket, () => {
                        this.setState({ sending: false }, this.props.onBack)
                    }))
                }))
            });
        })
    }
    isValid = () => {
        let isValid = true;
        if (!this.state.sumber || (this.state.needFenomena && !this.state.needFenomenaQ)) {
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
            let needFenomena = false;
            let needFenomenaQ = undefined;
            if (this.props.activeData) {
                arsip = this.props.activeData.arsip
                sumberEdited = this.props.activeData.sumber
                catatanEdited = this.props.activeData.catatan
                ketEdited = this.props.activeData.ket
                needFenomena = this.props.activeData.needFenomena
                needFenomenaQ = this.props.activeData.needFenomenaQ
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
                fileList,
                needFenomena,
                needFenomenaQ
            });
            this.setState({
                nomor_tabel,
                judul: replaceToKecName(judul, activeKec),
                sumber: sumberEdited !== undefined ? sumberEdited : replaceToKecName(sumber, activeKec),
                catatan: catatanEdited !== undefined ? catatanEdited : replaceToKecName(catatan, activeKec),
                ket: ketEdited !== undefined ? ketEdited : replaceToKecName(ket, activeKec),
                activeKec,
                fileList,
                needFenomena,
                needFenomenaQ
            }, () => {
                this.setAllData(baris, this.props.kec, this.props.all_variable_obj, this.props.all_deskel)
            })
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.needFenomena !== prevState.needFenomena) {
            this.formRef.current.validateFields(['needFenomenaQ']);
        }
    }
    handleImportXlsx = (file, baris, kolom, all_variable_obj) => {
        this.setState({ fileListXlsx: file });
        this.formRef.current.setFieldsValue({
            fileListXlsx: file
        });
        let reader = new FileReader();
        reader.onload = (e) => {
            let dataXlsx = new Uint8Array(e.target.result);
            let workbook = XLSX.read(dataXlsx, { type: 'array' });
            let data = []
            let cellChar = {}
            let firstSheet = true
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet) && firstSheet) {
                    firstSheet = false
                    for (let cell in workbook.Sheets[sheet]) {
                        if (workbook.Sheets[sheet].hasOwnProperty(cell) && cell.match(/\d{1,2}$/)) {
                            let prefix = cell.match(/\d{1,2}$/)[0]
                            if (!cellChar[prefix]) cellChar[prefix] = []
                            cellChar[prefix].push(workbook.Sheets[sheet][cell].v)
                        }
                    }
                }
            }
            for (let pos in cellChar) {
                if (cellChar.hasOwnProperty(pos)) {
                    data.push(cellChar[pos])
                }
            }
            let is2Headers = this.getHeader(baris, kolom, all_variable_obj).is2
            let all_data = [...this.state.all_data.map(d => ({ ...d }))]
            data.forEach((row, i)=>{
                if(is2Headers){
                    if(i>2){
                        row.forEach((col,j)=>{
                            if(j>0){
                                if(all_data[i-3]) all_data[i-3][kolom[j-1]] = col
                            }
                        })
                    }
                } else{
                    if(i>1){
                        row.forEach((col,j)=>{
                            if(j>0){
                                if(all_data[i-2]) all_data[i-2][kolom[j-1]] = col
                            }
                        })
                    }
                }
            })
            this.setState({ all_data })
        };
        reader.readAsArrayBuffer(file);
        return false;
    }
    getHeader = (baris, kolom, all_variable_obj) => {
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
        cols[1].forEach(h => {
            if (h !== '') isRemoveRow2Header = false
        })
        return isRemoveRow2Header ? { header: [cols[0]], is2: false } : { header: cols, is2: true }
    }
    render() {
        const {
            fileList,
            fileListXlsx,
            autoCompleteDataSource,
            nomor_tabel,
            judul,
            sumber,
            catatan,
            needFenomena,
            needFenomenaQ,
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

        const propsXlsx = {
            onRemove: file => {
                this.setState({ fileListXlsx: [] });
            },
            beforeUpload: file => this.handleImportXlsx(file, baris, kolom, all_variable_obj),
            accept: ".xlsx"
        };

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
                                autoSize={{ minRows: 2, maxRows: 6 }}
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
                                autoSize={{ minRows: 2, maxRows: 6 }}
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
                                placeholder="Keterangan atau fenomena mengenai data"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label="Fenomena"
                        name="needFenomena"
                        valuePropName="checked"
                    >
                        <Checkbox>
                            <Tooltip title="Tanyakan Fenomena atau penjelasan ke penyedia data">Kirim pertanyaan</Tooltip>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        label="Pertanyaan"
                        name="needFenomenaQ"
                        rules={[
                            {
                                required: needFenomena,
                                message: 'Mohon input pertanyaan Anda ke penyedia data',
                            },
                        ]}
                    >
                        <TextArea
                            allowClear
                            disabled={!needFenomena}
                            placeholder="Pertanyaan atau keterangan ke penyedia data"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
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
                    <Form.Item
                        label="Import Data"
                        name="fileListXlsx"
                    >
                        <Upload  {...propsXlsx}>
                            <Button>
                                <UploadOutlined /> Pilih file (xlsx)
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
                                nestedHeaders={this.getHeader(baris, kolom, all_variable_obj).header}
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
                    {needFenomena ? <Row>
                        <Col xs={24} md={13}>
                            <Alert
                                message="Permintaan Penjelasan"
                                description={needFenomenaQ}
                                type="warning"
                                showIcon
                                icon={<QuestionCircleOutlined />}
                            />
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