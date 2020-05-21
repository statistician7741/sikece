import dynamic from 'next/dynamic';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const tabs = [{
    name: 'Tabel',
    Component: dynamic(() => import("./Tabel.Component"))
}, {
    name: 'Indikator',
    Component: dynamic(() => import("./Indikator.Component"))
}, {
    name: 'Judul Kolom',
    Component: dynamic(() => import("./JudulKolom.Component"))
}, {
    name: 'Judul Baris',
    Component: dynamic(() => import("./JudulBaris.Component"))
}, {
    name: 'Satuan',
    Component: dynamic(() => import("./Satuan.Component"))
}, {
    name: 'Bab',
    Component: dynamic(() => import("./Bab.Component"))
}, {
    name: 'Kabupaten',
    Component: dynamic(() => import("./Kabupaten.Component"))
}, {
    name: 'Kecamatan',
    Component: dynamic(() => import("./Kecamatan.Component"))
}, {
    name: 'Desa/Kelurahan',
    Component: dynamic(() => import("./DesaKelurahan.Component"))
}]

export default class IndexMasterTabel extends React.Component {
    state = {
        activeKey: "Tabel"
    }

    onChangeTab = (key) => this.setState({ activeKey: key })

    render() {
        const { activeKey } = this.state;
        return (
            <Tabs defaultActiveKey={activeKey} onChange={this.onChangeTab} animated={false}>
                {tabs.map(t => <TabPane tab={`${t.name}`} key={`${t.name}`}>
                    {<t.Component />}
                </TabPane>)}
            </Tabs>
        )
    }
}