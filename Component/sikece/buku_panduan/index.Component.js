import dynamic from 'next/dynamic';
import { Tabs, PageHeader, Row, Col } from 'antd'
const { TabPane } = Tabs;
const tabs = [{
    name: "Monitoring",
    Component: dynamic(() => import("./Components/Monitoring.Comp"))
}, {
    name: "Master Tabel",
    Component: dynamic(() => import("./Components/MasterTabel.Comp"))
}, {
    name: "Entri Data",
    Component: dynamic(() => import("./Components/EntriData.Comp"))
}, {
    name: "Persetujuan Data",
    Component: dynamic(() => import("./Components/PersetujuanData.Comp"))
}, {
    name: "Master Pengguna",
    Component: dynamic(() => import("./Components/MasterPengguna.Comp"))
}]

export default class IndexMasterTabel extends React.Component {
    state = {

    }

    render() {
        return (<Row>
            <Col xs={24}>
                <PageHeader
                    className="site-page-header"
                    title="Buku Panduan"
                >
                    <Tabs size="small" tabPosition="left" style={{ height: '100vh' }}>
                        {tabs.map(t => <TabPane tab={t.name} key={t.name}>
                            {<t.Component menuName={t.name} />}
                        </TabPane>)}
                    </Tabs>
                </PageHeader>
            </Col>
        </Row>
        )
    }
}