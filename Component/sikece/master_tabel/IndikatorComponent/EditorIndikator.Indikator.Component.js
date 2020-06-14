import { Row, Col, Input, AutoComplete, Space, Button, Table, Select } from 'antd';
const { TextArea } = Input;
const { Option, OptGroup } = Select;
import InputForm from '../../general/InputForm.Component'
import Hot from '../../general/Hot.Component'
import { Fragment } from 'react';

export default class EditorIndikator_Indikator extends React.Component {
    state = {
        nestedHeaders: [
            ['Nama', 'Satuan', 'Jenis', 'Desimal', 'Grafik', 'Parent', 'Keterangan', 'Pilihan']
        ],
        data: [
            ["Laki-laki", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
            ["Perempuan", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
            ["Jumlah", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
            ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Pie', '-', "-"],
        ]
    }
    render() {
        const { xs, md, dataIndikators } = this.props
        console.log(this.props);
        const { nestedHeaders, data } = this.state
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Edit Indikator</strong></Col>
                        </Row>
                        <Fragment>
                            <InputForm xs={19} name='Nama Indikator' isWajib={true}>
                                <AutoComplete
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{ width: 500 }}
                                    placeholder="Nama Indikator"
                                    style={{ width: "100%" }}
                                >
                                    <TextArea
                                        style={{ height: 50 }}
                                    />
                                </AutoComplete>
                            </InputForm>
                            <InputForm xs={19} name='Judul Baris' isWajib={true}>
                                <Select
                                    defaultValue="1"
                                    style={{ width: 200 }}
                                    showSearch
                                    allowClear
                                >
                                    <OptGroup label="Sosial Kependudukan">
                                        <Option value="1" key="1">Desa/Kelurahan</Option>
                                        <Option value="2" key="2">Bulan</Option>
                                        <Option value="3" key="3">Detail Kecamatan</Option>
                                    </OptGroup>
                                    <OptGroup label="Ekonomi dan Perdagangan">
                                        <Option value="4">Kategori PDRB</Option>
                                    </OptGroup>
                                </Select>
                            </InputForm>
                            <InputForm xs={19} name='Judul Kolom' isWajib={true}>
                                <Select mode="tags" style={{ width: '100%' }} placeholder="Judul Kolom" allowClear defaultValue="1">
                                    <OptGroup label="Sosial Kependudukan">
                                        <Option value="1" key="1">Jumlah penduduk</Option>
                                        <Option value="2" key="2">Kematian</Option>
                                        <Option value="3" key="3">Kelahiran</Option>
                                    </OptGroup>
                                    <OptGroup label="Ekonomi dan Perdagangan">
                                        <Option value="4" key="4">Pendapatan</Option>
                                    </OptGroup>
                                </Select>
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