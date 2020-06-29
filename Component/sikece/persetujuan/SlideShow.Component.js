import { Row, Col, Progress, Button, Space, Table, Tooltip, Spin, Modal, Alert, Form, Input } from 'antd';
const { TextArea } = Input
import { ArrowRightOutlined, ArrowLeftOutlined, LeftOutlined, RightOutlined, CheckOutlined, CloseOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Fragment } from 'react';
import { getKec, setIsApprove } from "../../../redux/actions/master.action"

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

export default class SlideShow extends React.Component {
    state = {
        xl: 24,
        xxl: 24,
        loadingSetuju: false,
        loadingTdkSetuju: false,
        arsipModalVisible: false,
        index_arsip: 0,
        pesanPenyData: undefined,
        isApproved: true,
    }
    getJumlahData = (activeData, _idKolom) => {
        if (activeData) {
            let lastBaris = activeData.all_data[activeData.all_data.length - 1]
            for (var property in lastBaris) {
                if (lastBaris.hasOwnProperty(property)) {
                    if (property === _idKolom) return lastBaris[property]
                }
            }
        } else return ''
    }
    getBarisDataSource = (baris, kec, activeData) => {
        const { all_variable_obj, all_kec_obj, all_deskel } = this.props;
        let judul_baris = [];
        baris.forEach((_id, i) => {
            if (all_variable_obj[_id].name.match(/^Desa\s?\/?\s?(Kelurahan)?\s?$/)) {
                const deskel = all_deskel.filter(d => (d.kec === kec))
                if (deskel.length) {
                    deskel.forEach((d, i) => {
                        judul_baris.push({ '_id': d._id, 'baris_var': `${d.kode} ${d.name}` })
                    })
                } else {
                    judul_baris.push({ '_id': _id, 'baris_var': all_variable_obj[_id].name })
                }
            } else if (all_variable_obj[_id].name.match(/^Jumlah|Total\s?$/) && i === baris.length - 1) {
                //not pushing
            } else {
                judul_baris.push({ '_id': _id, 'baris_var': all_variable_obj[_id].name })
            }
        })
        if (activeData) {
            activeData.all_data && judul_baris.forEach((data, i) => {
                activeData.all_data.forEach(row => {
                    if (data._id === row._idBaris) {
                        judul_baris[i] = { ...data, ...row }
                    }
                })
            })
        }
        return judul_baris
    }
    formRef = React.createRef();
    getDynamicTable = (baris, kolom, nomor_tabel, judul, sumber, catatan, kec, activeData) => {
        const { all_variable_obj, all_kec_obj } = this.props;
        let sumberA, catatanA, ketA
        if (activeData) {
            sumberA = activeData.sumber !== undefined ? activeData.sumber : undefined
            catatanA = activeData.catatan !== undefined ? activeData.catatan : undefined
            ketA = activeData.ket !== undefined ? activeData.ket : undefined
        }
        const { needFenomena, needFenomenaQ, pesanPenyData } = activeData
        return <Row>
            <Col xs={24}>
                <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24}>
                        <strong>{`Tabel ${nomor_tabel ? nomor_tabel : '[Nomor Tabel]'}`}</strong>
                    </Col>
                </Row>
                <Row justify="center" style={{ textAlign: "center" }} gutter={[0, 16]}>
                    <Col xs={24}>
                        <strong>{judul ? judul.replace('{nama}', all_kec_obj[kec] ? all_kec_obj[kec].name : 'A') : '[Judul Tabel]'}</strong>
                    </Col>
                </Row>
                <Row gutter={[0, 8]}>
                    <Col xs={24}>
                        {all_variable_obj !== {} && baris.length && kolom.length ? <Table
                            size="small"
                            bordered
                            columns={(() => {
                                const parents = {}
                                const cols = []
                                let judul_kelompok_baris = ''
                                baris.forEach((_idBaris, i) => {
                                    if (all_variable_obj[_idBaris].kelompok && judul_kelompok_baris === '') judul_kelompok_baris = all_variable_obj[_idBaris].kelompok
                                })
                                cols.push({
                                    title: judul_kelompok_baris === '' ? all_variable_obj[baris[0]].name : judul_kelompok_baris,
                                    dataIndex: "baris_var"
                                })
                                kolom.forEach((_idKolom, i) => {
                                    if (all_variable_obj[_idKolom].kelompok !== "-" && all_variable_obj[_idKolom].kelompok !== "" && all_variable_obj[_idKolom].kelompok) {
                                        if (!parents[all_variable_obj[_idKolom].kelompok]) {
                                            parents[all_variable_obj[_idKolom].kelompok] = {};
                                            parents[all_variable_obj[_idKolom].kelompok].indexAnggota = [];
                                        }
                                        parents[all_variable_obj[_idKolom].kelompok].indexAnggota.push(_idKolom)
                                    } else {
                                        if (!parents[`no_parents_${i}`]) {
                                            parents[`no_parents_${i}`] = {};
                                            parents[`no_parents_${i}`].indexAnggota = [];
                                        }
                                        parents[`no_parents_${i}`].indexAnggota.push(_idKolom)
                                    }
                                })
                                for (var parent in parents) {
                                    if (parents.hasOwnProperty(parent)) {
                                        if (parent.includes('no_parents')) {
                                            cols.push({
                                                title: all_variable_obj[parents[parent].indexAnggota[0]].name,
                                                dataIndex: all_variable_obj[parents[parent].indexAnggota[0]]._id,
                                                align: 'right'
                                            })
                                        } else {
                                            const calon_col = {}
                                            calon_col.title = parent
                                            calon_col.children = parents[parent].indexAnggota.map(indexVar => ({
                                                title: all_variable_obj[indexVar].name,
                                                dataIndex: all_variable_obj[indexVar]._id,
                                                align: 'right'
                                            }));
                                            cols.push(calon_col)
                                        }
                                    }
                                }
                                return cols
                            })()}
                            dataSource={this.getBarisDataSource(baris, kec, activeData)}
                            pagination={false}
                            rowKey="_id"
                            summary={() => (this.props.all_variable_obj[baris[baris.length - 1]].name.match(/^Jumlah|Total\s?$/) ?
                                <Table.Summary.Row style={{ background: '#fafafa', textAlign: 'right' }}>
                                    <Table.Summary.Cell index={0} key={0}><strong style={{ float: 'left' }}>{this.props.all_variable_obj[baris[baris.length - 1]].name}</strong></Table.Summary.Cell>
                                    {kolom.map((k, i) => <Table.Summary.Cell index={i + 1} key={i}><strong>{this.getJumlahData(activeData, k)}</strong></Table.Summary.Cell>)}
                                </Table.Summary.Row> : undefined)
                            }
                        /> : 'Belum ada Variabel'}
                    </Col>
                </Row>
                {sumberA ? <Row>
                    <Col xs={24}>
                        <span style={{ float: "left" }}>Sumber: {sumberA}</span>
                    </Col>
                </Row> : null}
                {catatanA ? <Row>
                    <Col xs={24}>
                        <span style={{ float: "left" }}>Catatan: {catatanA}</span>
                    </Col>
                </Row> : null}
                {ketA ? <Row>
                    <Col xs={24}>
                        <span style={{ float: "left" }}>Keterangan: {ketA}</span>
                    </Col>
                </Row> : null}
                {needFenomena ? <Row style={{ textAlign: "left", marginTop: 8 }}>
                    <Col xs={24}>
                        <Alert
                            message="Permintaan Penjelasan"
                            description={needFenomenaQ}
                            type="warning"
                            showIcon
                            icon={<QuestionCircleOutlined />}
                        />
                    </Col>
                </Row> : null}
                <Row style={{ marginTop: 8, textAlign: "left" }}>
                    <Col xs={24}>
                        <Form
                            ref={this.formRef}
                            layout="vertical"
                            onValuesChange={(changedValues) => this.setState(changedValues)}
                        >
                            <Form.Item
                                label="Kirim pesan"
                                name="pesanPenyData"
                                rules={[
                                    {
                                        required: needFenomena || !this.state.isApproved,
                                        message: 'Mohon ketik pesan Anda jika terdapat Permintaan Penjelasan dari kami atau memilih Belum Setuju',
                                    },
                                ]}
                                initialValue={pesanPenyData}
                            >
                                <TextArea
                                    allowClear
                                    placeholder="Ketikkan pesan"
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    }
    setTableWidth = (columnCount, type) => {
        const xl = 5 + 3 * columnCount
        const xxl = 5 + 2 * columnCount
        this.setState({ xl: xl < 25 ? xl : 24, xxl: xxl < 25 ? xxl : 24 })
    }
    onClickNextArsip = (prevIndex, maxIndex) => {
        const newIndex = prevIndex + 1 > maxIndex ? 0 : prevIndex + 1
        this.setState({ index_arsip: newIndex })
    }
    onClickPrevArsip = (prevIndex, maxIndex) => {
        const newIndex = prevIndex - 1 < 0 ? maxIndex : prevIndex - 1
        this.setState({ index_arsip: newIndex })
    }
    onClickApprove = (isApproved) => {
        const { tables, active_index } = this.props
        this.setState({ isApproved }, () => {
            this.formRef.current.validateFields(['pesanPenyData']);
            const { needFenomena } = tables[active_index].all_data
            const { pesanPenyData } = this.state
            if (pesanPenyData || ((needFenomena || !isApproved) && pesanPenyData) || (isApproved && !needFenomena)) {
                this.setState({ [isApproved ? 'loadingSetuju' : 'loadingTdkSetuju']: true }, () => {
                    const { tables, active_index } = this.props
                    const { _idKec, _idTable } = tables[active_index]
                    this.props.dispatch(setIsApprove(this.props.socket, { _idKec, _idTable, isApproved, pesanPenyData }, this.props, () => this.props.dispatch(getKec(this.props.socket, () => {
                        this.setState({ [isApproved ? 'loadingSetuju' : 'loadingTdkSetuju']: false, pesanPenyDataCurrent: this.state.pesanPenyData })
                    }))))
                })
            }
        })
    }
    getPreviewArsip = (fileName) => {
        if (!fileName) {
            return <span>Tidak ada arsip</span>
        } else if (fileName.match(/\.(jpeg|jpg|png)$/)) {
            return <img alt={fileName} style={{ width: '100%' }} src={`http://${window.location.hostname}/view/arsip/${fileName}`} />
        } else if (fileName.match(/\.pdf$/)) {
            return <iframe type="application/pdf" width="100%" height="690" frameBorder="0" src={this.props.url || `http://${window.location.hostname}/view/arsip/${fileName}`}></iframe>
        } else {
            return <span>Klik untuk mengunduh file: <a href={`http://${window.location.hostname}/sikece/other/arsip/${fileName}`}>{fileName}</a></span>
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.active_index !== prevProps.active_index) {
            this.setState({ isApproved: true }, () => {
                this.formRef.current&&this.formRef.current.validateFields(['pesanPenyData']);
                this.setTableWidth(this.props.tables[this.props.active_index] ? this.props.tables[this.props.active_index].kolom.length : 2)
                const pesanPenyData = this.props.tables[this.props.active_index] ? this.props.tables[this.props.active_index].all_data.pesanPenyData : ""
                this.setState({ pesanPenyData, pesanPenyDataCurrent: pesanPenyData }, () => {
                    this.formRef.current&&this.formRef.current && this.formRef.current.setFieldsValue({
                        pesanPenyData
                    })
                })
            })
        }
    }
    render() {
        const { active_user: { kec, table }, all_variable, all_kec, tables, active_index, onClickNext, onClickPrev, onCariIndex } = this.props
        const { xxl, xl, loadingSetuju, loadingTdkSetuju, arsipModalVisible, index_arsip, pesanPenyData, pesanPenyDataCurrent } = this.state
        const total = kec ? kec.length * table.length : 0
        const approved = kec ? [].concat(...tables).filter(item => item.isApproved).length : 0
        const persentase = kec ? (approved / total * 100) : 0
        const active_table = active_index !== undefined ? tables[active_index] : undefined;
        const all_data = active_table ? active_table.all_data : undefined;
        const arsip = all_data ? all_data.arsip : [];

        return (
            <Fragment>
                <Row gutter={[0, 16]}>
                    <Col xs={22}>
                        <Tooltip title={`${approved} dari ${total} tabel telah disetujui (${Math.round(approved / total * 100)}%)`}>
                            <Progress
                                percent={persentase} status={persentase < 100 ? "active" : undefined} strokeWidth={15}
                                format={(percent, successPercent) => kec ?
                                    (`${approved} dari ${total} Tabel`)
                                    : <LoadingOutlined />}
                            />
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={[0, 16]}>
                    <Col xs={24} style={{ textAlign: "center" }}>
                        <Space align="center">
                            <Tooltip title="Tabel sebelumnya">
                                <Button disabled={active_index === undefined} type="primary" onClick={onClickPrev} shape="circle" icon={<ArrowLeftOutlined />} />
                            </Tooltip>
                            <Tooltip title="Tabel berikutnya">
                                <Button disabled={active_index === undefined} type="primary" onClick={onClickNext} shape="circle" icon={<ArrowRightOutlined />} />
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>
                <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={24} xl={xl} xxl={xxl}>
                        <Spin spinning={!tables.length || !all_kec.length || !all_variable.length || onCariIndex}>
                            {active_index !== undefined && all_kec.length && all_variable.length ?
                                this.getDynamicTable(
                                    tables[active_index].baris,
                                    tables[active_index].kolom,
                                    tables[active_index].nomor_tabel,
                                    tables[active_index].judul,
                                    tables[active_index].sumber,
                                    tables[active_index].catatan,
                                    tables[active_index]._idKec,
                                    tables[active_index].all_data
                                ) : <p style={{ margin: "32px 0" }}><strong>Belum ada tabel yang tersedia untuk disetujui.</strong></p>}
                        </Spin>
                    </Col>
                </Row>
                <Row gutter={[0, 32]}>
                    <Col xs={24} style={{ textAlign: "center" }}>
                        <Space align="center">
                            <Button loading={loadingSetuju} disabled={ pesanPenyData===pesanPenyDataCurrent && (active_index === undefined || (active_index !== undefined ? tables[active_index].isApproved === true : false))} icon={<CheckOutlined />} onClick={() => this.onClickApprove(true)}>Setujui</Button>
                            <Button loading={loadingTdkSetuju} disabled={ pesanPenyData===pesanPenyDataCurrent && (active_index === undefined || (active_index !== undefined ? tables[active_index].isApproved === false : false))} icon={<CloseOutlined />} onClick={() => this.onClickApprove(false)}>Belum Setuju</Button>
                            <Tooltip title={active_index !== undefined ? (tables[active_index].all_data.arsip.length ? "Lihat arsip" : "Tidak ada arsip") : "Tidak ada arsip"}>
                                <Button disabled={active_index !== undefined ? !tables[active_index].all_data.arsip.length : true} onClick={() => this.setState({ arsipModalVisible: true })}>Lihat Arsip</Button>
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>
                <Modal
                    title={`Arsip`}
                    visible={arsipModalVisible}
                    maskClosable={false}
                    onCancel={() => this.setState({ arsipModalVisible: false })}
                    footer={[
                        <Button key="back" type="primary" onClick={() => this.setState({ arsipModalVisible: false })}>
                            Kembali
                        </Button>
                    ]}
                >
                    {arsip.length ? (
                        <Fragment>
                            <Row>
                                <Col xs={24} style={{ textAlign: "center" }}>
                                    <Space align="center">
                                        <Tooltip title="Arsip sebelumnya">
                                            <Button disabled={active_index !== undefined ? tables[active_index].all_data.arsip.length < 2 : true} onClick={() => this.onClickPrevArsip(index_arsip, active_index !== undefined ? tables[active_index].all_data.arsip.length - 1 : 1)} shape="circle" icon={<LeftOutlined />} />
                                        </Tooltip>
                                        <Tooltip title="Arsip berikutnya">
                                            <Button disabled={active_index !== undefined ? tables[active_index].all_data.arsip.length < 2 : true} onClick={() => this.onClickNextArsip(index_arsip, active_index !== undefined ? tables[active_index].all_data.arsip.length - 1 : 1)} shape="circle" icon={<RightOutlined />} />
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                            <Row justify="center" style={{ textAlign: "center", marginTop: 8 }}>
                                <Col xs={24}>
                                    {this.getPreviewArsip(arsip[index_arsip])}
                                </Col>
                            </Row>
                        </Fragment>
                    ) : null}
                </Modal>
            </Fragment>
        )
    }
}