import Bar from './Charts/Bar.Monitoring'
import { List, Row, Col, Card, Skeleton, Typography, Tag, Spin, Button, Tabs } from 'antd';
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;
import InfiniteScroll from 'react-infinite-scroller';
import data from './Charts/data'
import { Fragment } from 'react';
import { getTable, getKec, getKab } from "../../../redux/actions/master.action"
import TextyAnim from 'rc-texty'
import Router from 'next/router'

const SummaryCard = ({ tittle, data, withTabel, percent }) => {
    return <Card
        loading={data === undefined}
        bordered={false}
        title={tittle}
    >
        <div style={{ textAlign: "center" }}>
            <span><strong style={{ fontSize: 60 }}>{data}</strong>{withTabel ? ' tabel' : null}{percent ? ` (${percent}%)` : null}</span>
        </div>
    </Card>
}

const getCard = (posisi, jenis_pengguna, allData, props) => {
    const { total_tabel, total_entri, total_blm_entri, total_disetujui, total_blm_disetujui, total_blm_ditanggapi } = allData
    if (posisi === 2) {
        if (jenis_pengguna === 'pengentri') return <SummaryCard tittle="Entri" data={total_entri} percent={Math.round(total_entri / total_tabel * 100)} withTabel />
        if (jenis_pengguna === 'peny_data') return <SummaryCard tittle="Disetujui" data={total_disetujui} percent={Math.round(total_disetujui / total_tabel * 100)} withTabel />
        else return <SummaryCard tittle="Entri" data={total_entri} percent={Math.round(total_entri / total_tabel * 100)} withTabel />
    } else if (posisi === 3) {
        if (jenis_pengguna === 'pengentri') return <SummaryCard tittle="Belum Entri" data={total_blm_entri} percent={Math.round(total_blm_entri / total_tabel * 100)} withTabel />
        if (jenis_pengguna === 'peny_data') return <SummaryCard tittle="Belum Disetujui" data={total_blm_disetujui} percent={Math.round(total_blm_disetujui / total_tabel * 100)} withTabel />
        else return <SummaryCard tittle="Disetujui" data={total_disetujui} percent={Math.round(total_disetujui / total_tabel * 100)} withTabel />
    } else {
        if (jenis_pengguna === 'pengentri') return <SummaryCard tittle="Disetujui" data={total_disetujui} percent={Math.round(total_disetujui / total_tabel * 100)} withTabel />
        if (jenis_pengguna === 'peny_data') return <SummaryCard tittle="Belum Ditanggapi" data={total_blm_ditanggapi} percent={Math.round(total_blm_ditanggapi / total_tabel * 100)} withTabel />
        else return <SummaryCard tittle="Penyedia Data" data={props.penyDataCount} />
    }
}

