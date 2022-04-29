const express = require("express");
const session = require ('express-session');
//var MySQLStore = require('express-mysql-session')(session);
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const user = require('./routes/user');
const pages = require('./routes/pages');
const app = express();
const methodOverride = require("method-override");
const two_hours = 1000*60*60*2;

const{
  session_lifetime = two_hours,
  Node_env ='development',
  sess_name = 'sid',
  sess_secret ='ssh!quiet,it\'asecret!'
} = process.env

const IN_PROD = Node_env === 'production'
app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(session({
  name :sess_name,
  resave: false,
  saveUninitialized:false,
  secret:sess_secret,
  cookie:{
    maxAge:session_lifetime,
    sameSite: true,
    secure : IN_PROD
  }
}))

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.use('/', pages);
app.use(methodOverride('_method'));
app.use('/auth' , auth);
app.use('/admin', admin);
app.use('/user', user);

app.get('/logout', function(req, res, next) {
  req.session.destroy(err =>{
    if(err){
      return;
    }
    res.clearCookie(sess_name)
    res.redirect('/');
  })
});



app.listen(5002, () => {
    console.log("server started on port 5002");
});
