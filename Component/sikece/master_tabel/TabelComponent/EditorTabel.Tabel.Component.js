import { Row, Col, Input, AutoComplete, Cascader } from 'antd';
const { TextArea } = Input;
import BasicForm from './BasicForm.Tabel.Component'
import InputForm from './InputForm.Tabel.Component'

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
                        placeholder="nomor tabel"
                        style={{ width: "30%" }}
                    />
                </InputForm>
                <InputForm xs={19} name='Judul' isWajib={true}>
                    <AutoComplete
                        allowClear
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        placeholder="judul tabel"
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
                        placeholder="sumber data"
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
            </Col>
        )
    }
}