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
      

   module.exports = router ;
