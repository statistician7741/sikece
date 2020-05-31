import { Row, Col, Input, AutoComplete, Space, Button, Select, Radio } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import InputForm from '../../general/InputForm.Component'
import Hot from '../../general/Hot.Component'
import { Fragment } from 'react';

export default class EditorBab_Bab extends React.Component {
    state = {
        nestedHeaders: [
            ['Tahun Buku','Kode', 'Bab', 'Keterangan'],
            ['(1)', '(2)', '(3)','(4)']
        ],
        data: [
            ["2020", "1", "Geografi", "-"],
            ["2020", "2", "Pemerintahan", "-"],
            ["2020", "3", "Penduduk", "-"],
        ]
    }
    render() {
        const { xs, md, isMultiple, kabData, kecData } = this.props
        const { nestedHeaders, data } = this.state
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Edit Bab ({isMultiple ? 'Multi' : 'Single'})</strong></Col>
                        </Row>
                        {isMultiple ? <Row gutter={[0, 16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    nestedHeaders={nestedHeaders}
                                    data={data}
                                />
                            </Col>
                        </Row> : <Fragment>
                                <InputForm xs={19} name='Tahun Buku' isWajib={true}>
                                    <Input
                                        placeholder="Tahun buku"
                                        style={{ width: "35%" }}
                                    />
                                </InputForm>
                                <InputForm xs={19} name='Nomor' isWajib={true}>
                                    <Input
                                        placeholder="Nomor Bab"
                                        style={{ width: "35%" }}
                                    />
                                </InputForm>
                                <InputForm xs={19} name='Bab' isWajib={true}>
                                    <Input
                                        placeholder="Nama Bab"
                                        style={{ width: "70%" }}
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