const express = require("express");
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const dbDebugger = require('debug')('app:db');
const router = express.Router();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'housings'
  });
  
  db.connect((error) => {
    if (error) {
         console.log(error)
     } else {
        dbDebugger("MYSQL connected ...")
    }
   });

router.post('/forgotPass', (req,res)=>{
    const email = req.body.email;
    db.query('SELECT * FROM user WHERE email = ? ', [email] , (error , results) =>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            
           const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'webbreakers2@gmail.com',
                  pass: 'web2backend'
                },
                tls : { rejectUnauthorized: false }
              });
              
              const mailOptions = {
                from: 'webbreakers2@gmail.com',
                to: req.body.email,
                subject: 'Reset your password',
                text: 'Hello \n please reset your password using this link http://localhost:5002/resetPass\n from webbreakers team'
                
              };
             
  
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  return res.render('forgotPass' , {
                  message: 'check your email to reset your password.'
                })
                }
              });
  
        }
        else{
            return res.render('forgotPass' , {
                message: 'email does not exists.'
              })
    }
    })
})
  
router.post('/resetPass',async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    let hashedPassword = await bcrypt.hash(password , 8);
    if(password !== passwordConfirm){
        return res.render('resetPass' , {
            massage : 'password does not match.'
        });
    }
    db.query('SELECT email FROM user WHERE email = ? ', [email] , (error , results) =>{ 
        if(error){
            console.log(error);
        }
        else if(results.length > 0){
            db.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email], function (err, result) {
                if (err) throw err;
                console.log(result);
                res.redirect('/signin');
              });
  
        }
        else{
            return res.render('resetPass' , {
                message: 'email does not exists.'
              })
        } 
  
    })
})

module.exports = router;

