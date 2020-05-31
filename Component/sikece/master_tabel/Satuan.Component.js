import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatSatuan = dynamic(() => import("./SatuanComponent/LihatSatuan.Satuan.Component"));
const EditorSatuan = dynamic(() => import("./SatuanComponent/EditorSatuan.Satuan.Component"));

export default class Satuan extends React.Component {
    state = {
        isMultiple: false,
        satuanData: [{
            _id: '1',
            name: 'Jiwa',
            ket: '-'
        }, {
            _id: '2',
            name: 'Km2',
            ket: '-'
        }, {
            _id: '3',
            name: 'Ton',
            ket: '-'
        }]
    }

    onClickTambah = isMultiple => this.setState({ isMultiple })

    render() {
        const { isMultiple, kabData, kecData, satuanData } = this.state
        return (
            <Row gutter={[20, 0]}>
                <LihatSatuan xs={24} md={14} kabData={kabData} kecData={kecData} satuanData={satuanData} onClickTambah={this.onClickTambah} />
                <EditorSatuan xs={24} md={10} kabData={kabData} kecData={kecData} satuanData={satuanData} isMultiple={isMultiple} onClickTambah={this.onClickTambah} />
            </Row>
        )
    }
}