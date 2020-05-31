import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatKolom = dynamic(() => import("./KolomComponent/LihatKolom.Kolom.Component"));
const EditorKolom = dynamic(() => import("./KolomComponent/EditorKolom.Kolom.Component"));

export default class Kolom extends React.Component {
    state = {
    }

    render() {
        return (
            <Row gutter={[20, 0]}>
                <LihatKolom xs={24} md={10} />
                <EditorKolom xs={24} md={14} />
            </Row>
        )
    }
}