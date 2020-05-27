import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatKec = dynamic(() => import("./KecComponent/LihatKec.Kec.Component"));
const EditorKec = dynamic(() => import("./KecComponent/EditorKec.Kec.Component"));

export default class Kecamatan extends React.Component {
    state = {
        isMultiple: false,        
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

    onClickTambah = isMultiple=>this.setState({isMultiple})

    render() {
        const { isMultiple, kabData } = this.state
        return (
            <Row gutter={[20, 0]}>
                <LihatKec xs={24} md={14} kabData={kabData} onClickTambah={this.onClickTambah} />
                <EditorKec xs={24} md={10} kabData={kabData} isMultiple={isMultiple} onClickTambah={this.onClickTambah} />
            </Row>
        )
    }
}