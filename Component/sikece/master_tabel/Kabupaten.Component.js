import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';

const LihatKab = dynamic(() => import("./KabComponent/LihatKab.Kab.Component"));
const EditorKab = dynamic(() => import("./KabComponent/EditorKab.Kab.Component"));

export default class Kabupaten extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Kabupaten ${isMultiple?'(Multiple)':''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord } = this.state
        const { all_kab } = this.props
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Kabupaten" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatKab {...this.props} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} all_kab={all_kab} />
                    </Row> :
                    <Row>
                        <EditorKab {...this.props} isMultiple={isMultiple} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}