const getModel = require('./getModel')
const xlsx = require("node-xlsx").default;
const XlsxPopulate = require('xlsx-populate');
const fs = require('fs')
const static_path = __dirname + "/../../public/static/"

module.exports = (input, cb, client) => {
    let file_name = `[${input.kec}] Tabel ${input.nomor_tabel}.xlsx`
    XlsxPopulate.fromFileAsync(static_path + "/template_table.xlsx")
        .then(workbook => {
            let sheet = workbook.sheet(0);
            sheet.name(`Tabel ${input.nomor_tabel}`)
            let nomor_tabel = [`Tabel ${input.nomor_tabel}`, input.judul.replace('{nama}', input.nama)]
            if(input.header[1]){
                let newIndex0 = []
                input.header[0].forEach(parent=>{
                    if(typeof parent === 'string') newIndex0.push(parent)
                        else {
                            for (let pos = 0; pos < parent.colspan; pos++) {
                                newIndex0.push(pos === 0?parent.label:undefined)
                            }
                        }
                })
                input.header[0] = newIndex0
                input.header[1].forEach(i=>i!==0&&nomor_tabel.push(undefined))
            } else{
                input.header[0].forEach(i=>i!==0&&nomor_tabel.push(undefined))
            }
            let arr = [
                nomor_tabel,
                [],
                ...input.header,
                ...input.data,
                [`Sumber: ${input.activeData.sumber||''}`]
            ]
            if(input.activeData.catatan) arr.push([`Catatan: ${input.activeData.catatan||''}`])
            sheet.cell("A1").value(arr)
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