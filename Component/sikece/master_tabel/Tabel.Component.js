import { Row, PageHeader, Table, Col } from "antd"
import dynamic from 'next/dynamic';
import { Fragment } from "react";

const LihatTabel = dynamic(() => import("./TabelComponent/LihatTabel.Tabel.Component"));
const EditorTabel = dynamic(() => import("./TabelComponent/EditorTabel.Tabel.Component"));

export default class TabelComponent extends React.Component {
    state = {
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        bab: 'all_bab',
        selectedYear: new Date().getFullYear(),
        years: [],
    }
    onClickTambah = () => {
        this.setState({ activePage: 'edit', activeEditingtitle: `Tambah Tabel`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ activePage: 'edit', activeEditingtitle, activeRecord })
    }
    onChangeDropdown = (data) => this.setState(data)

    onBack = () => this.setState({ activePage: 'list' })

    getAllYearsBab = (props) => {
        props.socket.emit('api.master_tabel.bab/getAllYearsBab', (response) => {
            if (response.type === 'ok') {
                this.setState({ years: response.data, selectedYear: this.props.tahun_buku_monitoring })
            } else {
                props.showErrorMessage(response.additionalMsg)
            }
        })
    }
    getBarisDataSource = (baris) => {
        let judul_baris = [];
        baris.forEach((_id, i) => {
            if (this.props.all_variable_obj[_id].name.match(/^Desa\s?\/?\s?(Kelurahan)?\s?$/)) {
                if (this.props.all_deskel.length) {
                    let id_kec = this.props.all_deskel[0].kec
                    this.props.all_deskel.filter(d => (d.kec === id_kec)).forEach((d, i) => {
                        judul_baris.push(`${d.kode} ${d.name}`)
                    })
                } else {
                    judul_baris.push(this.props.all_variable_obj[_id].name)
                }
            } else if (this.props.all_variable_obj[_id].name.match(/^Jumlah|Total\s?$/) && i === baris.length - 1) {
                //not pushing
            } else {
                judul_baris.push(this.props.all_variable_obj[_id].name)
            }
        })
        return judul_baris.map((d, i) => ({ '_id': i, 'baris_var': d, 'data': "data" }))
    }
    getDynamicTable = (baris, kolom, nomor_tabel, judul, sumber, catatan) => {
        const { all_variable_obj, all_kec } = this.props;
        const xlPre = 5 + 3 * kolom.length
        const xxlPre = 5 + 2 * kolom.length
        const xl = xlPre < 25 ? xlPre : 24
        const xxl = xxlPre < 25 ? xxlPre : 24
        return <Row>
            <Col xs={24}>
                <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24}>
                        <strong>{`Tabel ${nomor_tabel ? nomor_tabel : '[Nomor Tabel]'}`}</strong>
                    </Col>
                </Row>
                <Row justify="center" style={{ textAlign: "center" }} gutter={[0, 16]}>
                    <Col xs={24}>
                        <strong>{judul ? judul.replace('{nama}', all_kec.length ? all_kec[0].name : 'A') : '[Judul Tabel]'}</strong>
                    </Col>
                </Row>
                <Row gutter={[0, 8]} justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24} xl={xl} xxl={xxl}>
                        {all_variable_obj !== {} && baris.length && kolom.length ? <Table
                            size="small"
                            bordered
                            columns={(() => {
                                const parents = {}
                                const cols = []
                                let judul_kelompok_baris = ''
                                baris.forEach((_idBaris, i) => {
                                    if (all_variable_obj[_idBaris].kelompok && judul_kelompok_baris === '') judul_kelompok_baris = all_variable_obj[_idBaris].kelompok
                                })
                                cols.push({
                                    title: judul_kelompok_baris === '' ? all_variable_obj[baris[0]].name : judul_kelompok_baris,
                                    dataIndex: "baris_var"
                                })
                                kolom.forEach((_idKolom, i) => {
                                    if (all_variable_obj[_idKolom].kelompok !== "-" && all_variable_obj[_idKolom].kelompok !== "" && all_variable_obj[_idKolom].kelompok) {
                                        if (!parents[all_variable_obj[_idKolom].kelompok]) {
                                            parents[all_variable_obj[_idKolom].kelompok] = {};
                                            parents[all_variable_obj[_idKolom].kelompok].indexAnggota = [];
                                        }
                                        parents[all_variable_obj[_idKolom].kelompok].indexAnggota.push(_idKolom)
                                    } else {
                                        if (!parents[`no_parents_${i}`]) {
                                            parents[`no_parents_${i}`] = {};
                                            parents[`no_parents_${i}`].indexAnggota = [];
                                        }
                                        parents[`no_parents_${i}`].indexAnggota.push(_idKolom)
                                    }
                                })
                                for (var parent in parents) {
                                    if (parents.hasOwnProperty(parent)) {
                                        if (parent.includes('no_parents')) {
                                            cols.push({
                                                title: all_variable_obj[parents[parent].indexAnggota[0]].name,
                                                dataIndex: "data",
                                                align: 'right'
                                            })
                                        } else {
                                            const calon_col = {}
                                            calon_col.title = parent
                                            calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                title: all_variable_obj[indexVar].name,
                                                dataIndex: "data",
                                                align: 'right'
                                            }));
                                            cols.push(calon_col)
                                        }
                                    }
                                }
                                return cols
                            })()}
                            dataSource={this.getBarisDataSource(baris)}
                            pagination={false}
                            rowKey="_id"
                            summary={() => (this.props.all_variable_obj[baris[baris.length - 1]].name.match(/^Jumlah|Total\s?$/) ?
                                <Table.Summary.Row style={{ background: '#fafafa', textAlign: 'right' }}>
                                    <Table.Summary.Cell index={0} key={0}><strong style={{ float: 'left' }}>{this.props.all_variable_obj[baris[baris.length - 1]].name}</strong></Table.Summary.Cell>
                                    {kolom.map((k, i) => <Table.Summary.Cell index={i + 1} key={i+1}><strong>data</strong></Table.Summary.Cell>)}
                                </Table.Summary.Row> : undefined)
                            }
                        /> : 'Belum ada Variabel'}
                    </Col>
                </Row>
                <Row gutter={[0, catatan ? 0 : 16]}>
                    <Col xs={24}>
                        Sumber: {sumber ? sumber.replace('{nama}', all_kec.length ? all_kec[0].name : 'A') : ''}
                    </Col>
                </Row>
                {catatan ? <Row gutter={[0, 16]}>
                    <Col xs={24}>
                        Catatan: {catatan.replace('{nama}', all_kec.length ? all_kec[0].name : 'A')}
                    </Col>
                </Row> : null}
            </Col>
        </Row>
    }
    componentDidMount() {
        if (this.props.socket) {
            this.getAllYearsBab(this.props)
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
        }
        if (this.state.selectedYear !== prevState.selectedYear) {
            this.onChangeDropdown({ bab: 'all_bab' })
        }
    }

    render() {
        const { activePage, activeEditingtitle, activeRecord, bab, selectedYear, years } = this.state
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Tabel" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatTabel {...this.props} years={years} bab={bab} selectedYear={selectedYear} onChangeDropdown={this.onChangeDropdown} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} getDynamicTable={this.getDynamicTable} />
                    </Row> :
                    <Row>
                        <EditorTabel {...this.props} years={years} bab={bab} selectedYear={selectedYear} onChangeDropdown={this.onChangeDropdown} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} getDynamicTable={this.getDynamicTable} />
                    </Row>}
            </PageHeader>
        )
    }
}