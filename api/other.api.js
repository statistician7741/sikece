const async = require('async')
const express = require('express')
const router = express.Router()
const Docxtemplater = require('docxtemplater');
const JSZip = require('jszip');
const fs = require('fs')

//Controller
const User = require("../models/User.model")

const static_path = __dirname + "/../public/static/"
const template_file = `Surat_Pernyataan_Pengisian_Data.docx`;
function download(req, res) {
  User.findOne({ '_id': req.cookies.user_id }, (err, user) => {
    if (user) {
      const outputDocx = static_path + `${user.tahun_buku}_Surat_Pernyataan_Pengisian_Data.docx`;//
      if (fs.existsSync(outputDocx)) {
        res.download(outputDocx);
      } else {
        const template = fs.readFileSync(static_path + template_file, "binary");//
        const zip = new JSZip(template);
        const docx = new Docxtemplater().loadZip(zip);
        docx.setData({ tahun_buku: user.tahun_buku });
        //render
        docx.render();
        const buf = docx.getZip()
          .generate({ type: "nodebuffer" });
        fs.writeFileSync(outputDocx, buf);
        res.download(outputDocx);
      }
    } else {
      res.redirect(`/sikece/persetujuan`);
    }
  })
}
function downloadArsip(req, res) {
  if (req.params.file) {
    const outputDocx = static_path + `arsip/${req.params.file}`;
    if (fs.existsSync(outputDocx)) {
      res.download(outputDocx);
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
}

router.get("/template", download)
router.get("/arsip/:file", downloadArsip)

module.exports = router;