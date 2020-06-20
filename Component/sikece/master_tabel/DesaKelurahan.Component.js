import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';

const LihatDesaKel = dynamic(() => import("./DesaKelComponent/LihatDesaKel.DesaKel.Component"));
const EditorDesaKel = dynamic(() => import("./DesaKelComponent/EditorDesaKel.DesaKel.Component"));

export default class DesaKel extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        kab: 'all_kab',
        kec: 'all_kec'
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Desa/Kelurahan ${isMultiple ? '(Multiple)' : ''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }
    onChangeDropdown = (data) => this.setState(data)

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord, kab, kec } = this.state
        return (
            <PageHeader
                className="site-page-header"
                subTitle={activePage === 'list' ? "Daftar Desa dan Kelurahan" : `${activeEditingtitle}`}
                onBack={activePage === 'list' ? undefined : this.onBack}
                ghost={false}
            >
                {activePage === 'list' ?
                    <Row>
                        <LihatDesaKel {...this.props} kab={kab} kec={kec} onChangeDropdown={this.onChangeDropdown} onClickTambah={this.onClickTambah} onClickEdit={this.onClickEdit} />
                    </Row> :
                    <Row>
                        <EditorDesaKel {...this.props} isMultiple={isMultiple} onChangeDropdown={this.onChangeDropdown} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}