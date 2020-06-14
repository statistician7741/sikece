import { Row } from "antd"
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

const LihatIndikator = dynamic(() => import("./IndikatorComponent/LihatIndikator.Indikator.Component"));
const EditorIndikator = dynamic(() => import("./IndikatorComponent/EditorIndikator.Indikator.Component"));

class Indikator extends React.Component {
    state = {
        babData: [{
            _id: '1',
            name: 'Geografi',
            ket: '-'
        }, {
            _id: '2',
            name: 'Pemerintahan',
            ket: '-'
        }, {
            _id: '3',
            name: 'Penduduk',
            ket: '-'
        }],
        dataIndikators: [{
            _id: 1,
            name: 'Luas wilayah menurut Desa/Kelurahan',
            ket: "-",
            judul_baris: {
                _id: 'a',
                name: 'Desa/Kelurahan',
                vars: ['Holimombo Jaya', 'Kondowa', 'Dongkala', 'Holimombo', 'Takimpo', 'Kombeli', 'Awainulu']
            },
            judul_kolom: [{
                _id: 'b',
                name: 'Jumlah penduduk',
                vars: [
                    ["Laki-laki", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Perempuan", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Jumlah", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Pie', '-', "-"],
                ]
            },{
                _id: 'c',
                name: 'Kematian',
                vars: [
                    ["Kematian", "Jiwa", "Angka", 0, 'Bar', '-', "-"],
                ]
            },{
                _id: 'd',
                name: 'Kelahiran',
                vars: [
                    ["Kelahiran", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                ]
            }],
        }]
    }

    render() {
        const { babs, indikators } = this.props;
        return (
            <Row gutter={[20, 0]}>
                <LihatIndikator babData={babs} dataIndikators={indikators} xs={24} md={12} />
                <EditorIndikator babData={babs} dataIndikators={indikators} xs={24} md={12} />
            </Row>
        )
    }
}

function mapStateToProps(state) {
    const { indikators, babs } = state.master
    return { indikators, babs }
}

export default connect(mapStateToProps)(Indikator)