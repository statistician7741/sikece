import dynamic from 'next/dynamic';
import { Tabs, PageHeader } from 'antd';
import Router from 'next/router'

const { TabPane } = Tabs;

const tabs = [{
    name: 'Tabel',
    Component: dynamic(() => import("./Tabel.Component"))
}, 
// {
//     name: 'Indikator',
//     Component: dynamic(() => import("./Indikator.Component"))
// }
, {
    name: 'Variabel',
    Component: dynamic(() => import("./JudulKolom.Component"))
}, 
// {
//     name: 'Judul Baris',
//     Component: dynamic(() => import("./JudulBaris.Component"))
// }
, {
    name: 'Satuan',
    Component: dynamic(() => import("./Satuan.Component"))
}, {
    name: 'Bab',
    Component: dynamic(() => import("./Bab.Component"))
}, {
    name: 'Subjek',
    Component: dynamic(() => import("./Subjek.Component"))
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
    onChangeTab = (key) => {
        this.setState({ activeKey: key }, () => {
            Router.push({
                pathname: '/sikece/master_tabel',
                query: { tab: key },
            })
        })
    }

    render() {
        const { router } = this.props;
        return (
            <PageHeader
                className="site-page-header"
                title="Master Tabel"
            >
                <Tabs defaultActiveKey={router.query.tab} onChange={this.onChangeTab} animated={false}>
                    {tabs.map(t => <TabPane tab={`${t.name}`} key={`${t.name}`}>
                        {<t.Component {...this.props} />}
                    </TabPane>)}
                </Tabs>
            </PageHeader>
        )
    }
}