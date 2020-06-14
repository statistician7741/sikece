import { Row, Col, Button, List, Skeleton, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import BasicForm from './Lainnya/BasicForm.Tabel.Component'
import { Fragment } from 'react';

export default class LihatTabel_Tabel extends React.Component {
    render() {
        const { babs, tables, kecData, xs, md } = this.props
        const { loadDataKec } = this.props
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={16}>
                        <Row gutter={[0, 8]}>
                            <Col xs={24}><strong>Daftar Tabel</strong></Col>
                        </Row>
                        <Row>
                            <Col xs={24}>
                                <BasicForm withAllBab defaultValue="Semua" kecData={kecData} loadDataKec={loadDataKec} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={[0, 8]}><Col><strong>Tabel Baru</strong></Col></Row>
                        <Row><Col><Button type="primary"><PlusOutlined /> Tambah</Button></Col></Row>
                    </Col>
                </Row>
                {babs.map(b => <Fragment key={b.nomor}>
                    <Row>
                        <Col xs={24}><Divider orientation="left" plain>Bab {b.nomor} {b.name}</Divider></Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <List
                                loading={false}
                                itemLayout="horizontal"
                                dataSource={tables.filter(t => (t.bab === b.name))}
                                renderItem={tabel => (<List.Item
                                    actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">hapus</a>]}
                                >
                                    <Skeleton title={false} loading={false} active>
                                        <List.Item.Meta
                                            description={<span className='dt'>{tabel.nomor} {tabel.judul}, {tabel.tahun}</span>}
                                        />
                                    </Skeleton>
                                </List.Item>)
                                }
                            />
                        </Col>
                    </Row>
                </Fragment>)}
            </Col>
        )
    }
}