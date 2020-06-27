const async = require('async')
const express = require('express')
const router = express.Router()

//Controller
const User = require("../models/User.model")

function loginSuccess(req, res, user) {
  res.cookie('user_id', user._id)
  res.cookie('jenis_pengguna', user.jenis_pengguna)
  res.cookie('tahun_buku', user.tahun_buku)
  res.cookie('name', user.name)
  res.end('ok');
}

function login(req, res) {
  User.findOne({ 'username': req.body.username, 'password': req.body.password }, (err, user) => {
    if (user) {
      loginSuccess(req, res, user)
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