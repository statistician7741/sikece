import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';

const LihatSubjek = dynamic(() => import("./SubjekComponent/LihatSubjek.Subjek.Component"));
const EditorSubjek = dynamic(() => import("./SubjekComponent/EditorSubjek.Subjek.Component"));

export default class Subjek extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Subjek ${isMultiple ? '(Multiple)' : ''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord } = this.state
        const { all_subject } = this.props
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Subjek" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatSubjek {...this.props} all_subject={all_subject} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} />
                    </Row> :
                    <Row>
                        <EditorSubjek {...this.props} isMultiple={isMultiple} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}