import dynamic from 'next/dynamic';
import { Tabs, PageHeader, Row, Col } from 'antd'
const { TabPane } = Tabs;
const tabs = [{
    name: "Monitoring",
    Component: dynamic(() => import("./Components/Monitoring.Comp")),
    user_type: ['ka_bps', 'admin', 'supervisor', 'editor', 'pengentri', 'peny_data'],
    link: 'Monitoring'
}, {
    name: "Tabel Final",
    Component: dynamic(() => import("./Components/TabelFinal.Comp")),
    user_type: ['ka_bps', 'admin', 'supervisor'],
    link: 'TabelFinal'
}, {
    name: "Master Tabel",
    Component: dynamic(() => import("./Components/MasterTabel.Comp")),
    user_type: ['admin', 'editor'],
    link: 'MasterTabel'
}, {
    name: "Entri Data",
    Component: dynamic(() => import("./Components/EntriData.Comp")),
    user_type: ['pengentri'],
    link: 'EntriData'
}, {
    name: "Persetujuan Data",
    Component: dynamic(() => import("./Components/PersetujuanData.Comp")),
    user_type: ['peny_data'],
    link: 'PersetujuanData'
}, {
    name: "Master Pengguna",
    Component: dynamic(() => import("./Components/MasterPengguna.Comp")),
    user_type: ['admin'],
    link: 'MasterPengguna'
}]

export default class IndexMasterTabel extends React.Component {
    render() {
        const { jenis_pengguna } = this.props.active_user
        return (<Row>
            <Col xs={24}>
                <PageHeader
                    className="site-page-header"
                    title="Buku Panduan"
                >
                    <Tabs size="small" tabPosition="left" style={{ height: '100vh' }}>
                        {tabs.map(t => t.user_type.includes(jenis_pengguna) ? <TabPane tab={t.name} key={t.name}>
                            {<t.Component menuName={t.name} closing="Berikut merupakan panduan bagaimana menggunakan menu tersebut" />}
                            <iframe type="application/pdf" width="100%" height="690" frameBorder="0" src={`http://${window.location.hostname}/view/buku_panduan/Buku_Panduan_SIKECE-${t.link}${t.link === 'Monitoring'?(['peny_data'].includes(jenis_pengguna)?'-1':(['pengentri'].includes(jenis_pengguna)?'-2':'-3')):''}.pdf`}></iframe>
                        </TabPane> : null)}
                    </Tabs>
                </PageHeader>
            </Col>
        </Row>
        )
    }
}