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

router.get('/resendEmail/:email', (req, res) => {
    const email = req.params.email;
    db.query('SELECT * FROM user WHERE email = ? ', [email], (error, result) => {
        if (error) {
            console.log(error);
        }
        else{
          req.session.userID = result[0];
          const id = result[0].id
          const username = result[0].username
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'webbreakers2@gmail.com',
                pass: 'web2backend'
            },
            tls: { rejectUnauthorized: false }
        });
        const mailOptions = {
            from: 'webbreakers2@gmail.com',
            to: email,
            subject: 'Email verfication',
            html:`<h2>Hello ${username}!</h2><p>To start exploring our website please verify your email</p><a href="http://localhost:5002/user/${id}">click here</a><p>from webbreakers team</p>`
        };


        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.render('emailVerfication',{email:result[0].email});
            }
        });
        }
      })
})


router.post('/signup', async(req, res) => {

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const gender = req.body.gender;
    const phonenumber = req.body.phonenumber;
    const university = req.body.university;


    let hashedPassword = await bcrypt.hash(password, 8);

    db.query('SELECT * FROM user WHERE email = ? ', [email], (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('signup', {
                message2: 'This email already exists '
            })
        } else if (password !== passwordConfirm) {
            return res.render('signup', {
                message2: 'Password does not match '
            });
        }
        
       
        db.query('INSERT INTO user SET ?', { email: email, username: username, password: hashedPassword, gender: gender, phonenumber: phonenumber, university: university }, (error, results) => {
            if (error) {
                console.log(error)
            } else {
              db.query('SELECT * FROM user WHERE email = ? ', [email], (error, result) => {
                if (error) {
                    console.log(error);
                }
                else{
                  req.session.userID = result[0];
                  const id = result[0].id
                  const username = result[0].username
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'webbreakers2@gmail.com',
                        pass: 'web2backend'
                    },
                    tls: { rejectUnauthorized: false }
                });
                const mailOptions = {
                    from: 'webbreakers2@gmail.com',
                    to: req.body.email,
                    subject: 'Email verfication',
                    html:`<h2>Hello ${username}!</h2><p>To start exploring our website please verify your email</p><a href="http://localhost:5002/user/${id}">click here</a><p>from webbreakers team</p>`
                };


                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.render('emailVerfication',{email:result[0].email});
                    }
                });
                }
              })
                

            }

        })
    })

})


router.post('/signin', async(req, res) => { //           sign in 
    const { email, password } = req.body;
    db.query('SELECT * FROM user WHERE email  = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, response) => {
                if (response) {
                   req.session.userID = req.body;
                    if (results[0].type === 'admin') {
                        return res.render('admin',{results});
                    } else {
                        return res.render('user',{results});
                    }
                } else {
                    return res.render('signin', {
                        message: 'wrong password.'
                    })
                }
            })


        } else {
            return res.render('signin', {
                message: 'email does not exists.'
            })
        }
    })
})


router.post('/forgotPass', (req, res) => {
    const email = req.body.email;
    db.query('SELECT * FROM user WHERE email = ? ', [email], (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'webbreakers2@gmail.com',
                    pass: 'web2backend'
                },
                tls: { rejectUnauthorized: false }
            });

            const mailOptions = {
                from: 'webbreakers2@gmail.com',
                to: req.body.email,
                subject: 'Reset your password',
                html: `<h3>Hello ${results[0].username}</h3>
                <p>please reset your password using this link</p>
                <a href="http://localhost:5002/resetPass/${results[0].id}">click here</a>
                <p>from webbreakers team</p>`
            };


            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.render('forgotPass', {
                        message: 'check your email to reset your password.'
                    })
                }
            });

        } else {
            return res.render('forgotPass', {
                message: 'email does not exists.'
            })
        }
    })
})

router.put('/resetPass/:id', async(req, res) => {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    let hashedPassword = await bcrypt.hash(password, 8);
    if (password !== passwordConfirm) {
        return res.render('resetPass', {
            massage: 'password does not match.'
        });
    }
    db.query('SELECT * FROM user WHERE id = ? ', [req.params.id], (error, results) => {
        if (error) {
            console.log(error);
        } else if (results.length > 0) {
            db.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, results[0].email], function(err, result) {
                if (err) throw err;
                console.log(result);
                res.redirect('/signin');
            });

        } else {
            return res.render('resetPass', {
                message: 'email does not exists.'
            })
        }

    })
})

module.exports = router;
