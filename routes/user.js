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

   module.exports = router ;
