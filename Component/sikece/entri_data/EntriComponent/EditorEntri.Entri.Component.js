import { Row, Col, Input, AutoComplete, Upload, Space, Button, Table, Popconfirm } from 'antd';
const { TextArea } = Input;
import InputForm from '../../general/InputForm.Component'
import { UploadOutlined } from '@ant-design/icons'
import Hot from '../../general/Hot.Component'

export default class EditorTabel_Tabel extends React.Component {
    state = {
        fileList: [],
        dataIndikators: [{
            _id: 1,
            name: 'Luas wilayah menurut Desa/Kelurahan',
            ket: "-",
            judul_baris: {
                _id: 'a',
                name: 'Desa/Kelurahan',
                vars: ['Holimombo Jaya', 'Kondowa', 'Dongkala', 'Holimombo', 'Takimpo', 'Kombeli', 'Awainulu']
            },
            judul_kolom: [{
                _id: 'b',
                name: 'Jumlah penduduk',
                vars: [
                    ["Laki-laki", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Perempuan", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Jumlah", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Pie', '-', "-"],
                ]
            }, {
                _id: 'c',
                name: 'Kematian',
                vars: [
                    ["Kematian", "Jiwa", "Angka", 0, 'Bar', '-', "-"],
                ]
            }, {
                _id: 'd',
                name: 'Kelahiran',
                vars: [
                    ["Kelahiran", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                ]
            }],
        }],
        data: [
            ["Laki-laki", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
            ["Perempuan", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
            ["Jumlah", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
            ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Pie', '-', "-"],
        ]
    }
    render() {
        const { dataIndikators, data, fileList } = this.state
        const { xs, md, kecData } = this.props
        const { loadDataKec } = this.props

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
        };

        return (
            <Col xs={xs} md={md}>
                <InputForm xs={6} name='Sumber' isWajib={true}>
                    <TextArea
                        style={{ height: 50 }}
                        placeholder="Sumber"
                        defaultValue="Desa/Kelurahan"
                    />
                </InputForm>
                <InputForm xs={8} name='Catatan' isWajib={false}>
                    <AutoComplete
                        allowClear
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        placeholder="Catatan"
                        style={{ width: "100%" }}
                    >
                        <TextArea
                            style={{ height: 50 }}
                        />
                    </AutoComplete>
                </InputForm>
                <InputForm xs={8} name='Keterangan' isWajib={false}>
                    <AutoComplete
                        allowClear
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        placeholder="Keterangan"
                        style={{ width: "100%" }}
                    >
                        <TextArea
                            style={{ height: 50 }}
                        />
                    </AutoComplete>
                </InputForm>
                <InputForm xs={19} name='Arsip' isWajib={false}>
                    <Upload {...props}>
                        <Button>
                            <UploadOutlined /> Pilih file
                        </Button>
                    </Upload>
                </InputForm>
                <Row>
                    <Col xs={24} md={24}>
                        Tabel 1.1 Luas Wilayah di Kecamatan Pasarwajo (Hektar), 2019
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        <Hot
                            nestedHeaders={(() => {
                                const parents = {}
                                const cols = []
                                let position = 0
                                //add kolom baris + kolom baris pertama
                                cols.push([dataIndikators[0].judul_baris.name])
                                position++; //position = 1
                                dataIndikators[0].judul_kolom[0].vars.forEach((v, i) => {
                                    if (v[5] !== "-" && v[5] !== "") {
                                        if (!parents[v[5]]) {
                                            parents[v[5]] = {};
                                            parents[v[5]].indexAnggota = [];
                                        }
                                        parents[v[5]].indexAnggota.push(i)
                                    } else {
                                        if (!parents[`no_parents_${i}`]) {
                                            parents[`no_parents_${i}`] = {};
                                            parents[`no_parents_${i}`].indexAnggota = [];
                                        }
                                        parents[`no_parents_${i}`].indexAnggota.push(i)
                                    }
                                })
                                for (var parent in parents) {
                                    if (parents.hasOwnProperty(parent)) {
                                        if (parent.includes('no_parents')) {
                                            cols[0].push(data[parents[parent].indexAnggota[0]][0])
                                            position++ //position = 3
                                            if(position>0 && cols[1]){
                                                cols[1].push('')
                                            }
                                        } else {
                                            //tambahkan parent di baris pertama col
                                            cols[0].push({'label': parent, 'colspan': parents[parent].indexAnggota.length})
                                            position++; //position = 2
                                            !cols[1]&&cols.push([])
                                            for (let i = 1; i < position; i++) {
                                                cols[1].push('')
                                            }
                                            //buat row judul kolom utk child
                                            parents[parent].indexAnggota.forEach(indexVar => cols[1].push( dataIndikators[0].judul_kolom[0].vars[indexVar][0] ))
                                        }
                                    }
                                }
                                return cols
                            })()}
                            data={(() => {
                                return dataIndikators[0].judul_baris.vars.map((d, i) => ([d, '', '', '', '']))
                                return [[1, 2, 3,4,5]]
                            })()}
                            noSpare
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        Sumber: Desa/Kelurahan
                    </Col>
                </Row>
                <Row gutter={[0, 8]}>
                    <Col xs={24} md={24}>
                        Catatan: -
                    </Col>
                </Row>
                <Row>
                    <Col xs={10}>
                        <Space>
                            <Button type="primary">Simpan</Button>
                            <Button>Batal</Button>
                        </Space>
                    </Col>
                    <Col xs={14}>
                        <Popconfirm title={`Hapus data?`}>
                            <Button type="danger">Hapus Data</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </Col>
        )
    }
}