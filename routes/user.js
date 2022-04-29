const express = require("express");
const sql = require("mysql");
const router = express.Router();



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


   router.get('/search',(req,res)=>{
    const {name} = req.query;
    searchInput = name;
    
    
              
    db.query(`SELECT * FROM apartment WHERE city  LIKE '${name.toLowerCase()}%' `,   (error , rows) =>{ 

        if(error)console.log(error)
            else{
                res.render('adminApartment',{rows,searchInput}) 
                res.render('apartments',{rows,searchInput}) 
                searchInput =name
             
            }
    
    })
    })

    router.get('/apartments',(req,res)=>{
      const {name} = req.query;
      searchInput = name;
      
      
                
      db.query(`SELECT * FROM apartment WHERE NOT remainingRoommates = 0 `,   (error , rows) =>{ 
  
          if(error)console.log(error)
              else{
                  
  
                  res.render('apartments',{rows,searchInput}) 
               
               
              }
      
      })
      });


    router.get('/apartments/search',(req,res)=>{
      const {name} = req.query;
      searchInput = name;
      
      
                
      db.query(`SELECT * FROM apartment WHERE NOT remainingRoommates = 0 and city  LIKE '${name.toLowerCase()}%' `,   (error , rows) =>{ 
  
          if(error)console.log(error)
              else{
                  
  
                  res.render('apartments',{rows,searchInput}) 
               s  
               
              }
      
      })
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
       
       router.post('/edit/:id', function(req, res, next) {
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

        router.post('/payment/:id', function(req, res, next) {
          let Publishable_Key = 'pk_test_51Ktc3KHaguLSLClfjaQQp9t4sXaqkMlsN44LvaJkhE1gLnRRUTZvwUwS7Jajj0rmkFPdWh81cjQPCPifizoGPHbE00TltsMdbH'
          let Secret_Key = 'sk_test_51Ktc3KHaguLSLClfttD5Vl3jPNNBn7CtSa3ZKyiv0V0usrn0PBAZd6Bz2wYSZrlckVfmSicO6gKnb4GxW2lJyL4m00Gjvm0JIc'
          const stripe = require('stripe')(Secret_Key)
          db.query('SELECT * FROM apartment WHERE id = ? ' ,[req.params.id], (error , result ) =>{
            if(error)console.log(error)
            else{
          /*  stripe.customers.create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken,
                name: 'Gautam Sharma' 
            })
            .then((customer) => {
            
                return stripe.charges.create({
                    amount: result[0].monthlyCost,    // Charing Rs 25
                    description: 'Web Development Product',
                    currency: 'USD',
                    customer: customer.id
                });
            })
            .then((charge) => {
                res.send("Success") // If no error occurs
            })
            .catch((err) => {
                res.send(err)    // If some error occurs
            });*/
            db.query('SELECT * FROM user WHERE email = ?' , [req.body.email] , (error,result)=>{
              if(error)console.log(error)
              else{
                db.query('INSERT INTO user_apartment SET ?' , {userID:result[0].id, apartmentID :req.params.id , bookDate:req.body.expdate} , (error,results)=>{
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
            
          }
         })
        })

   module.exports = router ;
