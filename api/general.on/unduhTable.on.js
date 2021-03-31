const getModel = require('./getModel')
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs')
const static_path = __dirname + "/../../public/static/"

module.exports = (input, cb, client) => {
    let file_name = `[${input.kec}] KCDA ${input.selectedYear} - Tabel ${input.nomor_tabel}.xlsx`
    XlsxPopulate.fromFileAsync(static_path + "/template_table.xlsx")
        .then(workbook => {
            let sheet = workbook.sheet(0);
            sheet.name(`Tabel ${input.nomor_tabel}`)
            let nomor_tabel = [`Tabel ${input.nomor_tabel}`, input.judul.replace('{nama}', input.nama)]
            let colEnd = 1
            let rowEnd = 1
            let cols = []
            let colsTempPos = 0
            let colsWidth = []
            if (input.header[1]) {
                let newIndex0 = []
                input.header[0].forEach((parent, i) => {
                    if (typeof parent === 'string') {
                        newIndex0.push(parent)
                        cols.push({ 'type': 'v', 'pos': i + 1 + colsTempPos })
                        if(i !== 0) {
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
                input.header[0] = newIndex0
                input.header[1].forEach((headerText, i) => {
                    nomor_tabel.push(undefined)
                    if(headerText.length && i) colsWidth.push({ 'cellChar': (i + 1 + 9).toString(36).toUpperCase(), 'w': headerText.length * 1.2 })
                })
                colEnd = input.header[1].length
                rowEnd = input.data.length + 4
            } else {
                input.header[0].forEach((headerText, i) => {
                    nomor_tabel.push(undefined)
                    if(i !== 0) {
                        colsWidth.push({ 'cellChar': (i + 1 + 9).toString(36).toUpperCase(), 'w': headerText.length * 1.2 })
                    }
                })
                colEnd = input.header[0].length
                rowEnd = input.data.length + 3
            }
            let arr = [
                nomor_tabel,
                [],
                ...input.header,
                ...input.data,
                [`Sumber: ${input.activeData.sumber || ''}`]
            ]
            if (input.activeData.catatan) arr.push([`Catatan: ${input.activeData.catatan || ''}`])
            sheet.cell("A1").value(arr)

            //style
            cols.forEach(col => {
                let cellChar = (col.pos + 9).toString(36).toUpperCase()
                col.type === 'v' && sheet.range(`${cellChar}` + 3 + `:${cellChar}` + 4).style({ 'horizontalAlignment': 'center', 'verticalAlignment': 'center' }).merged(true)
                col.type === 'h' && sheet.range(`${cellChar}` + 3 + `:${(col.pos + col.colspan + 9).toString(36).toUpperCase()}` + 3).style({ 'horizontalAlignment': 'center' }).merged(true)
            })
            // sheet.column("B").width(25)
            let maxLength = 1
            input.data.forEach(row=>{
                maxLength = row[0].length > maxLength ? row[0].length : maxLength
            })
            sheet.column("A").width( maxLength * 1.2 > 10? maxLength * 1.2 : 10 )
            colsWidth.forEach(col=>{
                sheet.column(col.cellChar).width( col.w > 9 ? col.w : 9 )
            })
            sheet.range('A' + 3 + `:${(colEnd + 9).toString(36).toUpperCase()}` + rowEnd).style({ 'leftBorder': true, 'rightBorder': true, 'bottomBorder': true, 'topBorder': true })

            if (fs.existsSync(static_path + `/${file_name}`)) {
                fs.unlinkSync(static_path + `/${file_name}`);
            }
            workbook.toFileAsync(static_path + `/${file_name}`);
        }).then(data => {
            cb({ 'type': 'ok', 'data': file_name })
            setTimeout(() => {
                if (fs.existsSync(static_path + `/${file_name}`)) {
                    fs.unlinkSync(static_path + `/${file_name}`);
                }
            }, 30000)
        })
    return
}