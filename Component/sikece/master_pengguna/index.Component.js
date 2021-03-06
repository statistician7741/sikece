import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';
import { getKec, getTable, getKab } from "../../../redux/actions/master.action"

const LihatUser = dynamic(() => import("./LihatUser.Component"));
const EditorUser = dynamic(() => import("./EditorUser.Component"));

export default class IndexMasterPengguna extends React.Component {
    state = {
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        years: []
    }
    onClickTambah = () => this.setState({ activePage: 'edit', activeEditingtitle: `Tambah Pengguna`, activeRecord: undefined })
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ activePage: 'edit', activeEditingtitle, activeRecord })
    }
    getAllYearsBab = (props) => {
        props.socket.emit('api.master_tabel.bab/getAllYearsBab', (response) => {
            if (response.type === 'ok') {
                this.setState({ years: response.data })
            } else {
                props.showErrorMessage(response.additionalMsg)
            }
        })
    }
    onBack = () => this.setState({ activePage: 'list' })
    componentDidMount() {
        if (this.props.socket) {
            this.getAllYearsBab(this.props)
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
            this.props.dispatch(getKec(this.props.socket))
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKab(this.props.socket))
        }
    }

    render() {
        const { activePage, activeEditingtitle, activeRecord, years } = this.state

        return (
            <PageHeader
                className="site-page-header"
                title="Master Pengguna"
                subTitle={activePage === 'list' ? "Daftar Pengguna" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatUser {...this.props} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} />
                    </Row> :
                    <Row>
                        <EditorUser {...this.props} years={years} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}