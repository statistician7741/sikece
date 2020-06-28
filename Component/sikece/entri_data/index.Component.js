import { Row, PageHeader, Col, Table } from "antd"
import dynamic from 'next/dynamic';
import { LoadingOutlined } from '@ant-design/icons'
import { getKec, getTable, getKab, getBab, getVariable, getDeskel } from "../../../redux/actions/master.action"

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
        bab: 'all_bab',
        activeData: undefined,
        loadingData: false,
        expandLoading: false
    }
    setExpandLoading = (expandLoading, cb) => this.setState({ expandLoading }, cb)

    onClickEntri = (activeEditingtitle, activeRecord) => {
        this.getDataTable(this.props, this.state.kec, activeRecord, () => this.setState({ activePage: 'edit', activeEditingtitle, activeRecord }))
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
    getJumlahData = (activeData, _idKolom) => {
        if (activeData) {
            let lastBaris = activeData.all_data[activeData.all_data.length - 1]
            for (var property in lastBaris) {
                if (lastBaris.hasOwnProperty(property)) {
                    if (property === _idKolom) return lastBaris[property]
                }
            }
        } else return ''
    }
    getBarisDataSource = (baris, kec, activeData) => {
        const { all_variable_obj, all_kec_obj, all_deskel } = this.props;
        let judul_baris = [];
        baris.forEach((_id, i) => {
            if (all_variable_obj[_id].name.match(/^Desa\s?\/?\s?(Kelurahan)?\s?$/)) {
                const deskel = all_deskel.filter(d => (d.kec === kec))
                if (deskel.length) {
                    deskel.forEach((d, i) => {
                        judul_baris.push({ '_id': d._id, 'baris_var': `${d.kode} ${d.name}` })
                    })
                } else {
                    judul_baris.push({ '_id': _id, 'baris_var': all_variable_obj[_id].name })
                }
            } else if (all_variable_obj[_id].name.match(/^Jumlah|Total\s?$/) && i === baris.length - 1) {
                //not pushing
            } else {
                judul_baris.push({ '_id': _id, 'baris_var': all_variable_obj[_id].name })
            }
        })
        if (activeData) {
            activeData.all_data && judul_baris.forEach((data, i) => {
                activeData.all_data.forEach(row => {
                    if (data._id === row._idBaris) {
                        judul_baris[i] = { ...data, ...row }
                    }
                })
            })
        }
        return judul_baris
    }
    getDynamicTable = (baris, kolom, nomor_tabel, judul, sumber, catatan, kec, activeData) => {
        const { all_variable_obj, all_kec_obj } = this.props;
        let sumberA, catatanA, ketA
        let arsipA = [];
        if (activeData) {
            sumberA = activeData.sumber !== undefined ? activeData.sumber : undefined
            catatanA = activeData.catatan !== undefined ? activeData.catatan : undefined
            arsipA = activeData.arsip ? activeData.arsip : undefined
            ketA = activeData.ket !== undefined ? activeData.ket : undefined
        }
        const xlPre = 5 + 3 * kolom.length
        const xxlPre = 5 + 2 * kolom.length
        const xl = xlPre < 25 ? xlPre : 24
        const xxl = xxlPre < 25 ? xxlPre : 24
        return <Row>
            {this.state.expandLoading ? <LoadingOutlined /> : <Col xs={24}>
                <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24}>
                        <strong>{`Tabel ${nomor_tabel ? nomor_tabel : '[Nomor Tabel]'}`}</strong>
                    </Col>
                </Row>
                <Row justify="center" style={{ textAlign: "center" }} gutter={[0, 16]}>
                    <Col xs={24}>
                        <strong>{judul ? judul.replace('{nama}', all_kec_obj[kec] ? all_kec_obj[kec].name : 'A') : '[Judul Tabel]'}</strong>
                    </Col>
                </Row>
                <Row gutter={[0, 8]} justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24} xl={xl} xxl={xxl}>
                        {all_variable_obj !== {} && baris.length && kolom.length ? <Table
                            size="small"
                            bordered
                            style={{ marginBottom: 8 }}
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
                                                dataIndex: all_variable_obj[parents[parent].indexAnggota[0]]._id,
                                                align: 'right'
                                            })
                                        } else {
                                            const calon_col = {}
                                            calon_col.title = parent
                                            calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                title: all_variable_obj[indexVar].name,
                                                dataIndex: all_variable_obj[indexVar]._id,
                                                align: 'right'
                                            }));
                                            cols.push(calon_col)
                                        }
                                    }
                                }
                                return cols
                            })()}
                            dataSource={this.getBarisDataSource(baris, kec, activeData)}
                            pagination={false}
                            rowKey="_id"
                            summary={() => (this.props.all_variable_obj[baris[baris.length - 1]].name.match(/^Jumlah|Total\s?$/) ?
                                <Table.Summary.Row style={{ background: '#fafafa', textAlign: 'right' }}>
                                    <Table.Summary.Cell index={0} key={0}><strong style={{ float: 'left' }}>{this.props.all_variable_obj[baris[baris.length - 1]].name}</strong></Table.Summary.Cell>
                                    {kolom.map((k, i) => <Table.Summary.Cell index={i + 1} key={i}><strong>{this.getJumlahData(activeData, k)}</strong></Table.Summary.Cell>)}
                                </Table.Summary.Row> : undefined)
                            }
                        /> : 'Belum ada Variabel'}
                    </Col>
                </Row>
                {sumberA ? <Row gutter={[0, catatan ? 0 : 16]}>
                    <Col xs={24}>
                        <span style={{ marginLeft: 25 }}>Sumber: {sumberA}</span>
                    </Col>
                </Row> : null}
                {catatanA ? <Row>
                    <Col xs={24}>
                        <span style={{ marginLeft: 25 }}>Catatan: {catatanA}</span>
                    </Col>
                </Row> : null}
                {ketA ? <Row>
                    <Col xs={24}>
                        <span style={{ marginLeft: 25 }}>Keterangan: {ketA}</span>
                    </Col>
                </Row> : null}
                {arsipA.length ? <Row gutter={[0, catatan ? 0 : 16]}>
                    <Col xs={24}>
                        <div style={{ marginLeft: 25 }}>Arsip: {arsipA.length ? activeData.arsip.map(a => (<span key={a}><a href={`http://${window.location.hostname}/sikece/other/arsip/${a}`}>{a}</a><br /></span>)) : null}</div>
                    </Col>
                </Row> : null}
            </Col>}
        </Row>
    }
    onChangeDropdown = (data) => this.setState(data)
    getDataTable = (props, _idKec, activeRecord, cb) => {
        this.setState({ activeData: undefined, loadingData: true, activeRecord }, () => {
            let data = { _idKec, _idTable: activeRecord._id }
            props.socket.emit('api.master_tabel.kec/getDataTable', data, (response) => {
                if (response.type === 'ok') {
                    this.setState({ activeData: response.data, loadingData: false }, cb)
                } else {
                    props.showErrorMessage(response.additionalMsg)
                }
            })
        })
    }
    componentDidMount() {
        if (this.props.socket) {
            !this.state.years && this.getAllYearsBab(this.props)
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_deskel.length && this.props.dispatch(getDeskel(this.props.socket))
            !this.props.all_bab.length && this.props.dispatch(getBab(this.props.socket))
            !this.props.all_variable.length && this.props.dispatch(getVariable(this.props.socket))
            if (this.props.all_kab.length) {
                this.setState({ kab: this.props.all_kab[0]._id })
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKab(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getDeskel(this.props.socket))
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
        const { activePage, loadingData, activeEditingtitle, activeRecord, activeData, bab, selectedYear, years, kab, kec } = this.state
        return (
            <PageHeader
                className="site-page-header"
                title="Entri Data"
                subTitle={activePage === 'list' ? "Daftar tabel" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
            >
                {activePage === 'list' ?
                    <Row gutter={[16, 0]}>
                        <LihatEntri {...this.props} setExpandLoading={this.setExpandLoading} activeRecord={activeRecord} loadingData={loadingData} getDataTable={this.getDataTable} activeData={activeData} years={years} kab={kab} kec={kec} bab={bab} selectedYear={selectedYear} onChangeDropdown={this.onChangeDropdown} onClickEntri={this.onClickEntri} getDynamicTable={this.getDynamicTable} />
                    </Row> :
                    <Row gutter={[16, 0]}>
                        <EditorEntri {...this.props} getDataTable={this.getDataTable} activeData={activeData} kab={kab} kec={kec} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}