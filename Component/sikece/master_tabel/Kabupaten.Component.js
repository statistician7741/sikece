import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatKab = dynamic(() => import("./KabComponent/LihatKab.Kab.Component"));
const EditorKab = dynamic(() => import("./KabComponent/EditorKab.Kab.Component"));

export default class Kabupaten extends React.Component {
    state = {
        isMultiple: false
    }

    onClickTambah = isMultiple=>this.setState({isMultiple})

    render() {
        const { isMultiple } = this.state
        return (
            <Row gutter={[20, 0]}>
                <LihatKab xs={24} md={14} onClickTambah={this.onClickTambah} />
                <EditorKab xs={24} md={10} isMultiple={isMultiple} onClickTambah={this.onClickTambah} />
            </Row>
        )
    }
}