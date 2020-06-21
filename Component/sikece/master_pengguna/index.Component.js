import { Row, PageHeader } from "antd"
import dynamic from 'next/dynamic';

const LihatUser = dynamic(() => import("./LihatUser.Component"));
const EditorUser = dynamic(() => import("./EditorUser.Component"));

export default class IndexMasterPengguna extends React.Component {
    state = {
        isMultiple: false,
        activePage: 'list',
        activeEditingtitle: '',
        activeRecord: undefined,
        all_user: [{
            _id: 1,
            name: 'Admin 1',
            jenis_pengguna: 'Admin',
            ket: 'Bisa mengakses semua fitur SIKECE',
        }, {
            _id: 2,
            name: 'Kepala BPS Kab',
            jenis_pengguna: 'Kepala BPS Kabupaten Kota',
            ket: 'Bisa mengakses fitur Monitoring dan Buku Panduan',
        }, {
            _id: 2,
            name: 'Kasi IPDS',
            jenis_pengguna: 'Supervisor',
            ket: 'Bisa mengakses fitur Monitoring, Master tabel, Entri Data, dan Buku Panduan',
        }, {
            _id: 3,
            name: 'Nurul Husna Khairunnisa S.Tr.Stat',
            jenis_pengguna: 'Editor',
            ket: 'Bisa mengakses fitur Master Tabel, Entri Data, dan Buku Panduan',
        }, {
            _id: 4,
            name: ' Reka Sri Wigati S.Tr.Stat.',
            jenis_pengguna: 'Editor',
            ket: 'Bisa mengakses fitur Master Tabel, Entri Data, dan Buku Panduan',
        }, {
            _id: 5,
            name: 'Sudarwo',
            jenis_pengguna: 'Operator Entri',
            ket: 'Bisa mengakses fitur Entri data dan Buku Panduan',
        }, {
            _id: 6,
            name: 'Yerni',
            jenis_pengguna: 'Operator Entri',
            ket: 'Bisa mengakses fitur Entri data dan Buku Panduan',
        }, {
            _id: 7,
            name: 'Puskesmas Lasalimu Selatan',
            jenis_pengguna: 'Eksternal',
            ket: 'Bisa mengakses fitur persetujuan Data',
        }, {
            _id: 8,
            name: 'Kecamatan Pasar Wajo',
            jenis_pengguna: 'Eksternal',
            ket: 'Bisa mengakses fitur persetujuan Data',
        },]
    }
    onClickTambah = isMultiple => {
        this.setState({ isMultiple, activePage: 'edit', activeEditingtitle: `Tambah Pengguna ${isMultiple ? '(Multiple)' : ''}`, activeRecord: undefined })
    }
    onClickEdit = (activeEditingtitle, activeRecord) => {
        this.setState({ isMultiple: false, activePage: 'edit', activeEditingtitle, activeRecord })
    }

    onBack = () => this.setState({ activePage: 'list' })

    render() {
        const { isMultiple, activePage, activeEditingtitle, activeRecord } = this.state

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
                        <EditorUser {...this.props} isMultiple={isMultiple} onClickTambah={this.onClickTambah} activeRecord={activeRecord} onBack={this.onBack} />
                    </Row>}
            </PageHeader>
        )
    }
}