import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';
import { getKec, getTable, getKab, getBab } from "../../../redux/actions/master.action"

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
    onChangeDropdown = (data) => this.setState(data)
    componentDidMount() {
        if (this.props.socket) {
            !this.state.years && this.getAllYearsBab(this.props)
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_bab.length && this.props.dispatch(getBab(this.props.socket))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKab(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getBab(this.props.socket))
        }
        if (this.props.all_kab !== prevProps.all_kab && this.props.all_kab.length) {
            this.setState({ kab: this.props.all_kab[0]._id })
        }
        if (this.props.all_kec !== prevProps.all_kec && this.props.all_kec.length && this.state.kab) {
            this.props.all_kec.filter(kec => this.state.kab === kec.kab).length&&this.setState({ kec: this.props.all_kec.filter(kec => this.state.kab === kec.kab)[0]._id })
        }
        if (this.state.kab !== prevState.kab && this.state.kab) {
            this.props.all_kec.filter(kec => this.state.kab === kec.kab).length&&this.setState({ kec: this.props.all_kec.filter(kec => this.state.kab === kec.kab)[0]._id })
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
                        <LihatEntri {...this.props} years={years} kab={kab} kec={kec} bab={bab} selectedYear={selectedYear} onChangeDropdown={this.onChangeDropdown} onClickEntri={this.onClickEntri} />
                    </Row> :
                    <Row gutter={[16, 0]}>
                        <EditorEntri {...this.props} xs={24} kecData={kecData} loadDataKec={this.loadDataKec} indikators={indikators} loadDataIndikators={this.loadDataIndikators} cascaderFilter={this.cascaderFilter} />
                    </Row>}
            </PageHeader>
        )
    }
}