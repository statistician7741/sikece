import { Row, Tabs, PageHeader } from "antd"
import dynamic from 'next/dynamic';
const { TabPane } = Tabs;

const LihatKab = dynamic(() => import("./KabComponent/LihatKab.Kab.Component"));
const EditorKab = dynamic(() => import("./KabComponent/EditorKab.Kab.Component"));

export default class Kabupaten extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        kabData: [{
            _id: '7401',
            name: 'Buton',
            ket: 'Kabupaten pertama di Buton, didirikan tahun 1980'
        }, {
            _id: '7414',
            name: 'Buton Tengah',
            ket: '-'
        }, {
            _id: '7415',
            name: 'Buton Selatan',
            ket: 'Kabupaten pertama di Buton, didirikan tahun 1980. Kabupaten ini baru dimekarkan.'
        },]
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Kabupaten ${isMultiple?'(Multiple)':''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord, kabData } = this.state
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