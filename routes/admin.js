const express = require("express");
const multer = require("multer");
const sql = require("mysql");
const dbDebugger = require('debug')('app:db');
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
    dbDebugger("MYSQL connected ...")
  }
 });

 const upload = multer({storage:multer.memoryStorage()});

 router.post('/apartmentDB/:id',upload.single('apatrmentImage'),(req,res)=>{
   const id = req.params.id;
   const image = req.file.buffer.toString('base64');
   db.query('INSERT INTO apartment SET ?' , {monthlyCost:req.body.monthlyCost , space :req.body.space , description:req.body.description , city :req.body.city , location :req.body.location , roomCount:req.body.roomCount , ownerName:req.body.ownerName , ownerPhone:req.body.ownerPhone , imageHere:image , roommates:req.body.roommates , remainingRoommates:req.body.Remaining } , (error,results)=>{
     if(error){
       console.log(error);
     } 
     else {
      db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
        if(error)console.log(error)
        else{
            res.render('admin',{results});
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

router.delete('/delete/:id', function(req, res, next) {
    console.log("delete")
    let id = req.params.id;
    db.query('DELETE FROM apartment WHERE id = ? ', id, (error, rows) => {
        if (error) console.log(error)
        else {
            res.redirect('/adminApartment');
        }
    })
})

router.get('/edit/:id', function(req, res, next) {
  let id = req.params.id;
  db.query('SELECT * FROM apartment WHERE id = ? ' ,[id], (error , rows ) =>{
    if(error)console.log(error)
    else{
        res.render('edit',{rows});
    }
 })
 })
 
 router.put('/edit/:id', function(req, res, next) {
   db.query('UPDATE apartment SET space = ?,monthlyCost = ?,description = ?,city = ?,location =?,roomCount = ?,ownerName=?,ownerPhone=?,roommates=?,remainingRoommates=? WHERE id = ?' , [req.body.space,req.body.monthlyCost,req.body.description,req.body.city,req.body.location,req.body.roomCount,req.body.ownerName,req.body.ownerPhone,req.body.roommates,req.body.Remaining, req.params.id], (error , rows ) =>{
     if(error)console.log(error)
     else{
         res.redirect('/adminApartment');
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

router.get('/delete/:id', function(req, res, next) {
    console.log("delete")
    let id = req.params.id;
    db.query('DELETE FROM apartment WHERE id = ? ', id, (error, rows) => {
        if (error) console.log(error)
        else {
            res.redirect('/adminApartment');
        }
    })
})




module.exports = router;
