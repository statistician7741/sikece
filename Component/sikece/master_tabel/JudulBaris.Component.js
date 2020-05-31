import { Row } from "antd"
import dynamic from 'next/dynamic';

const LihatBaris = dynamic(() => import("./BarisComponent/LihatBaris.Baris.Component"));
const EditorBaris = dynamic(() => import("./BarisComponent/EditorBaris.Baris.Component"));

export default class Baris extends React.Component {
    state = {
    }

    render() {
        return (
            <Row gutter={[20, 0]}>
                <LihatBaris xs={24} md={10} />
                <EditorBaris xs={24} md={14} />
            </Row>
        )
    }
}