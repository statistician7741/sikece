import { Row, Col, Button, List, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import BasicForm from './BasicForm.Tabel.Component'

export default class LihatTabel_Tabel extends React.Component {
    render() {
        const { babs, tabels, kecData, xs, md } = this.props
        const { loadDataKec } = this.props
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 16]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Lihat Tabel</strong></Col>
                        </Row>
                        <Row>
                            <Col xs={24}>
                                <BasicForm bab kecData={kecData} loadDataKec={loadDataKec} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={[0, 8]}><Col><strong>Tabel Baru</strong></Col></Row>
                        <Row><Col><Button type="primary"><PlusOutlined /> Tambah</Button></Col></Row>
                    </Col>
                </Row>
                {babs.map(b => <>
                    <Row>
                        <Col span={12}><strong>Bab {b.nomor} {b.name}</strong></Col>
                    </Row>
                    <List
                        loading={false}
                        itemLayout="horizontal"
                        dataSource={tabels.filter(t => (t.bab === b.name))}
                        renderItem={tabel => (<List.Item
                            actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">hapus</a>]}
                        >
                            <Skeleton title={false} loading={false} active>
                                <List.Item.Meta
                                    title={<span>{tabel.nomor} {tabel.judul}, {tabel.tahun}</span>}
                                />
                            </Skeleton>
                        </List.Item>)
                        }
                    />
                </>)}
            </Col>
        )
    }
}