import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';

const LihatSatuan = dynamic(() => import("./SatuanComponent/LihatSatuan.Satuan.Component"));
const EditorSatuan = dynamic(() => import("./SatuanComponent/EditorSatuan.Satuan.Component"));

export default class Satuan extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Bab ${isMultiple ? '(Multiple)' : ''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord } = this.state
        const { all_satuan } = this.props
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Subjek" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatSatuan {...this.props} all_satuan={all_satuan} onClickTambah={this.onClickTambah}  onClickEdit={this.onClickEdit} />
                    </Row> :
                    <Row>
                        <EditorSatuan {...this.props} isMultiple={isMultiple} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack}  />
                    </Row>}
            </PageHeader>
        )
    }
}