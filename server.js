//error handling

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log(400, ' Start Error Message: ', err)
  // send email

});

//SIKECE Server
const express = require('express')
const http = require('http')
const next = require('next')
const socketServer = require('socket.io')

//modul mongodb utk koneksi mongo db database
const url = 'mongodb://127.0.0.1:27017/sikece';
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let runServer = () => {
  const port = 80
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev })
  const handle = app.getRequestHandler()

  app.prepare()
    .then(() => {
      const server = express()
      const cookieParser = require("cookie-parser");
      const bodyParser = require("body-parser");
      var sharedsession = require("express-socket.io-session");
      // server.use(session);
      const sessionWithMongo = session({
        resave: true,
        saveUninitialized: true,
        secret: "ID==&&%^&A&SHBJSAsjhbJGhUGkbKiUvii^%^#$%^&98G8UIugg==",
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      })
      server.use(sessionWithMongo);
      server.use(cookieParser("ID==&&%^&A&SHBJSAsjhbJGhUGkbKiUvii^%^#$%^&98G8UIugg=="));
      server.use(bodyParser.urlencoded({ extended: true }));
      server.use(bodyParser.json())

      server.use('/sikece', require("./api/login.api"));
      server.use('/sikece/entri_data', require("./api/entri_data.api"));
      server.use('/sikece/other', require("./api/other.api"));

      let login_check = function (req, res, next) {
        if (/^\/sikece\/login$/.test(req.url)) {
          if (req.cookies.user_id) res.redirect('/sikece')
          else next();
        } else if (/sikece\/login|static|_next/.test(req.url)) {
          next();
        } else {
          if (req.cookies.user_id) next()
          else res.redirect('/sikece/login')
        }
      }
      server.use(login_check)

      //socket.io
      const serve = http.createServer(server);

      //Kompresi gzip
      const compression = require('compression');
      server.use(compression());

      server.get('*', (req, res) => {
        return handle(req, res)
      })
      serve.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on https://localhost:${port}`)
        const User = require('./models/User.model')
        User.findOne({ "username": 'ipds' }, (err, result) => {
          const data = {
            'username': 'ipds',
            'password': '@ipds',
            'name': 'IPDS Admin',
            'jenis_pengguna': 'admin',
            'ket': 'Login default'
          }
          if (!result) {
            User.create(data, (err, result) => { })
          }
        })
      })

      const io = socketServer(serve);
      io.use(sharedsession(sessionWithMongo, cookieParser("ID==&&%^&A&SHBJSAsjhbJGhUGkbKiUvii^%^#$%^&98G8UIugg==")));
      io.on('connection', function (client) {
        const { name, jenis_pengguna } = client.handshake.cookies
        console.log(`${name} (${jenis_pengguna}) connected`);
        require('./api/master_table.api')(client)
        require('./api/master_user.api')(client)
        require('./api/general.api')(client)
        client.on('disconnect', () => {
          console.log(`${name} (${jenis_pengguna}) disconnected`);
        })
      })
    })
}

//modul mongodb utk koneksi mongo db database
const { exec } = require('child_process');

let start = () => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      exec(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c net start MongoDB'"`, (err, stdout, stderr) => {
        console.log('Trying to start MongoDB service...');
        setTimeout(start, 15000)
      })
    } else {
      runServer();
    }
  });
}

start();