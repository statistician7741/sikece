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
  User.findOne({
    '_id': req.cookies.user_id
  }, (err, user) => {
    if (user) {
      const outputDocx = static_path + `${user.tahun_buku}_Surat_Pernyataan_Pengisian_Data.docx`; //
      if (fs.existsSync(outputDocx)) {
        res.download(outputDocx);
      } else {
        const template = fs.readFileSync(static_path + template_file, "binary"); //
        const zip = new JSZip(template);
        const docx = new Docxtemplater().loadZip(zip);
        docx.setData({
          tahun_buku: user.tahun_buku
        });
        //render
        docx.render();
        const buf = docx.getZip()
          .generate({
            type: "nodebuffer"
          });
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

function copyTable(fromYear, toYear, res) {
  const Tabel = require('../models/Table.model')
  const Bab = require('../models/Bab.model')

  Bab.find({
    tahun_buku: fromYear
  }, (e, r) => {
    console.log(r.length)
    r.forEach(bab => {
      const {
        _id,
        tahun_buku,
        nomor,
        name,
        ket
      } = bab
      Bab.create({
        _id: `${toYear}_${nomor}`,
        tahun_buku: toYear,
        nomor,
        name,
        ket
      }, (e, b) => {
        //BAB BARU CREATED
        Tabel.find({
          bab: bab._id
        }, (e, r) => {
          console.log('Tabel: ', r.length)
          r.forEach(tabel => {
            const {
              bab,
              nomor_tabel,
              judul,
              baris,
              kolom,
              sumber,
              catatan,
              ket
            } = tabel
            Tabel.create({
              bab: `${toYear}_${bab.match(/\d+$/)[0]}`,
              nomor_tabel,
              judul: judul.replace(fromYear - 1, fromYear),
              baris,
              kolom,
              sumber,
              catatan,
              ket
            }, (e, t) => {
              console.log('Tabel baru: ', t.judul)
            })
          })
        })
      })
    })
  })

  setTimeout(() => {
    res.redirect('/')
  }, 3000)
}

router.get("/template", download)
router.get("/arsip/:file", downloadArsip)

router.get("/copy/:fromyear/:toyear", (req, res) => {
  const fromYear = parseInt(req.params.fromyear);
  const toYear = parseInt(req.params.toyear);
  if (Number.isInteger(fromYear) && Number.isInteger(toYear)) {
    if (
      (fromYear >= 2021 && toYear >= 2022) &&
      (toYear > fromYear)
    ) copyTable(fromYear, toYear, res)
    else res.status(400).send('Cek parameter');
  } else {
    res.status(400).send('Cek parameter');
  }
})

module.exports = router;