import Bar from './Charts/Bar.Monitoring'
import { List, Row, Col, Card, Typography, Badge, Spin, Button, Tabs, Avatar } from 'antd';
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;
import data from './Charts/data'
import { Fragment } from 'react';
import { getTable, getKec, getKab } from "../../../redux/actions/master.action"
import TextyAnim from 'rc-texty'
import Router from 'next/router'
import { ResponsiveLine } from '@nivo/line'
import moment from 'moment'

const SummaryCard = ({ tittle, data, withTabel, percent }) => {
    return <Card
        loading={data === undefined}
        bordered={false}
        title={tittle}
    >
        <div style={{ textAlign: "center" }}>
            <span><strong style={{ fontSize: 60 }}>{data}</strong>{withTabel ? ' tabel' : null}{percent === false ? null : ` (${percent}%)`}</span>
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
        else return <SummaryCard tittle="Penyedia Data" data={props.penyDataCount} percent={false} />
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
        total_tabel: undefined,
        total_entri: undefined,
        total_disetujui: undefined,
        total_penyedia_data: undefined,
        activeKey: "persetujuan",
        kab: [],
        kec: [],
        active_kabPersetujuan: undefined,
        active_kabEntri: undefined,
        topVisitor: [],
        onlineUser: [],
    }
    onClickKab = (datum) => {
        this.setState({ levelApprove: this.state.levelApprove === 'kec' ? 'kab' : 'kec', active_kabPersetujuan: datum.indexValue.substring(1, 5) })
    }
    onClickKabEntri = (datum) => {
        this.setState({ levelEntri: this.state.levelEntri === 'kec' ? 'kab' : 'kec', active_kabEntri: datum.indexValue.substring(1, 5) })
    }
    componentDidMount() {
        const { active_user: { jenis_pengguna, name, profil }, socket, all_table, all_kab, all_kec, dispatch } = this.props
        if (socket) {
            !all_table.length && dispatch(getTable(socket))
            !all_kab.length && dispatch(getKab(socket))
            !all_kec.length && dispatch(getKec(socket))
            if (all_kec.length && all_kab.length) {
                // this.getKabDataChart()
            }
            this.getTopVisitor(this.props)
            if (!['peny_data', 'pengentri'].includes(jenis_pengguna)) {
                socket.on('refreshTopVisitor', () => this.getTopVisitor(this.props))
                socket.on('refreshGrafik', ({isKab, isTable, isKec}) => this.refreshGrafik(isKab, isTable, isKec))
                socket.on('refreshOnlineUser', (onlineUser) => this.setState({ onlineUser }))
                socket.on('isYouStillOnline', (nameTarget) => {
                    if (nameTarget === name) socket.emit('imStillOnline', { name, profil })
                })
                socket.emit('getOnlineUser')
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
                // this.getKabDataChart()
            }
        }
    }
    refreshGrafik = (isKab, isTable, isKec) => {
        isKab&&this.props.dispatch(getKab(this.props.socket))
        isKec&&this.props.dispatch(getKec(this.props.socket))
        isTable&&this.props.dispatch(getTable(this.props.socket))
    }
    onChangeTab = (key) => {
        this.setState({ activeKey: key })
    }
    getKabDataChart = () => {
        const { all_kab, all_kec, all_kab_obj, all_kec_obj, all_kec_table_obj_m, all_table } = this.props
        const total_tabel_perkec = all_table.length
        let kec = []
        let kab = []
        let kabTemp = {}
        if (all_kab.length && all_kec.length) {
            if (Object.keys(all_kec_table_obj_m).length) {
                Object.keys(all_kec_table_obj_m).forEach(_idKec => {
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
                    let entriCountKec = Object.keys(all_kec_table_obj_m[_idKec]).length
                    if (Object.keys(all_kec_table_obj_m[_idKec]).length) {
                        Object.keys(all_kec_table_obj_m[_idKec]).forEach(_idTable => {
                            if (all_kec_table_obj_m[_idKec][_idTable].isApproved) {
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
    getTopVisitor = (props) => {
        props.socket.emit('api.master_user.user/getTopVisitor', (response) => {
            if (response.type === 'ok') {
                this.setState({ topVisitor: response.data })
            } else {
                props.showErrorMessage(response.additionalMsg)
            }
        })
    }
    render() {
        const { levelApprove, levelEntri, active_kabPersetujuan, active_kabEntri, topVisitor, onlineUser } = this.state
        const { active_user: { jenis_pengguna, name }, all_kec_table_obj_m, all_kab_obj, all_kec_obj, all_table, all_kab, all_kec, all_kec_table_arr_m, tahun_buku_monitoring } = this.props
        const total_tabel = all_table.length && all_kec.length ? all_table.filter(t => (tahun_buku_monitoring == t.bab.substring(0, 4))).length * all_kec.length : 0
        const total_entri = all_kec_table_arr_m.length
        const total_blm_entri = total_tabel - total_entri
        const total_disetujui = all_kec_table_arr_m.length ? all_kec_table_arr_m.filter(data => (data.isApproved === true)).length : 0
        const total_blm_disetujui = all_kec_table_arr_m.length ? all_kec_table_arr_m.filter(data => (data.isApproved === false)).length : 0
        const total_blm_ditanggapi = total_tabel - total_disetujui - total_blm_disetujui
        const disetujui = {}
        const entri = {}
        let max_count = 0
        all_kec_table_arr_m.forEach(t => {
            const { entryDate, isApproved, approvedDate } = t
            if (entryDate) {
                if (!entri[moment(entryDate).format('DD/MM')]) entri[moment(entryDate).format('DD/MM')] = { count: 0, unix: moment(entryDate).valueOf() }
                if (!disetujui[moment(entryDate).format('DD/MM')]) disetujui[moment(entryDate).format('DD/MM')] = { count: 0, unix: moment(entryDate).valueOf() }
                entri[moment(entryDate).format('DD/MM')]['count'] += 1
                max_count = entri[moment(entryDate).format('DD/MM')]['count'] > max_count ? entri[moment(entryDate).format('DD/MM')]['count'] : max_count
            }
            if (isApproved && approvedDate) {
                if (!disetujui[moment(approvedDate).format('DD/MM')]) disetujui[moment(approvedDate).format('DD/MM')] = { count: 0, unix: moment(approvedDate).valueOf() }
                if (!entri[moment(approvedDate).format('DD/MM')]) entri[moment(approvedDate).format('DD/MM')] = { count: 0, unix: moment(approvedDate).valueOf() }
                disetujui[moment(approvedDate).format('DD/MM')]['count'] += 1
            }
        })
        let entryDataDate = []
        let disetujuiDataDate = []
        for (let d in entri) {
            if (entri.hasOwnProperty(d)) {
                entryDataDate.push({ x: d, y: entri[d]['count'], unix: entri[d]['unix'] })
            }
        }
        for (let d in disetujui) {
            if (disetujui.hasOwnProperty(d)) {
                disetujuiDataDate.push({ x: d, y: disetujui[d]['count'], unix: disetujui[d]['unix'] })
            }
        }
        let aktivitas_tabel = [{
            "id": "Disetujui",
            "data": disetujuiDataDate.length > 10 ? disetujuiDataDate.sort((a, b) => (a.unix > b.unix) ? 1 : -1).slice(Math.max(disetujuiDataDate.length - 10, 1)) : disetujuiDataDate.sort((a, b) => (a.unix > b.unix) ? 1 : -1)
        }, {
            "id": "Entri",
            "data": entryDataDate.length > 10 ? entryDataDate.sort((a, b) => (a.unix > b.unix) ? 1 : -1).slice(Math.max(entryDataDate.length - 10, 1)) : entryDataDate.sort((a, b) => (a.unix > b.unix) ? 1 : -1)
        }]

        const allData = {
            total_tabel,
            total_entri,
            total_blm_entri,
            total_disetujui,
            total_blm_ditanggapi,
            total_blm_disetujui
        }

        const total_tabel_perkec = all_table.length
        let kec = []
        let kab = []
        let kabTemp = {}
        if (all_kab.length && all_kec.length) {
            if (Object.keys(all_kec_table_obj_m).length) {
                Object.keys(all_kec_table_obj_m).forEach(_idKec => {
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
                    let entriCountKec = Object.keys(all_kec_table_obj_m[_idKec]).length
                    if (Object.keys(all_kec_table_obj_m[_idKec]).length) {
                        Object.keys(all_kec_table_obj_m[_idKec]).forEach(_idTable => {
                            if (all_kec_table_obj_m[_idKec][_idTable].isApproved) {
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
            // this.setState({ kab, kec })
        }
        const dataBarApprove = levelApprove === 'kab' ? kab : kec.filter(k => (active_kabPersetujuan == k._idKec))
        const dataBarEntri = levelEntri === 'kab' ? kab : kec.filter(k => (active_kabEntri == k._idKec))

        return (
            <Fragment>
                <Row gutter={[8, 16]}>
                    <Col xs={24} md={6}>
                        <SummaryCard tittle="Total Tabel" data={total_tabel} withTabel percent={false} />
                    </Col>
                    <Col xs={24} md={6}>
                        {getCard(2, jenis_pengguna, allData)}
                    </Col>
                    <Col xs={24} md={6}>
                        {getCard(3, jenis_pengguna, allData)}
                    </Col>
                    <Col xs={24} md={6}>
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
                    </Row> : (!jenis_pengguna ? <Row>
                        <Col xs={24} style={{ textAlign: "center" }}>
                            <Spin />
                        </Col>
                    </Row> : <Fragment>
                            <Row gutter={[8, 0]}>
                                <Col xs={24} md={18}>
                                    <Tabs defaultActiveKey="entri" onChange={this.onChangeTab} style={{ background: "#fff", padding: "16px 24px", height: 450 }}>
                                        <TabPane tab={"Progress Entri"} key="entri">
                                            <div style={{ height: 330, width: '100%' }}>
                                                <Bar data={dataBarEntri} keys={['Telah Dientri', 'Belum Dientri']} onClickKab={this.onClickKabEntri} />
                                            </div>
                                        </TabPane>
                                        <TabPane tab={"Progress Persetujuan"} key="persetujuan">
                                            <div style={{ height: 330, width: '100%' }}>
                                                <Bar data={dataBarApprove} keys={['Disetujui', 'Belum Disetujui']} onClickKab={this.onClickKab} />
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Card title="Top Visitor" bordered={false} style={{ height: 450 }}>
                                        <List
                                            loading={!topVisitor.length}
                                            size="small"
                                            locale={{ emptyText: 'Tidak ada data' }}
                                            itemLayout="horizontal"
                                            dataSource={topVisitor}
                                            renderItem={user => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar src={`/static/${user.profil ? user.profil : 'institusi'}.png`} />}
                                                        title={user.name}
                                                    />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{user.visit_count}</Text>
                                                </List.Item>)
                                            }
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[8, 0]} style={{ marginTop: 16 }}>
                                <Col xs={24} md={18}>
                                    <Card title="Aktivitas Tabel" bordered={false} style={{ height: 450 }}>
                                        <div style={{ height: 330, width: '100%' }}>
                                            <ResponsiveLine
                                                data={aktivitas_tabel}
                                                margin={{ top: 35, right: 25, bottom: 55, left: 60 }}
                                                enableSlices="x"
                                                xScale={{ type: 'point' }}
                                                yScale={{ type: 'linear', min: '0', max: max_count + 5, stacked: false, reverse: false }}
                                                curve="natural"
                                                axisTop={null}
                                                axisRight={null}
                                                axisBottom={{
                                                    orient: 'bottom',
                                                    tickSize: 5,
                                                    tickPadding: 5,
                                                    tickRotation: 0,
                                                    legend: 'Tanggal',
                                                    legendOffset: 45,
                                                    legendPosition: 'middle'
                                                }}
                                                axisLeft={{
                                                    orient: 'left',
                                                    tickSize: 5,
                                                    tickPadding: 5,
                                                    tickRotation: 0,
                                                    legend: 'Jumlah Tabel',
                                                    legendOffset: -50,
                                                    legendPosition: 'middle'
                                                }}
                                                colors={{ scheme: 'set2' }}
                                                lineWidth={4}
                                                enablePoints={false}
                                                enableArea={true}
                                                areaOpacity={0.35}
                                                crosshairType="bottom-left"
                                                useMesh={true}
                                                legends={[
                                                    {
                                                        anchor: 'top',
                                                        direction: 'row',
                                                        justify: false,
                                                        translateX: 0,
                                                        translateY: -40,
                                                        itemsSpacing: 0,
                                                        itemDirection: 'left-to-right',
                                                        itemWidth: 87,
                                                        itemHeight: 34,
                                                        itemOpacity: 0.75,
                                                        symbolSize: 16,
                                                        symbolShape: 'circle',
                                                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                                        effects: [
                                                            {
                                                                on: 'hover',
                                                                style: {
                                                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                                                    itemOpacity: 1
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]}
                                                motionStiffness={230}
                                                motionDamping={24}
                                                theme={
                                                    { fontSize: '13px' }
                                                }
                                            />
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Card title="Pengguna Online" bordered={false} style={{ height: 450 }}>
                                        <List
                                            size="small"
                                            locale={{ emptyText: 'Tidak ada pengguna online' }}
                                            itemLayout="horizontal"
                                            dataSource={onlineUser}
                                            renderItem={user => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar src={`/static/${user.profil ? user.profil : 'institusi'}.png`} />}
                                                        title={<Badge status='processing' text={user.name} />}
                                                    />
                                                </List.Item>)
                                            }
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Fragment>)
                }
            </Fragment>
        )
    }
}