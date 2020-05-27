import { Row, Col, Input, AutoComplete, Cascader, Divider, Space, Button } from 'antd';
const { TextArea } = Input;
import BasicForm from './Lainnya/BasicForm.Tabel.Component'
import InputForm from '../../General/InputForm.Component'
import Hot from '../../General/HandsOnTableExample.component'

export default class EditorTabel_Tabel extends React.Component {
    render() {
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
                                <BasicForm kecData={kecData} loadDataKec={loadDataKec} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
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
                <InputForm xs={19} name='Nomor' isWajib={true}>
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
                <Row>
                    <Col xs={24} md={24}>
                        <Divider orientation="left" plain>Preview</Divider>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        1.1 Luas Wilayah di Kecamatan Pasarwajo (Hektar), 2019
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        <Hot />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={24}>
                        Sumber: Desa/Kelurahan
                    </Col>
                </Row>
                <Row gutter={[0,8]}>
                    <Col xs={24} md={24}>
                        Keterangan: -
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