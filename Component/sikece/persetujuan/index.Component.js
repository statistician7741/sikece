import dynamic from 'next/dynamic';
import { Row, Col, PageHeader, Progress, Button, Space, Table, Tag, Carousel } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default class IndexApproval extends React.Component {
    state = {
        dataIndikators: [{
            _id: 1,
            name: 'Tabel 1.2 Dusun dan Dasawisma di Kecamatan Pasarwajo (Hektar), 2019',
            status: 'Desetujui',
            ket: "-",
            judul_baris: {
                _id: 'a',
                name: 'Desa/Kelurahan',
                vars: ['Holimombo Jaya', 'Kondowa', 'Dongkala', 'Holimombo', 'Takimpo', 'Kombeli', 'Awainulu']
            },
            judul_kolom: [{
                _id: 'b',
                name: 'Jumlah penduduk',
                vars: [
                    ["Laki-laki", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Perempuan", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Jumlah", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                    ["Rasio Jenis Kelamin", "%", "Angka", 2, 'Pie', '-', "-"],
                ]
            }, {
                _id: 'c',
                name: 'Kematian',
                vars: [
                    ["Kematian", "Jiwa", "Angka", 0, 'Bar', '-', "-"],
                ]
            }, {
                _id: 'd',
                name: 'Kelahiran',
                vars: [
                    ["Kelahiran", "Jiwa", "Angka", 0, 'Bar', 'Penduduk', "-"],
                ]
            }],
        }]
    }
    render() {
        const { dataIndikators } = this.state

        const columns = [{
            title: 'Judul Tabel',
            dataIndex: 'name',
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            },
        }, {
            title: 'Status',
            dataIndex: 'status',
            render: (value, record) => (<Tag color="#87d068">{value}</Tag>)
        },
        {
            title: 'Keterangan',
            dataIndex: 'ket'
        }]

        const sliderSettings = {
            dots: true,
            fade: false
        };

        return (
            <PageHeader
                className="site-page-header"
                title="Persetujuan Data"
            >
                <Row gutter={[0, 16]}>
                    <Col xs={22} md={15}>
                        <Progress
                            percent={45} status="active" strokeWidth={15}
                            format={(percent, successPercent)=>{
                                return "5 dari 11 Tabel"
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={15}>
                        <Carousel
                            {...sliderSettings}
                            ref={c => {
                                this.slider = c;
                            }}
                        >
                            <div key="1">
                                <Row gutter={[0, 8]}>
                                    <Col xs={24} md={24}>
                                        <strong style={{ fontSize: 16 }}>Tabel 1.1 Luas Wilayah di Kecamatan Pasarwajo (Hektar), 2019</strong>
                                    </Col>
                                </Row>
                                <Row gutter={[0, 16]}>
                                    <Col xs={24}>
                                        <Table
                                            size="small"
                                            bordered
                                            columns={(() => {
                                                const parents = {}
                                                const cols = []
                                                cols.push({
                                                    title: dataIndikators[0].judul_baris.name,
                                                    dataIndex: "baris_var"
                                                })
                                                dataIndikators[0].judul_kolom[0].vars.forEach((v, i) => {
                                                    if (v[5] !== "-" && v[5] !== "") {
                                                        if (!parents[v[5]]) {
                                                            parents[v[5]] = {};
                                                            parents[v[5]].indexAnggota = [];
                                                        }
                                                        parents[v[5]].indexAnggota.push(i)
                                                    } else {
                                                        if (!parents[`no_parents_${i}`]) {
                                                            parents[`no_parents_${i}`] = {};
                                                            parents[`no_parents_${i}`].indexAnggota = [];
                                                        }
                                                        parents[`no_parents_${i}`].indexAnggota.push(i)
                                                    }
                                                })
                                                for (var parent in parents) {
                                                    if (parents.hasOwnProperty(parent)) {
                                                        if (parent.includes('no_parents')) {
                                                            cols.push({
                                                                title: dataIndikators[0].judul_kolom[0].vars[parents[parent].indexAnggota[0]][0],
                                                                dataIndex: "data"
                                                            })
                                                        } else {
                                                            const calon_col = {}
                                                            calon_col.title = parent
                                                            calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                                title: dataIndikators[0].judul_kolom[0].vars[indexVar][0],
                                                                dataIndex: "data"
                                                            }));
                                                            cols.push(calon_col)
                                                        }
                                                    }
                                                }
                                                return cols
                                            })()}
                                            dataSource={dataIndikators[0].judul_baris.vars.map((d, i) => ({ '_id': i, 'baris_var': d, 'data': "data" }))}
                                            pagination={false}
                                            rowKey="_id"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24}>
                                        Sumber: Desa/Kelurahan
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24}>
                                        Catatan: -
                                    </Col>
                                </Row>
                            </div>
                            <div key="2">
                                <Row gutter={[0, 8]}>
                                    <Col xs={24} md={24}>
                                        <strong style={{ fontSize: 16 }}>Tabel 1.2 Dusun dan Dasawisma di Kecamatan Pasarwajo (Hektar), 2019</strong>
                                    </Col>
                                </Row>
                                <Row gutter={[0, 16]}>
                                    <Col xs={24}>
                                        <Table
                                            size="small"
                                            bordered
                                            columns={(() => {
                                                const parents = {}
                                                const cols = []
                                                cols.push({
                                                    title: dataIndikators[0].judul_baris.name,
                                                    dataIndex: "baris_var"
                                                })
                                                dataIndikators[0].judul_kolom[0].vars.forEach((v, i) => {
                                                    if (v[5] !== "-" && v[5] !== "") {
                                                        if (!parents[v[5]]) {
                                                            parents[v[5]] = {};
                                                            parents[v[5]].indexAnggota = [];
                                                        }
                                                        parents[v[5]].indexAnggota.push(i)
                                                    } else {
                                                        if (!parents[`no_parents_${i}`]) {
                                                            parents[`no_parents_${i}`] = {};
                                                            parents[`no_parents_${i}`].indexAnggota = [];
                                                        }
                                                        parents[`no_parents_${i}`].indexAnggota.push(i)
                                                    }
                                                })
                                                for (var parent in parents) {
                                                    if (parents.hasOwnProperty(parent)) {
                                                        if (parent.includes('no_parents')) {
                                                            cols.push({
                                                                title: dataIndikators[0].judul_kolom[0].vars[parents[parent].indexAnggota[0]][0],
                                                                dataIndex: "data"
                                                            })
                                                        } else {
                                                            const calon_col = {}
                                                            calon_col.title = parent
                                                            calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                                title: dataIndikators[0].judul_kolom[0].vars[indexVar][0],
                                                                dataIndex: "data"
                                                            }));
                                                            cols.push(calon_col)
                                                        }
                                                    }
                                                }
                                                return cols
                                            })()}
                                            dataSource={dataIndikators[0].judul_baris.vars.map((d, i) => ({ '_id': i, 'baris_var': d, 'data': "data" }))}
                                            pagination={false}
                                            rowKey="_id"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24}>
                                        Sumber: Desa/Kelurahan
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24}>
                                        Catatan: -
                                    </Col>
                                </Row>
                            </div>
                            <div key="3">
                                <h3>3</h3>
                            </div>
                            <div key="4">
                                <h3>4</h3>
                            </div>
                        </Carousel>
                    </Col>
                </Row>
                <Row gutter={[0, 16]}>
                    <Col xs={24} md={15} style={{ textAlign: "center" }}>
                        <Space align="center">
                            <Button onClick={() => this.slider.prev()} type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                            <Button onClick={() => this.slider.next()} type="primary" shape="circle" icon={<ArrowRightOutlined />} />
                        </Space>
                    </Col>
                </Row>
                <Row gutter={[0, 16]}>
                    <Col xs={24} md={15} style={{ textAlign: "center" }}>
                        <Space align="center">
                            <Button icon={<CheckOutlined />}>Setujui</Button>
                            <Button icon={<CloseOutlined />}>Blm Setuju</Button>
                            <Button>Lihat Arsip</Button>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Table
                            columns={columns}
                            dataSource={dataIndikators}
                            rowKey="_id"
                        />
                    </Col>
                </Row>
            </PageHeader>
        )
    }
}