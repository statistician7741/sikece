import dynamic from 'next/dynamic';
import Bar from './Charts/Bar.Monitoring'
import { List, Row, Col, Card, Skeleton, Typography, Tag, Spin, PageHeader } from 'antd';
const { Text, Paragraph } = Typography;
import InfiniteScroll from 'react-infinite-scroller';
import data from './Charts/data'

export default class IndexMasterTabel extends React.Component {
    state = {
        loading: true,
        hasMore: true,
        data: [...data.kab],
        level: 'kec',
        activities: [
            {
                key: "1",
                title: "Puskesmas Lasalimu Selatan",
                status: "Disetujui",
                description: "Tabel 2.3.4 Realisasi Program Imunisasi Bayi dan Ibu Hamil Menurut Jenisnya, 2015-2019",
                time: "14.22 31/05/2020"
            },
            {
                key: "2",
                title: "Kecamatan Pasar Wajo",
                status: "Blm Disetujui",
                description: "Tabel 1.1.1 Luas Daerah dan Jumlah Pulau Menurut Kelurahan/Desa, 2019",
                time: "09.45 11/06/2020"
            },
            {
                key: "3",
                title: "Kecamatan Pasar Wajo",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "09.57 11/06/2020"
            },
            {
                key: "4",
                title: "Kecamatan Lasalimu",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "08.11 11/06/2020"
            },
            {
                key: "5",
                title: "Kecamatan Lasalimu Selatan",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "13.32 11/06/2020"
            },
            {
                key: "6",
                title: "Kecamatan Siotapina",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "09.57 11/06/2020"
            },
            {
                key: "7",
                title: "Kecamatan Pasar Wajo",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "14.54 11/06/2020"
            },
            {
                key: "8",
                title: "Kecamatan Pasar Wajo",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "09.57 11/06/2020"
            },
            {
                key: "9",
                title: "Kecamatan Wolowa",
                status: "Disetujui",
                description: "Tabel 1.1.2 Jarak dari Ibukota Kecamatan dan Ibukota Kabupaten Menurut Kelurahan/Desa, 2019",
                time: "12.59 11/06/2020"
            }
        ]
    }
    onClickKab = () => this.setState({ level: this.state.level === 'kec' ? 'kab' : 'kec', data: [...data[this.state.level]] })

    render() {
        const { data, activities, loading, hasMore } = this.state
        return (
            <PageHeader
                className="site-page-header"
                title="Monitoring"
            >
                <Row gutter={[8, 16]}>
                    <Col xs={24} md={16}>
                        <Card title="Progress Persetujuan Data menurut Kabupaten (%)">
                            <div style={{ height: 300, width: '100%' }}>
                                <Bar data={data} onClickKab={this.onClickKab} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
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
                    </Col>
                </Row>
            </PageHeader>
        )
    }
}