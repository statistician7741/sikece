import { Row, Col, Input, AutoComplete, Space, Button, Table, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import InputForm from '../../general/InputForm.Component'
import Hot from '../../general/Hot.Component'
import { Fragment } from 'react';

export default class EditorBab_Bab extends React.Component {
    state = {
        nestedHeaders: [
            ['Nama', 'Satuan', 'Jenis', 'Desimal', 'Agregat', 'Grafik', 'Parent', 'Keterangan', 'Pilihan']
        ],
        data: [
            ["Laki-laki", "Jiwa", "Angka", 0, 'Jumlah', 'Bar', 'Penduduk', "-"],
            ["Perempuan", "Jiwa", "Angka", 0, 'Jumlah', 'Bar', 'Penduduk', "-"],
            ["Jumlah", "Jiwa", "Angka", 0, 'Jumlah', 'Bar', 'Penduduk', "-"],
            ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Rata-Rata', 'Pie', '-', "-"],
        ],
        subjek: [
            { _id: 1, name: "Sosial Kependudukan" },
            { _id: 1, name: "Ekonomi dan Perdagangan" },
            { _id: 1, name: "Pertanian dan Pertambangan" },
        ]
    }
    render() {
        const { xs, md } = this.props
        const { nestedHeaders, data, subjek } = this.state
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Edit Judul Kolom</strong></Col>
                        </Row>
                        <Fragment>
                            <InputForm xs={19} name='Nama Judul Kolom' isWajib={true}>
                                <AutoComplete
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{ width: 500 }}
                                    placeholder="Nama Judul Kolom"
                                    style={{ width: "100%" }}
                                >
                                    <TextArea
                                        style={{ height: 50 }}
                                    />
                                </AutoComplete>
                            </InputForm>
                            <InputForm xs={19} name='Subjek' isWajib={true}>
                                <Select
                                    defaultValue={subjek[0].name}
                                    style={{ width: 300 }}
                                    showSearch
                                    allowClear
                                >
                                    {subjek.map(s => <Option value={s.name} key={s.name}>{s.name}</Option>)}
                                </Select>
                            </InputForm>
                            <InputForm xs={19} name='Variabel' isWajib={true}>
                                <Hot
                                    nestedHeaders={nestedHeaders}
                                    data={data}
                                    columns={[
                                        {},
                                        {
                                            type: "dropdown",
                                            source: ["Jiwa", "%", "Km"]
                                        },
                                        {
                                            type: "dropdown",
                                            source: ["Angka", "Teks"]
                                        },
                                        {
                                            type: "dropdown",
                                            source: ["0", "1", "3", "4"]
                                        },
                                        {
                                            type: "dropdown",
                                            source: ["Jumlah", "Rata-rata"]
                                        },
                                        {
                                            type: "dropdown",
                                            source: ["Bar", "Pie", "Line"]
                                        },
                                        {},
                                        {},
                                    ]}
                                />
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
                            <InputForm xs={19} name='' isWajib={false}>
                                <Table
                                    size="small"
                                    bordered
                                    columns={(() => {
                                        const parents = {}
                                        const cols = []
                                        data.forEach((v, i) => {
                                            if (v[0]) {
                                                if (v[6] !== "-" && v[6] !== "") {
                                                    if (!parents[v[6]]) {
                                                        parents[v[6]] = {};
                                                        parents[v[6]].indexAnggota = [];
                                                    }
                                                    parents[v[6]].indexAnggota.push(i)
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
                                    dataSource={data.map((d, i) => ({ _id: i, data: 'data' }))}
                                    pagination={false}
                                    rowKey="_id"
                                />
                            </InputForm>
                        </Fragment>
                        <Row>
                            <Col xs={24} md={24}>
                                <Space>
                                    <Button type="primary">Simpan</Button>
                                    <Button>Batal</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}