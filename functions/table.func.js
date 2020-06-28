const getBarisDataSource = (baris, kec, activeData, all_variable_obj, all_deskel) => {
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
module.exports = {
    getDynamicTable: (baris, kolom, nomor_tabel, judul, sumber, catatan, kec, activeData, all_variable_obj, all_kec_obj, all_deskel) => {
        let sumberA, catatanA
        let arsipA = [];
        if (activeData) {
            sumberA = activeData.sumber ? activeData.sumber : undefined
            catatanA = activeData.catatan ? activeData.catatan : undefined
            arsipA = activeData.arsip ? activeData.arsip : undefined
        }
        return <Row>
            {this.state.expandLoading ? <LoadingOutlined /> : <Col xs={24}>
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
                            dataSource={getBarisDataSource(baris, kec, activeData, all_variable_obj, all_deskel)}
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
                {sumber ? <Row gutter={[0, catatan ? 0 : 16]}>
                    <Col xs={24}>
                        Sumber: {sumberA ? sumberA : sumber.replace('{nama}', all_kec_obj[kec] ? all_kec_obj[kec].name : 'A')}
                    </Col>
                </Row> : null}
                {catatanA || catatan ? <Row>
                    <Col xs={24}>
                        Catatan: {catatanA ? catatanA : (catatan ? catatan.replace('{nama}', all_kec_obj[kec] ? all_kec_obj[kec].name : 'A') : '')}
                    </Col>
                </Row> : null}
                {arsipA.length ? <Row gutter={[0, catatan ? 0 : 16]}>
                    <Col xs={24}>
                        Arsip: {arsipA.length ? activeData.arsip.map(a => (<span key={a}><a href={`http://${window.location.hostname}/sikece/other/arsip/${a}`}>{a}</a><br /></span>)) : null}
                    </Col>
                </Row> : null}
            </Col>}
        </Row>
    }
}