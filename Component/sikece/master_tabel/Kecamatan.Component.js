import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';

const LihatKec = dynamic(() => import("./KecComponent/LihatKec.Kec.Component"));
const EditorKec = dynamic(() => import("./KecComponent/EditorKec.Kec.Component"));

export default class Kecamatan extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        kab: 'all_kab'
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Kecamatan ${isMultiple ? '(Multiple)' : ''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }
    onChangeKabDropdown=(kab)=>this.setState({kab})

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord, kab } = this.state
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Kecamatan" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatKec {...this.props} kab={kab} onChangeKabDropdown={this.onChangeKabDropdown} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} />
                    </Row> :
                    <Row>
                        <EditorKec {...this.props} isMultiple={isMultiple} onChangeKabDropdown={this.onChangeKabDropdown} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}