import dynamic from 'next/dynamic';
import { Row } from 'antd';

const LihatTabel = dynamic(() => import("./TabelComponent/LihatTabel.Tabel.Component"));
const EditorTabel = dynamic(() => import("./TabelComponent/EditorTabel.Tabel.Component"));

export default class Tabel extends React.Component {
    state = {
        indikators: [
            {
                value: 'Geografi',
                label: 'Geografi',
                isLeaf: false,
            },
            {
                value: 'Pemerintahan',
                label: 'Pemerintahan',
                isLeaf: false,
            },
        ],
        kecData: [
            {
                value: 'buton',
                label: '[7401] Buton',
                isLeaf: false,
            },
            {
                value: 'buteng',
                label: '[7414] Buton Tengah',
                isLeaf: false,
            },
            {
                value: 'busel',
                label: '[7415] Buton Selatan',
                isLeaf: false,
            },
        ],
        babs: [{ nomor: 1, name: 'Geografi' }, { nomor: 2, name: 'Pemerintahan' }],
        tabels: [{
            nomor: '1.1',
            judul: 'Luas Wilayah di Kecamatan Pasarwajo (Hektar)',
            tahun: 2019,
            bab: 'Geografi'
        }, {
            nomor: '1.2',
            judul: 'Luas Wilayah menurut Jenis Lahan di Kecamatan Pasarwajo...',
            tahun: 2019,
            bab: 'Geografi'
        }, {
            nomor: '1.3',
            judul: 'Luas Lahan Bukan Sawah menurut Penggunaan ... Pasarwajo...',
            tahun: 2019,
            bab: 'Geografi'
        }, {
            nomor: '1.4',
            judul: 'Luas Lahan Pertanian Bukan Sawah menurut...',
            tahun: 2019,
            bab: 'Geografi'
        }, {
            nomor: '2.1',
            judul: 'Banyaknya Dusun, Rukun Warga (RW) dan Rukun...',
            tahun: 2019,
            bab: 'Pemerintahan'
        }, {
            nomor: '2.2',
            judul: 'Banyaknya Pamong dan Perangkat Desa menurut Jabatan...',
            tahun: 2019,
            bab: 'Pemerintahan'
        }, {
            nomor: '2.3',
            judul: 'Banyaknya Pamong dan Perangkat Desa menurut Jenis...',
            tahun: 2019,
            bab: 'Pemerintahan'
        }, {
            nomor: '2.4',
            judul: 'Banyaknya Pamong dan Perangkat Desa...',
            tahun: 2019,
            bab: 'Pemerintahan'
        },]
    }

    loadDataKec = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `[060] Kec 1`,
                    value: 'kec1',
                },
                {
                    label: `[050] Kec 2`,
                    value: 'kec2',
                },
                {
                    label: `[051] Kec 3`,
                    value: 'kec3',
                },
            ];
            this.setState({
                kecData: [...this.state.kecData],
            });
        }, 1000);
    };

    loadDataIndikators = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `Luas Wilayah menurut Desa/Kelurahan`,
                    value: 'kec1',
                },
                {
                    label: `Jumlah penduduk menurut desa/kelurahan`,
                    value: 'kec2',
                },
            ];
            this.setState({
                indikators: [...this.state.indikators],
            });
        }, 1000);
    };

    cascaderFilter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    render() {
        const { babs, tabels, kecData, indikators } = this.state
        return (
            <Row gutter={[20,0]}>
                <LihatTabel xs={24} md={14} bab babs={babs} tabels={tabels} kecData={kecData} loadDataKec={this.loadDataKec} />
                <EditorTabel xs={24} md={10} kecData={kecData} loadDataKec={this.loadDataKec} indikators={indikators} loadDataIndikators={this.loadDataIndikators} cascaderFilter={this.cascaderFilter} />
            </Row>
        )
    }
}