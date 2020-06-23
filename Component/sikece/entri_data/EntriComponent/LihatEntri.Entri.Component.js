import { Row, Col, Select } from 'antd';
const { Option } = Select
import { PlusOutlined } from '@ant-design/icons'
import BasicForm from './Lainnya/BasicForm.Tabel.Component'
import { Fragment } from 'react';
import InputForm from '../../general/InputForm.Component'

export default class LihatTabel_Tabel extends React.Component {
    render() {
        const { all_table, all_bab, all_kab, all_kec, bab, selectedYear, years, kab, kec } = this.props
        const { onClickEdit, onChangeDropdown } = this.props
        console.log(this.props);
        return (
            <Col xs={24}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={16}>
                        <InputForm xs={19} name='Tahun Buku' isWajib={false} left>
                            <Select
                                showSearch
                                style={{ width: 120 }}
                                placeholder="Tahun buku"
                                optionFilterProp="children"
                                onChange={(selectedYear) => onChangeDropdown({ selectedYear })}
                                value={selectedYear}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {years.length ? years.map(y => (<Option value={y} key={y}>{y}</Option>)) : <Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Option>}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kabupaten' isWajib={false} left>
                            <Select defaultValue={kab} value={kab} style={{ width: 200 }} onChange={kab => onChangeDropdown({kab})}>
                                {all_kab.map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Kecamatan' isWajib={false} left>
                            <Select defaultValue={kec} value={kec} style={{ width: 200 }} onChange={kec => onChangeDropdown({ kec })}>
                                {all_kec.filter(kec => kab === kec.kab).map(k => <Option value={k._id} key={k._id}>[{k._id}] {k.name}</Option>)}
                            </Select>
                        </InputForm>
                        <InputForm xs={19} name='Bab' isWajib={false} left>
                            <Select defaultValue={bab} value={bab} style={{ width: 200 }} onChange={bab => onChangeDropdown({ bab })}>
                                <Option value="all_bab" key="all_bab">Semua Bab</Option>
                                {all_bab.filter(bab => selectedYear == bab.tahun_buku).map(b => <Option value={b._id} key={b._id}>Bab {b.nomor}. {b.name}</Option>)}
                            </Select>
                        </InputForm>
                    </Col>
                </Row>
            </Col>
        )
    }
}