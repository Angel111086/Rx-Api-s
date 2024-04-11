const express = require('express');
var path = require('path');
const app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var _ = require('underscore');
const passport = require('passport');

app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());
//app.use(express.session({secret: 'rxaushadi'}));



/* Accept header with request */
app.use((req, res, next) => {
  console.log("Auth",req.header("Authorization"));
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Credentials', "true");
  res.header(
      "Access-Control-Allow-Origin",
      "Origin", "x-Requested-With", "Content-Type", "Accept", "Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", 'PUT,  PATCH, GET, DELETE, POST');
      res.header("HTTP/1.1 200 OK"); 
  }
  next();
})


app.use(passport.initialize());
//app.use(passport.session());
require('./authorization/passport')(passport);

console.log('Path',path.join(__dirname))
app.use(express.static(path.join(__dirname, '/public')));

const rxaushadhiapi = require('./router/rxaushadhi.router');
app.use('/rxaushadi', rxaushadhiapi);


const hostname = '192.168.1.1';
const httpPort = 33;
const httpsPort = 1700;

const options = {  

  //key: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in/privkey.pem'),
  //cert: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in/fullchain.pem'),

  //key: fs.readFileSync('./pem/rxaushadi.key'),
  //cert: fs.readFileSync('./pem/rxaushadi.cert'),
  requestCert: false,
  rejectUnauthorized: false
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.use((req, res, next) => {
  if(req.protocol === 'http'){
    res.redirect(301, `https://${req.headers.hostname}${req.url}`);
  }
  next();
})


httpsServer.listen(httpsPort ,function () {
  console.log('Rx Aushadhi listening on port 1700!');
});

httpServer.listen(httpPort ,function () {
  console.log('Rx Aushadhi listening on port 1700!');
});
