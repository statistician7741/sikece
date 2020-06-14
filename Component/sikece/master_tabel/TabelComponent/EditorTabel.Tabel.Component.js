import { Row, Col, Input, AutoComplete, Cascader, Space, Button, Table, Radio } from 'antd';
const { TextArea } = Input;
import BasicForm from './Lainnya/BasicForm.Tabel.Component'
import InputForm from '../../general/InputForm.Component'

export default class EditorTabel_Tabel extends React.Component {
    state = {
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
        const { dataIndikators, data } = this.state
        const { xs, md, kecData, indikators } = this.props
        const { loadDataKec, loadDataIndikators, cascaderFilter } = this.props
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={24}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Editor Tabel</strong></Col>
                        </Row>
                        <Row>
                            <Col xs={24}>
                                <BasicForm kecData={kecData} loadDataKec={loadDataKec} defaultValue="I" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <InputForm xs={19} name='Nomor tabel' isWajib={true}>
                    <Input
                        placeholder="Nomor tabel"
                        style={{ width: "30%" }}
                    />
                </InputForm>
                <InputForm xs={19} name='Judul' isWajib={true}>
                    <AutoComplete
                        allowClear
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        placeholder="Judul tabel"
                        style={{ width: "100%" }}
                    >
                        <TextArea
                            style={{ height: 70 }}
                        />
                    </AutoComplete>
                </InputForm>
                <InputForm xs={19} name='Sumber' isWajib={true}>
                    <AutoComplete
                        allowClear
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        placeholder="Sumber data"
                        style={{ width: "100%" }}
                    >
                        <TextArea
                            style={{ height: 50 }}
                        />
                    </AutoComplete>
                </InputForm>
                <InputForm xs={19} name='Catatan' isWajib={false}>
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
                <InputForm xs={19} name='Indikator' isWajib={true}>
                    <Cascader
                        defaultValue={['Geografi', 'Luas Wilayah menurut Desa/Kelurahan']}
                        options={indikators}
                        loadData={loadDataIndikators}
                        changeOnSelect
                        placeholder="Pilih indikator"
                        allowClear={false}
                        style={{ width: '100%' }}
                        showSearch={{ cascaderFilter }}
                    />
                </InputForm>
                <InputForm xs={19} name='Label Agregat' isWajib={false}>
                    <Radio.Group defaultValue="None">
                        <Radio.Button value="None">Tanpa agregat</Radio.Button>
                        <Radio.Button value="Nama Kecamatan">Kecamatan</Radio.Button>
                        <Radio.Button value="Jumlah">Jumlah</Radio.Button>
                        <Radio.Button value="Rata-rata">Rata-rata</Radio.Button>
                    </Radio.Group>
                </InputForm>
                <InputForm xs={19} name='Keterangan' isWajib={false}>
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
                <Row gutter={[0, 8]}>
                    <Col xs={24}><strong>Preview</strong></Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        1.1 Luas Wilayah di Kecamatan Pasarwajo (Hektar), 2019
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        <Table
                            size="small"
                            bordered
                            columns={(() => {
                                const parents = {}
                                const cols = []
                                cols.push({
                                    title: dataIndikators[0].judul_baris.name,
                                    dataIndex: "baris_var"
                                })
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
                                            cols.push({
                                                title: data[parents[parent].indexAnggota[0]][0],
                                                dataIndex: "data"
                                            })
                                        } else {
                                            const calon_col = {}
                                            calon_col.title = parent
                                            calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                title: data[indexVar][0],
                                                dataIndex: "data"
                                            }));
                                            cols.push(calon_col)
                                        }
                                    }
                                }
                                return cols
                            })()}
                            dataSource={dataIndikators[0].judul_baris.vars.map((d, i) => ({ '_id': i, 'baris_var': d, 'data': "data" }))}
                            pagination={false}
                            rowKey="_id"
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
                    <Col xs={24} md={24}>
                        <Space>
                            <Button type="primary">Buat Tabel</Button>
                            <Button>Batal</Button>
                        </Space>
                    </Col>
                </Row>
            </Col>
        )
    }
}