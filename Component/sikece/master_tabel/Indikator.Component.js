import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatIndikator = dynamic(() => import("./IndikatorComponent/LihatIndikator.Indikator.Component"));
const EditorIndikator = dynamic(() => import("./IndikatorComponent/EditorIndikator.Indikator.Component"));

export default class Indikator extends React.Component {
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
        const { babData, dataIndikators } = this.state;
        return (
            <Row gutter={[20, 0]}>
                <LihatIndikator babData={babData} dataIndikators={dataIndikators} xs={24} md={12} />
                <EditorIndikator babData={babData} dataIndikators={dataIndikators} xs={24} md={12} />
            </Row>
        )
    }
}