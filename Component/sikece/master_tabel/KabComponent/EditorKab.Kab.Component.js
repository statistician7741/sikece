import { Row, Col, Input, AutoComplete, Space, Button } from 'antd';
const { TextArea } = Input;
import InputForm from '../../General/InputForm.Component'
import Hot from '../../General/Hot.Component'
import { Fragment } from 'react';

export default class LihatTabel_Tabel extends React.Component {
    state = {
        nestedHeaders: [
            ['Kode',
                'Kabupaten',
                'Keterangan'],
            ['(1)', '(2)', '(3)']
        ],
        data: [
            ["7401", "Buton", "Kabupaten pertama di Buton, didirikan tahun 1980"]
        ]
    }
    render() {
        const { xs, md, isMultiple } = this.props
        const { nestedHeaders, data } = this.state
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={24}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Edit Kabupaten ({isMultiple?'Multi':'Single'})</strong></Col>
                        </Row>
                        {isMultiple ? <Row gutter={[0,16]}>
                            <Col xs={24} md={24}>
                                <Hot
                                    nestedHeaders={nestedHeaders}
                                    data={data}
                                />
                            </Col>
                        </Row> : <Fragment>
                                <InputForm xs={19} name='Kode' isWajib={true}>
                                    <Input
                                        placeholder="Kode"
                                        style={{ width: "30%" }}
                                    />
                                </InputForm>
                                <InputForm xs={19} name='Kabupaten' isWajib={true}>
                                    <Input
                                        placeholder="Kabupaten"
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