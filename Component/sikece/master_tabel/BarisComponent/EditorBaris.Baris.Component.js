import { Row, Col, Input, AutoComplete, Space, Button, Select, Table } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import InputForm from '../../general/InputForm.Component'
import Hot from '../../general/Hot.Component'
import { Fragment } from 'react';
import dynamic from 'next/dynamic';
const Handsontable = dynamic(() => import('handsontable'), {
    ssr: false
})

export default class EditorBaris_Baris extends React.Component {
    state = {
        nestedHeaders: [
            ['Nama', 'Keterangan', 'Pilihan']
        ],
        data: [
            ["Ibukota", "-"],
            ["Jumlah Kelurahan", "-"],
            ["Jumlah Desa", "-"],
            ["Jumlah Dusun", "-"],
            ["Jumlah Lingkungan", "-"],
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
                            <Col xs={24}><strong>Edit Judul Baris</strong></Col>
                        </Row>
                        <Fragment>
                            <InputForm xs={19} name='Nama Judul Baris' isWajib={true}>
                                <AutoComplete
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{ width: 500 }}
                                    placeholder="Nama Judul Baris"
                                    style={{ width: "100%" }}
                                >
                                    <TextArea
                                        style={{ height: 50 }}
                                    />
                                </AutoComplete>
                                <Input
                                    placeholder="Alias"
                                    style={{ width: "50%", marginTop: 5 }}
                                />
                            </InputForm>
                            <InputForm xs={19} name='Subjek' isWajib={true}>
                                <Select
                                    defaultValue={subjek[0].name}
                                    style={{ width: 300 }}
                                    showSearch
                                    allowClear
                                >
                                    {subjek.map(s => <Option key={s.name} value={s.name}>{s.name}</Option>)}
                                </Select>
                            </InputForm>
                            <InputForm xs={19} name='Variabel' isWajib={true}>
                                <Hot
                                    nestedHeaders={nestedHeaders}
                                    data={data}
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
                                    columns={[{
                                        title: 'Alias',
                                        dataIndex: "baris"
                                    },{
                                        title: 'Kolom1',
                                        dataIndex: "data"
                                    },{
                                        title: 'Kolom2',
                                        dataIndex: "data"
                                    }]}
                                    dataSource={data.map((d, i) => ({ _id: i, baris: d[0], data: 'data' }))}
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