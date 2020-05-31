import { Row, Col, Button, List, Skeleton, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import BasicForm from './Lainnya/BasicForm.Tabel.Component'
import { Fragment } from 'react';

export default class LihatTabel_Tabel extends React.Component {
    render() {
        const { babs, tabels, kecData, xs, md } = this.props
        const { loadDataKec, onClickEntri } = this.props
        return (
            <Col xs={xs} md={md}>
                <Row gutter={[64, 0]}>
                    <Col xs={24} md={16}>
                        <Row>
                            <Col xs={24}>
                                <BasicForm withAllBab defaultValue="Semua" kecData={kecData} loadDataKec={loadDataKec} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {babs.map(b => <Fragment key={b.nomor}>
                    <Row>
                        <Col xs={24}><strong>Bab {b.nomor} {b.name}</strong></Col>
                    </Row>
                    <Row>
                        <Col xs={19}>
                            <List
                                loading={false}
                                itemLayout="horizontal"
                                dataSource={tabels.filter(t => (t.bab === b.name))}
                                renderItem={tabel => (<List.Item
                                    actions={[<a key="list-loadmore-edit" onClick={()=>onClickEntri(`${tabel.nomor} ${tabel.judul}, ${tabel.tahun}`)}>entri</a>, <a key="list-loadmore-more">hapus data</a>]}
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