const Table = require('../../models/Table.model');
const User = require('../../models/User.model');
const Variable = require('../../models/Variable.model');
const Deskel = require('../../models/Deskel.model');
const Kec = require('../../models/Kec.model');
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs')
const async = require('async')
const static_path = __dirname + "/../../public/static/"
const moment = require('moment')

module.exports = (input, cb, client) => {
    const { user_id, jenis_pengguna } = client.handshake.cookies
    async.auto({
        getUser: cb_getUser => {
            if (jenis_pengguna) {
                if (['pengentri', 'peny_data'].includes(jenis_pengguna)) {
                    User.findOne({ _id: user_id }, (err, user) => {
                        if (err) {
                            cb_getUser(err_code.ERROR_ACCESS_DB, null)
                        } else {
                            cb_getUser(null, user)
                        }
                    })
                } else {
                    cb_getUser(null, null)
                }
            } else {
                cb_getUser(null, null)
            }
        },
        getVar: cb_getVar => {
            Variable.find({}).sort('name').exec((err, result) => {
                if (err) {
                    cb_getVar(err_code.ERROR_ACCESS_DB, null)
                } else {
                    let all_variable_obj = {}
                    if (result.length) {
                        result.forEach(v => {
                            all_variable_obj[v._id] = v
                        });
                    }
                    cb_getVar(null, { all_variable_obj })
                }
            })
        }
    }, (err, { getUser, getVar }) => {
        if (err) {
            cb({ 'type': 'error', 'data': err })
        } else {
            const q = input.bab === 'all_bab' ? { bab: new RegExp(input.selectedYear, "i") } : { bab: input.bab }
            Table.find(q).exec((err, tables) => {
                if (err) {
                    console.log(err);
                    cb({ 'type': 'error', 'data': err })
                } else {
                    Kec.findOne({ _id: input.kec }, (e, kec_result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            const q = getUser ? { 'kec': { '$in': getUser.kec } } : {}
                            Deskel.find(q).sort('kode').exec((err, all_deskel) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    const all_table = tables.map(a => ({ ...a._doc, nomor_tabel: a.nomor_tabel.split('.').map(n => +n + 100000).join('.') })).sort((a, b) => (a.nomor_tabel > b.nomor_tabel) ? 1 : -1)
                                        .map(a => ({ ...a, nomor_tabel: a.nomor_tabel.split('.').map(n => +n - 100000).join('.') }))
                                    const all_kec_table_obj = {}
                                    all_kec_table_obj[kec_result._id] = {}
                                    if (kec_result.table) {
                                        kec_result.table.forEach(w => {
                                            all_kec_table_obj[kec_result._id][w._idTable] = w
                                        });
                                    }
                                    // console.log(all_kec_table_obj)
                                    // console.log(all_table[0])
                                    // console.log(getVar.all_variable_obj)
                                    if (all_table.length) {
                                        let file_name = `[${input.kec}] KCDA ${input.selectedYear} - Tabel ${input.bab_name}.xlsx`
                                        XlsxPopulate.fromFileAsync(static_path + "/template_table.xlsx")
                                            .then(workbook => {
                                                let task = []
                                                all_table.forEach((t, i) => {
                                                    const header = getHeader(getVar.all_variable_obj, t.baris, t.kolom)
                                                    const data_entried = all_kec_table_obj[kec_result._id][t._id] ? all_kec_table_obj[kec_result._id][t._id] : {}
                                                    const data = getBarisDataSource(
                                                        getVar.all_variable_obj,
                                                        all_deskel,
                                                        t.baris,
                                                        t.kolom,
                                                        input.kec,
                                                        data_entried
                                                    )
                                                    let sheet = i===0?workbook.sheet(i):workbook.addSheet(t.nomor_tabel, i);
                                                    i===0&&sheet.name(t.nomor_tabel)
                                                    task.push((cb_s) => {
                                                        setData2Xlsx(t, sheet, input, header, data_entried, data, cb_s)
                                                    })
                                                })

                                                async.series(task, (er, fi) => {
                                                    if (fs.existsSync(static_path + `/${file_name}`)) {
                                                        fs.unlinkSync(static_path + `/${file_name}`);
                                                    }
                                                    workbook.toFileAsync(static_path + `/${file_name}`);
                                                })
                                            }).then(data => {
                                                setTimeout(() => {
                                                    cb({ 'type': 'ok', 'data': file_name })
                                                }, 4000)
                                                setTimeout(() => {
                                                    if (fs.existsSync(static_path + `/${file_name}`)) {
                                                        fs.unlinkSync(static_path + `/${file_name}`);
                                                    }
                                                }, 30000)
                                            })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

function setData2Xlsx(t, sheet, input, header, data_entried, data, cb_s) {
    let nomor_tabel = [`Tabel ${t.nomor_tabel}`, t.judul.replace('{nama}', input.nama_kec)]
    let colEnd = 1
    let rowEnd = 1
    let cols = []
    let colsTempPos = 0
    let colsWidth = []
    if (header[1]) {
        let newIndex0 = []
        header[0].forEach((parent, i) => {
            if (typeof parent === 'string') {
                newIndex0.push(parent)
                cols.push({ 'type': 'v', 'pos': i + 1 + colsTempPos })
                if (i !== 0) {
                    colsWidth.push({ 'cellChar': (i + 1 + colsTempPos + 9).toString(36).toUpperCase(), 'w': parent.length * 1.2 })
                }
            }
            else {
                cols.push({ 'type': 'h', 'pos': i + 1 + colsTempPos, 'colspan': parent.colspan - 1 })
                colsTempPos = colsTempPos + parent.colspan - 1
                for (let pos = 0; pos < parent.colspan; pos++) {
                    newIndex0.push(pos === 0 ? parent.label : undefined)
                }
            }
        })
        header[0] = newIndex0
        header[1].forEach((headerText, i) => {
            nomor_tabel.push(undefined)
            if (headerText.length && i) colsWidth.push({ 'cellChar': (i + 1 + 9).toString(36).toUpperCase(), 'w': headerText.length * 1.2 })
        })
        colEnd = header[1].length
        rowEnd = data.length + 4
    } else {
        header[0].forEach((headerText, i) => {
            nomor_tabel.push(undefined)
            if (i !== 0) {
                colsWidth.push({ 'cellChar': (i + 1 + 9).toString(36).toUpperCase(), 'w': headerText.length * 1.2 })
            }
        })
        colEnd = header[0].length
        rowEnd = data.length + 3
    }
    let arr = [
        nomor_tabel,
        [],
        ...header,
        ...data,
        [`Sumber: ${data_entried.sumber || ''}`]
    ]
    if (data_entried.catatan) arr.push([`Catatan: ${data_entried.catatan || ''}`])
    sheet.cell("A1").value(arr)

    //style
    cols.forEach(col => {
        let cellChar = (col.pos + 9).toString(36).toUpperCase()
        col.type === 'v' && sheet.range(`${cellChar}` + 3 + `:${cellChar}` + 4).style({ 'horizontalAlignment': 'center', 'verticalAlignment': 'center' }).merged(true)
        col.type === 'h' && sheet.range(`${cellChar}` + 3 + `:${(col.pos + col.colspan + 9).toString(36).toUpperCase()}` + 3).style({ 'horizontalAlignment': 'center' }).merged(true)
    })
    // sheet.column("B").width(25)
    let maxLength = 1
    data.forEach(row => {
        maxLength = row[0].length > maxLength ? row[0].length : maxLength
    })
    sheet.column("A").width(maxLength * 1.2 > 10 ? maxLength * 1.2 : 10)
    colsWidth.forEach(col => {
        sheet.column(col.cellChar).width(col.w > 9 ? col.w : 9)
    })
    sheet.range('A' + 3 + `:${(colEnd + 9).toString(36).toUpperCase()}` + rowEnd).style({ 'leftBorder': true, 'rightBorder': true, 'bottomBorder': true, 'topBorder': true })
    cb_s(null, 'ok')
}

function getHeader(all_variable_obj, baris, kolom) {
    const parents = {}
    const cols = []
    let position = 0
    //add kolom baris + kolom baris pertama
    let judul_kelompok_baris = ''
    baris.forEach((_idBaris, i) => {
        if (all_variable_obj[_idBaris].kelompok && judul_kelompok_baris === '') judul_kelompok_baris = all_variable_obj[_idBaris].kelompok
    })
    cols.push([judul_kelompok_baris === '' ? all_variable_obj[baris[0]].name : judul_kelompok_baris])
    cols.push(['']) //cols[1] = ['']
    position++; //position = 1
    kolom.forEach((_idKolom, i) => {
        let kelompok = all_variable_obj[_idKolom].kelompok
        if (kelompok !== "-" && kelompok !== "" && kelompok) {
            if (!parents[kelompok]) {
                parents[kelompok] = {};
                parents[kelompok].indexAnggota = [];
            }
            parents[kelompok].indexAnggota.push(_idKolom)
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
                cols[0].push(all_variable_obj[parents[parent].indexAnggota[0]].name)
                position++ //position = 3
                cols[1].push('')
            } else {
                //tambahkan parent di baris pertama col
                cols[0].push({ 'label': parent, 'colspan': parents[parent].indexAnggota.length })
                position++; //position = 2
                //buat row judul kolom utk child
                parents[parent].indexAnggota.forEach(_idKolom => cols[1].push(all_variable_obj[_idKolom].name))
            }
        }
    }
    let isRemoveRow2Header = true;
    cols[1].forEach(h => {
        if (h !== '') isRemoveRow2Header = false
    })
    return isRemoveRow2Header ? [cols[0]] : cols
}

function getBarisDataSource(all_variable_obj, all_deskel, baris, kolom, kec, activeData) {
    // const { all_variable_obj, all_deskel } = this.props;
    let judul_baris = [];
    let data = [];
    let indexKolom = {}
    let indexBaris = {}
    let posBaris = 0
    kolom.forEach((kolom_id, i) => indexKolom[kolom_id] = i + 1)
    baris.forEach((_id, i) => {
        if (all_variable_obj[_id].name.match(/^Desa\s?\/?\s?(Kelurahan)?\s?$/)) {
            const deskel = all_deskel.filter(d => (d.kec === kec))
            if (deskel.length) {
                deskel.forEach((d, i) => {
                    judul_baris.push({ '_id': d._id })
                    data.push([`${d.kode} ${d.name}`])
                    indexBaris[d._id] = posBaris++
                })
            } else {
                judul_baris.push({ '_id': _id })
                data.push([all_variable_obj[_id].name])
                indexBaris[_id] = posBaris++
            }
        } else if (all_variable_obj[_id].name.match(/^Jumlah|Total\s?$/) && i === baris.length - 1) {
            judul_baris.push({ '_id': _id })
            data.push([all_variable_obj[_id].name])
            indexBaris[_id] = posBaris++
        } else {
            judul_baris.push({ '_id': _id })
            data.push([all_variable_obj[_id].name])
            indexBaris[_id] = posBaris++
        }
    })
    if (activeData) {
        activeData.all_data && judul_baris.forEach((activeBaris, i) => {
            activeData.all_data.forEach(row => {
                if (activeBaris._id === row._idBaris) {
                    judul_baris[i] = { ...data, ...row }
                    kolom.forEach((kolom_id, i) => {
                        data[indexBaris[activeBaris._id]][indexKolom[kolom_id]] = isNaN(row[kolom_id]) ? row[kolom_id] : +row[kolom_id]
                    })
                }
            })
        })
    }
    return data;//judul_baris
}