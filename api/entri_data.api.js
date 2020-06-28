const async = require('async')
const express = require('express')
const router = express.Router()
const formidable = require("formidable");
const fs = require('fs');
const Kec = require('../models/Kec.model');

function upload(req, res) {
  const file_path = __dirname + "/../public/static/arsip/";
  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: file_path,
    keepExtensions: true
  });
  if (!fs.existsSync(file_path)) {
    fs.mkdirSync(file_path);
  }
  let files = []
  form.parse(req, function (err, fields, files_) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let photo_names = [];
    const { _idKec, _idKab, _idTable } = fields
    files.forEach((photo, i) => {
      photo_names.push(`${_idKec}.${_idTable}_${Math.round(new Date().getTime() / 1000)}_${i}_${photo.name}`);
      fs.rename(photo.path, `${form.uploadDir}${photo_names[i]}`, () => { });
    })
    async.auto({
      isExist: cb_isExist => {
        Kec.findOne({
          _id: _idKec,
          'table._idTable': _idTable
        }, '_id', (err, result) => {
          if (err) {
            cb_isExist(err_code.ERROR_ACCESS_DB, null)
          } else {
            cb_isExist(null, result)
          }
        })
      },
      createTable: ['isExist', (results, cb_createTable) => {
        if (!results.isExist) {
          Kec.updateOne({
            _id: _idKec
          }, {
            $push: {
              'table': { _idTable, _idKec, _idKab, 'arsip': photo_names }
            }
          }, (err, result) => {
            if (err) {
              console.log(err);
              cb_createTable(err_code.ERROR_ACCESS_DB, null)
            } else {
              cb_createTable(null, `Data berhasil disimpan.`)
            }
          })
        } else {
          cb_createTable(null, null)
        }
      }],
      updateTable: ['isExist', (results, cb_updateTable) => {
        if (results.isExist) {
          Kec.updateOne({
            _id: _idKec,
            "table._idTable": _idTable
          }, {
            $set: {
              'table.$.arsip': photo_names,
            }
          }, (err, result) => {
            if (err) {
              cb_updateTable(err_code.ERROR_ACCESS_DB, null)
            } else {
              cb_updateTable(null, `Data berhasil diupdate.`)
            }
          })
        } else {
          cb_updateTable(null, null)
        }
      }],
    }, (err, { isExist, createTable, updateTable }) => {
      if (err) {
        res.end(err);
      } else {
        res.end('ok');
      }
    })
  });

  form.on('file', function (field, file) {
    files.push(file);
  });
}

router.post("/upload", upload)

module.exports = router;