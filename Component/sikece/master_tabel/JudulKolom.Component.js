import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';
import { getSubject, getSatuan, getVariable } from "../../../redux/actions/master.action"

const LihatKolom = dynamic(() => import("./KolomComponent/LihatKolom.Kolom.Component"));
const EditorKolom = dynamic(() => import("./KolomComponent/EditorKolom.Kolom.Component"));

export default class Kolom extends React.Component {
    state = {
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: [],
        selectedRowKeys: []
    }
    setActiveRecord = (activeRecord, selectedRowKeys)=>this.setState({activeRecord, selectedRowKeys})
    onClickTambah = () => {
        this.setState({ activePage: 'edit', activeEditingtitle: `Tambah Variabel`, activeRecord: [] })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ activePage: 'edit', activeEditingtitle, ...(activeRecord?{activeRecord: [activeRecord]}:{}) })
    }

    onBack = () => this.setState({ activePage: 'list', activeRecord: [], selectedRowKeys: [] })

    componentDidMount() {
        if (this.props.socket) {
            !this.props.all_subject.length && this.props.dispatch(getSubject(this.props.socket))
            !this.props.all_satuan.length && this.props.dispatch(getSatuan(this.props.socket))
            !this.props.all_variable.length && this.props.dispatch(getVariable(this.props.socket))
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getSubject(this.props.socket))
            this.props.dispatch(getSatuan(this.props.socket))
            this.props.dispatch(getVariable(this.props.socket))
        }
    }

    render() {
        const { activePage, activeEditingtitle, activeRecord, selectedRowKeys } = this.state
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Variabel" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatKolom {...this.props} setActiveRecord={this.setActiveRecord} activeRecord={activeRecord} selectedRowKeys={selectedRowKeys} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} />
                    </Row> :
                    <Row>
                        <EditorKolom {...this.props} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}