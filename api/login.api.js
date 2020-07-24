const async = require('async')
const express = require('express')
const router = express.Router()

//Controller
const User = require("../models/User.model")

function loginSuccess(req, res, user, tahun_buku_monitoring) {
  res.cookie('user_id', user._id)
  res.cookie('jenis_pengguna', user.jenis_pengguna)
  res.cookie('profil', user.profil)
  res.cookie('tahun_buku', user.tahun_buku)
  res.cookie('tahun_buku_monitoring', tahun_buku_monitoring)
  res.cookie('name', user.name)
  res.end('ok');
}

function login(req, res) {
  User.findOne({ 'username': req.body.username, 'password': req.body.password }, (err, user) => {
    if (user) {
      User.updateOne({_id: user._id}, {visit_count: user.visit_count+1}, (e,s)=>{
        loginSuccess(req, res, user, req.body.tahun_buku)
      })
    } else{
      res.end('Username atau password salah.');
    }
  })
}

function out(req, res) {
  res.clearCookie('user_id');
  res.clearCookie('jenis_pengguna');
  res.redirect('/sikece/login');
}

router.post("/login", login)
router.get("/logout", out)

module.exports = router;