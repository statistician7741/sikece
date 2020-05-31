import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatSubjek = dynamic(() => import("./SubjekComponent/LihatSubjek.Subjek.Component"));
const EditorSubjek = dynamic(() => import("./SubjekComponent/EditorSubjek.Subjek.Component"));

export default class Subjek extends React.Component {
    state = {
        isMultiple: false,
        subjekData: [{
            _id: '1',
            name: 'Sosial Kependudukan',
            ket: '-'
        }, {
            _id: '2',
            name: 'Ekonomi dan Perdagangan',
            ket: '-'
        }, {
            _id: '3',
            name: 'Pertanian dan Pertambangan',
            ket: '-'
        }]
    }

    onClickTambah = isMultiple => this.setState({ isMultiple })

    render() {
        const { isMultiple, subjekData } = this.state
        return (
            <Row gutter={[20, 0]}>
                <LihatSubjek xs={24} md={14} subjekData={subjekData} onClickTambah={this.onClickTambah} />
                <EditorSubjek xs={24} md={10} subjekData={subjekData} isMultiple={isMultiple} onClickTambah={this.onClickTambah} />
            </Row>
        )
    }
}