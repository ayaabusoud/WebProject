const express = require("express");
const sql = require("mysql");
const router = express.Router();
const stripe = require('stripe')('sk_test_51Ktc3KHaguLSLClfttD5Vl3jPNNBn7CtSa3ZKyiv0V0usrn0PBAZd6Bz2wYSZrlckVfmSicO6gKnb4GxW2lJyL4m00Gjvm0JIc')

const redirectLogin = (req,res,next) =>{
  if (!req.session.userID){
    res.redirect('/signin')
  }else{
      next()
  }
}

  const db = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'housings'
  });
  
  db.connect((error) => {
    if (error) {
         console.log(error)
     } else {
      console.log("MYSQL connected ...")
    }
   });
      
router.get('/edit/:id', function(req, res, next) {
        let id = req.params.id;
        db.query('SELECT * FROM user WHERE id = ? ' ,[id], (error , rows ) =>{
          if(error)console.log(error)
          else{
              res.render('editProfile',{rows});
          }
       })
       })
       
       router.put('/edit/:id', function(req, res, next) {
         db.query('UPDATE user SET username = ?,phonenumber = ?,gender = ?,university = ? WHERE id = ?' , [req.body.username,req.body.phonenumber,req.body.gender,req.body.university, req.params.id], (error , rows ) =>{
           if(error)console.log(error)
           else{
            db.query('SELECT * FROM user WHERE id = ? ' ,[req.params.id], (error , rows ) =>{
              if(error)console.log(error)
              else{
                  res.render('profile',{rows});
              }
           })
           }
        
       })
       
          
        })

        router.get('/info/:id', function(req, res, next) {
          console.log(req.param.id)
          let id = req.params.id;
          db.query('SELECT * FROM apartment WHERE id = ? ', [id], (error, rows) => {
      
              if (error) console.log(error)
              else {
                  res.render('info', { rows });
              }
          })
      })
         router.post('/payment/:id',redirectLogin, function(req, res, next) {
           console.log(req.body)
          db.query('SELECT * FROM apartment WHERE id = ?' , [req.params.id] , (error,result)=>{
            if(error)console.log(error)
              else{
                const amount = result[0].monthlyCost*100;
                stripe.customers.create({
                  email: req.body.stripeEmail,
                  source: req.body.stripeToken
                })
                .then(customer => stripe.charges.create({
                  amount,
                  description: 'Student Housing apartment',
                  currency: 'usd',
                  customer: customer.id
                }))
                .then((charge) => {
                  db.query('SELECT * FROM user WHERE email = ?' , [req.body.stripeEmail] , (error,result)=>{
                    if(error)console.log(error)
                    else{
                      db.query('INSERT INTO user_apartment SET ?' , {userID:result[0].id, apartmentID :req.params.id } , (error,results)=>{
                        if(error)console.log(error)
                        else{
                          db.query('UPDATE apartment SET remainingRoommates = remainingRoommates-1 WHERE id = ?' , [req.params.id] , (error,results)=>{
                            if(error)console.log(error)
                            else{
                                 console.log('success')
                            }
                          })
                        }
                      })
                    }
                  })
                    console.log("Success") // If no error occurs
                })
                .catch((err) => {
                    res.send(err)    // If some error occurs
                });
              }
          })

        })


        router.get('/search/:id',(req,res)=>{
          const {name} = req.query;
          searchInput = name;
          console.log(searchInput)
          const id = req.params.id;
          db.query(`SELECT * FROM apartment WHERE NOT remainingRoommates = 0 AND city  LIKE '${name.toLowerCase()}%'` , (error , rows ) =>{
              if(error)console.log(error)
              else{
                  db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
                      if(error)console.log(error)
                      else{
                          res.render('userApartment',{rows , results ,searchInput });
                      }
                  })

              }
          })
          });


   module.exports = router ;
