import { Row, PageHeader, Col, Table } from "antd"
import dynamic from 'next/dynamic';
import { getKec, getTable, getKab, getBab, getVariable } from "../../../redux/actions/master.action"

const LihatEntri = dynamic(() => import("./EntriComponent/LihatEntri.Entri.Component"));
const EditorEntri = dynamic(() => import("./EntriComponent/EditorEntri.Entri.Component"));

export default class IndexEntri extends React.Component {
    state = {
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        selectedYear: new Date().getFullYear(),
        years: [],
        kab: undefined,
        kec: undefined,
        bab: 'all_bab'
    }

    onClickEntri = (activeEditingtitle) => {
        this.setState({ activePage: 'edit', activeEditingtitle })
    }
    onBack = () => this.setState({ activePage: 'list' })
    getAllYearsBab = (props) => {
        props.socket.emit('api.master_tabel.bab/getAllYearsBab', (response) => {
            if (response.type === 'ok') {
                this.setState({ years: response.data })
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
                <Row gutter={[0, 8]}>
                    <Col xs={24}>
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
                                    <Table.Summary.Cell index={0}><strong style={{ float: 'left' }}>{this.props.all_variable_obj[baris[baris.length - 1]].name}</strong></Table.Summary.Cell>
                                    {kolom.map((k, i) => <Table.Summary.Cell index={i + 1}><strong>data</strong></Table.Summary.Cell>)}
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
    onChangeDropdown = (data) => this.setState(data)
    componentDidMount() {
        if (this.props.socket) {
            !this.state.years && this.getAllYearsBab(this.props)
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_bab.length && this.props.dispatch(getBab(this.props.socket))
            !this.props.all_variable.length && this.props.dispatch(getVariable(this.props.socket))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKab(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getBab(this.props.socket))
            this.props.dispatch(getVariable(this.props.socket))
        }
        if (this.props.all_kab !== prevProps.all_kab && this.props.all_kab.length) {
            this.setState({ kab: this.props.all_kab[0]._id })
        }
        if (this.props.all_kec !== prevProps.all_kec && this.props.all_kec.length && this.state.kab) {
            this.props.all_kec.filter(kec => this.state.kab === kec.kab).length && this.setState({ kec: this.props.all_kec.filter(kec => this.state.kab === kec.kab)[0]._id })
        }
        if (this.state.kab !== prevState.kab && this.state.kab) {
            this.props.all_kec.filter(kec => this.state.kab === kec.kab).length && this.setState({ kec: this.props.all_kec.filter(kec => this.state.kab === kec.kab)[0]._id })
        }
    }

    render() {
        const { activePage, activeEditingtitle, activeRecord, bab, selectedYear, years, kab, kec } = this.state
        return (
            <PageHeader
                className="site-page-header"
                title={activePage === 'list' ? "Entri Data" : `Entri Tabel ${activeEditingtitle}`}
                subTitle={activePage === 'list' ? "Daftar tabel" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
            >
                {activePage === 'list' ?
                    <Row gutter={[16, 0]}>
                        <LihatEntri {...this.props} years={years} kab={kab} kec={kec} bab={bab} selectedYear={selectedYear} onChangeDropdown={this.onChangeDropdown} onClickEntri={this.onClickEntri} getDynamicTable={this.getDynamicTable} />
                    </Row> :
                    <Row gutter={[16, 0]}>
                        <EditorEntri {...this.props} xs={24} kecData={kecData} loadDataKec={this.loadDataKec} indikators={indikators} loadDataIndikators={this.loadDataIndikators} cascaderFilter={this.cascaderFilter} />
                    </Row>}
            </PageHeader>
        )
    }
}