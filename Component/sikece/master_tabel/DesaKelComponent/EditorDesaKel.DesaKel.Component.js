import { Row, Col, Input, AutoComplete, Space, Button, Select, Radio } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import InputForm from '../../general/InputForm.Component'
import Hot from '../../general/Hot.Component'
import { Fragment } from 'react';

export default class LihatTabel_Tabel extends React.Component {
    state = {
        nestedHeaders: [
            ['Kode', 'Desa/Kel', 'Klasifikasi', 'Keterangan'],
            ['(1)', '(2)', '(3)', '(4)']
        ],
        data: [
            ["001", "Holimombo Jaya", "Kelurahan", "-"]
        ]
    }
    render() {
        const { xs, md, isMultiple, kabData, kecData } = this.props
        const { nestedHeaders, data } = this.state
        const columns = [
            {},
            {},
            {
                type: "dropdown",
                source: ["Desa", "Kelurahan"]
            },
            {},
        ]
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Edit Desa/Kelurahan ({isMultiple ? 'Multi' : 'Single'})</strong></Col>
                        </Row>
                        <InputForm xs={19} name='Kabupaten' isWajib={true}>
                            <Select defaultValue={kabData[0]._id} style={{ width: 200 }}>
                                {kabData.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kecamatan' isWajib={true}>
                            <Select defaultValue={kecData[0]._id} style={{ width: 200 }}>
                                {kecData.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    nestedHeaders={nestedHeaders}
                                    data={data}
                                    columns={columns}
                                />
                            </Col>
                        </Row> : <Fragment>
                                <InputForm xs={19} name='Kode' isWajib={true}>
                                    <Input
                                        placeholder="Kode Desa"
                                        style={{ width: "35%" }}
                                    />
                                </InputForm>
                                <InputForm xs={19} name='Desa/Kel' isWajib={true}>
                                    <Input
                                        placeholder="Nama Desa/Kel"
                                        style={{ width: "70%" }}
                                    />
                                </InputForm>
                                <InputForm xs={19} name='Klasifikasi' isWajib={true}>
                                    <Radio.Group defaultValue="Desa">
                                        <Radio.Button value="Desa">Desa</Radio.Button>
                                        <Radio.Button value="Kelurahan">Kelurahan</Radio.Button>
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
                            </Fragment>}
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