export default class IndexMonitoring extends React.Component {
    state = {
        summary: {},
        loading: true,
        hasMore: true,
        data: [...data.kab],
        levelApprove: 'kab',
        levelEntri: 'kab',
        // activities: [
        //     {
        //         key: "1",
        //         title: "Puskesmas Lasalimu Selatan",
        //         status: "Disetujui",
        //         description: "Tabel 2.3.4 Realisasi Program Imunisasi Bayi dan Ibu Hamil Menurut Jenisnya, 2015-2019",
        //         time: "14.22 31/05/2020"
        //     },
        //     {
        //         key: "2",
        //         title: "Kecamatan Pasar Wajo",
        //         status: "Blm Disetujui",
        //         description: "Tabel 1.1.1 Luas Daerah dan Jumlah Pulau Menurut Kelurahan/Desa, 2019",
        //         time: "09.45 11/06/2020"
        //     },
        //     {
        //         key: "3",
        //         title: "Kecamatan Pasar Wajo",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "09.57 11/06/2020"
        //     },
        //     {
        //         key: "4",
        //         title: "Kecamatan Lasalimu",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "08.11 11/06/2020"
        //     },
        //     {
        //         key: "5",
        //         title: "Kecamatan Lasalimu Selatan",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "13.32 11/06/2020"
        //     },
        //     {
        //         key: "6",
        //         title: "Kecamatan Siotapina",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "09.57 11/06/2020"
        //     },
        //     {
        //         key: "7",
        //         title: "Kecamatan Pasar Wajo",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "14.54 11/06/2020"
        //     },
        //     {
        //         key: "8",
        //         title: "Kecamatan Pasar Wajo",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "09.57 11/06/2020"
        //     },
        //     {
        //         key: "9",
        //         title: "Kecamatan Wolowa",
        //         status: "Disetujui",
        //         description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
        //         time: "12.59 11/06/2020"
        //     }
        // ],
        total_tabel: undefined,
        total_entri: undefined,
        total_disetujui: undefined,
        total_penyedia_data: undefined,
        activeKey: "persetujuan",
        kab: [],
        kec: [],
        active_kabPersetujuan: undefined,
        active_kabEntri: undefined
    }
    onClickKab = (datum) => {
        this.setState({ levelApprove: this.state.levelApprove === 'kec' ? 'kab' : 'kec', active_kabPersetujuan: datum.indexValue.substring(1, 5) })
    }
    onClickKabEntri = (datum) => {
        this.setState({ levelEntri: this.state.levelEntri === 'kec' ? 'kab' : 'kec', active_kabEntri: datum.indexValue.substring(1, 5) })
    }
    componentDidMount() {
        if (this.props.socket) {
            !this.props.all_table.length && this.props.dispatch(getTable(this.props.socket))
            !this.props.all_kab.length && this.props.dispatch(getKab(this.props.socket))
            !this.props.all_kec.length && this.props.dispatch(getKec(this.props.socket))
            if (this.props.all_kec.length && this.props.all_kab.length) {
                this.getKabDataChart()
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.props.dispatch(getKab(this.props.socket))
            this.props.dispatch(getTable(this.props.socket))
            this.props.dispatch(getKec(this.props.socket))
        }
        if (this.props.all_kec !== prevProps.all_kec) {
            if (this.props.all_kec.length && this.props.all_kab.length) {
                this.getKabDataChart()
            }
        }
    }
    onChangeTab = (key) => {
        this.setState({ activeKey: key })
    }
    getKabDataChart = () => {
        const { all_kab, all_kec, all_kab_obj, all_kec_obj, all_kec_table_obj, all_table } = this.props
        const total_tabel_perkec = all_table.length
        let kec = []
        let kab = []
        let kabTemp = {}
        if (all_kab.length && all_kec.length) {
            if (Object.keys(all_kec_table_obj).length) {
                Object.keys(all_kec_table_obj).forEach(_idKec => {
                    const _idKab = all_kec_obj[_idKec].kab
                    if (!kabTemp[_idKab]) kabTemp[_idKab] = {
                        "region": `[${all_kab_obj[_idKab]._id}] ${all_kab_obj[_idKab].name}`,
                        "Disetujui": 0,
                        "Belum Disetujui": 0,
                        "Telah Dientri": 0,
                        "Belum Dientri": 0,
                        "kecCount": 0
                    }
                    let approvedCountKec = 0
                    let entriCountKec = Object.keys(all_kec_table_obj[_idKec]).length
                    if (Object.keys(all_kec_table_obj[_idKec]).length) {
                        Object.keys(all_kec_table_obj[_idKec]).forEach(_idTable => {
                            if (all_kec_table_obj[_idKec][_idTable].isApproved) {
                                approvedCountKec++
                            }
                        })
                    }
                    kec.push({
                        "region": `[${all_kec_obj[_idKec].kode}] ${all_kec_obj[_idKec].name}`,
                        "_idKec": _idKab,
                        "Disetujui": Math.round(approvedCountKec / total_tabel_perkec * 100),
                        "Belum Disetujui": Math.round((total_tabel_perkec - approvedCountKec) / total_tabel_perkec * 100),
                        "Telah Dientri": Math.round(entriCountKec / total_tabel_perkec * 100),
                        "Belum Dientri": Math.round((total_tabel_perkec - entriCountKec) / total_tabel_perkec * 100),
                    })
                    kabTemp[_idKab]["kecCount"]++
                    kabTemp[_idKab]["Disetujui"] = kabTemp[_idKab]["Disetujui"] + approvedCountKec
                    kabTemp[_idKab]["Belum Disetujui"] = kabTemp[_idKab]["Belum Disetujui"] + (total_tabel_perkec - approvedCountKec)
                    kabTemp[_idKab]["Telah Dientri"] = kabTemp[_idKab]["Telah Dientri"] + entriCountKec
                    kabTemp[_idKab]["Belum Dientri"] = kabTemp[_idKab]["Belum Dientri"] + (total_tabel_perkec - entriCountKec)
                })
            }
            if (Object.keys(kabTemp).length) {
                Object.keys(kabTemp).forEach(k => {
                    kab.push({
                        "region": kabTemp[k]['region'],
                        "Disetujui": Math.round(kabTemp[k]["Disetujui"] / (kabTemp[k]['kecCount'] * total_tabel_perkec) * 100),
                        "Belum Disetujui": Math.round((kabTemp[k]["Belum Disetujui"]) / (kabTemp[k]['kecCount'] * total_tabel_perkec) * 100),
                        "Telah Dientri": Math.round(kabTemp[k]["Telah Dientri"] / (kabTemp[k]['kecCount'] * total_tabel_perkec) * 100),
                        "Belum Dientri": Math.round((kabTemp[k]["Belum Dientri"]) / (kabTemp[k]['kecCount'] * total_tabel_perkec) * 100),
                    })
                })
            }
            this.setState({ kab, kec })
        }
    }
    render() {
        const { data, activities, loading, hasMore, activeKey, levelApprove, levelEntri, kab, kec, active_kabPersetujuan, active_kabEntri } = this.state
        const { active_user: { jenis_pengguna, name }, all_table, all_kec, all_kec_table_arr, tahun_buku_monitoring } = this.props

        const total_tabel = all_table.length && all_kec.length ? all_table.filter(t => (tahun_buku_monitoring == t.bab.substring(0, 4))).length * all_kec.length : 0
        const total_entri = all_kec_table_arr.length
        const total_blm_entri = total_tabel - total_entri
        const total_disetujui = all_kec_table_arr.length ? all_kec_table_arr.filter(data => (data.isApproved === true)).length : 0
        const total_blm_disetujui = all_kec_table_arr.length ? all_kec_table_arr.filter(data => (data.isApproved === false)).length : 0
        const total_blm_ditanggapi = total_tabel - total_disetujui - total_blm_disetujui

        const allData = {
            total_tabel,
            total_entri,
            total_blm_entri,
            total_disetujui,
            total_blm_ditanggapi,
            total_blm_disetujui
        }
        const dataBarApprove = levelApprove === 'kab' ? kab : kec.filter(k => (active_kabPersetujuan == k._idKec))
        const dataBarEntri = levelEntri === 'kab' ? kab : kec.filter(k => (active_kabEntri == k._idKec))

        return (
            <Fragment>
                <Row gutter={[8, 16]}>
                    <Col xs={12} md={6}>
                        <SummaryCard tittle="Total Tabel" data={total_tabel} withTabel />
                    </Col>
                    <Col xs={12} md={6}>
                        {getCard(2, jenis_pengguna, allData)}
                    </Col>
                    <Col xs={12} md={6}>
                        {getCard(3, jenis_pengguna, allData)}
                    </Col>
                    <Col xs={12} md={6}>
                        {getCard(4, jenis_pengguna, allData, this.props)}
                    </Col>
                </Row>
                {['peny_data', 'pengentri'].includes(jenis_pengguna) ?
                    <Row justify="center">
                        <Col xs={24}>
                            <Card style={{ textAlign: "center" }}>
                                <TextyAnim mode="smooth" style={{ fontSize: 22 }}>{`Selamat datang, ${name}`}</TextyAnim>
                                <Button onClick={() => Router.push(`/sikece/${jenis_pengguna === 'peny_data' ? 'persetujuan' : 'entri_data'}`)} style={{ margin: '16px 0' }} type="primary" size="large">Mulai {jenis_pengguna === 'peny_data' ? 'mengecek tabel' : 'Mengentri'}</Button>
                            </Card>
                        </Col>
                    </Row> : (!jenis_pengguna ? <Row style={{ textAlign: "center" }}>
                        <Col xs={24}>
                            <Spin />
                        </Col>
                    </Row> : <Fragment>
                            <Row gutter={[8, 16]}>
                                <Col xs={24}>
                                    <Tabs defaultActiveKey="persetujuan" onChange={this.onChangeTab} style={{ background: "#fff", padding: "16px 24px" }}>
                                        <TabPane tab={"Progress Persetujuan"} key="persetujuan">
                                            <div style={{ height: 330, width: '100%' }}>
                                                <Bar data={dataBarApprove} keys={['Disetujui', 'Belum Disetujui']} onClickKab={this.onClickKab} />
                                            </div>
                                        </TabPane>
                                        <TabPane tab={"Progress Entri"} key="entri">
                                            <div style={{ height: 330, width: '100%' }}>
                                                <Bar data={dataBarEntri} keys={['Telah Dientri', 'Belum Dientri']} onClickKab={this.onClickKabEntri} />
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </Col>
                                {/* <Col xs={24} md={8}>
                                    <Card title="Persetujuan Data Terkini">
                                        <div className="demo-infinite-container">
                                            <InfiniteScroll
                                                initialLoad={false}
                                                pageStart={0}
                                                loadMore={this.handleInfiniteOnLoad}
                                                hasMore={!this.state.loading && this.state.hasMore}
                                                useWindow={false}
                                            >

                                                <List
                                                    loading={false}
                                                    size="small"
                                                    locale={{ emptyText: 'Tidak ada data' }}
                                                    itemLayout="horizontal"
                                                    dataSource={activities}
                                                    renderItem={activity => (
                                                        <List.Item>
                                                            <Skeleton title={false} loading={false} active>
                                                                <List.Item.Meta
                                                                    title={activity.title}
                                                                    description={
                                                                        <span>
                                                                            <Paragraph
                                                                                ellipsis={{
                                                                                    rows: 1,
                                                                                    expandable: true,
                                                                                }}
                                                                                style={{ marginRight: 8 }}
                                                                            >
                                                                                <Tag color={activity.status === 'Disetujui' ? '#87d068' : '#f50'}>{activity.status}</Tag>{activity.description}
                                                                            </Paragraph>
                                                                        </span>
                                                                    }
                                                                />
                                                            </Skeleton>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>{activity.time}</Text>
                                                        </List.Item>)
                                                    }
                                                >
                                                    {loading && hasMore && (
                                                        <div className="demo-loading-container">
                                                            <Spin />
                                                        </div>
                                                    )}
                                                </List>
                                            </InfiniteScroll>
                                        </div>
                                    </Card>
                                </Col> */}
                            </Row>
                        </Fragment>)
                }
            </Fragment>
        )
    }
}