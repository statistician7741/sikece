import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatDesaKel = dynamic(() => import("./DesaKelComponent/LihatDesaKel.DesaKel.Component"));
const EditorDesaKel = dynamic(() => import("./DesaKelComponent/EditorDesaKel.DesaKel.Component"));

export default class DesaKel extends React.Component {
    state = {
        isMultiple: false,
        kecData: [{
            _id: '060',
            name: 'Pasar Wajo',
            ket: 'Kecamatan pertama di Buton, didirikan tahun 1980'
        }, {
            _id: '050',
            name: 'Lasalimu',
            ket: '-'
        }, {
            _id: '051',
            name: 'Lasalimu Selatan',
            ket: 'Termasuk Kecamatan di Buton, didirikan tahun 2017. Kecamatan ini baru dimekarkan.'
        }],
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
        }],
        desaKelData: [{
            _id: '001',
            name: 'Holimombo Jaya',
            klasifikasi: 'Kelurahan',
            ket: '-'
        }, {
            _id: '002',
            name: 'Kondowa',
            klasifikasi: 'Kelurahan',
            ket: '-'
        }, {
            _id: '003',
            name: 'Dongkala',
            klasifikasi: 'Desa',
            ket: '-'
        }, {
            _id: '004',
            name: 'Holimombo',
            klasifikasi: 'Desa',
            ket: '-'
        }, {
            _id: '005',
            name: 'Takimpo',
            klasifikasi: 'Desa',
            ket: '-'
        }, {
            _id: '006',
            name: 'Kombeli',
            klasifikasi: 'Desa',
            ket: '-'
        }, {
            _id: '007',
            name: 'Awainulu',
            klasifikasi: 'Desa',
            ket: '-'
        },]
    }

    onClickTambah = isMultiple => this.setState({ isMultiple })

    render() {
        const { isMultiple, kabData, desaKelData, kecData } = this.state
        return (
            <Row gutter={[20, 0]}>
                <LihatDesaKel xs={24} md={14} kabData={kabData} kecData={kecData} desaKelData={desaKelData} onClickTambah={this.onClickTambah} />
                <EditorDesaKel xs={24} md={10} kabData={kabData} kecData={kecData} desaKelData={desaKelData} isMultiple={isMultiple} onClickTambah={this.onClickTambah} />
            </Row>
        )
    }
}