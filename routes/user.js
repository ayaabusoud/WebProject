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
   module.exports = router ;
