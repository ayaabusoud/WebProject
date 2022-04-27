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

 router.post('/apartmentDB',upload.single('apatrmentImage'),(req,res)=>{
   const cost = req.body.monthlyCost;
   const space = req.body.space;
   const description = req.body.description;
   const city = req.body.city;
   const location = req.body.location;
   const roomCount = req.body.roomCount;
   const ownerName = req.body.ownerName;
   const ownerPhone = req.body.ownerPhone;
   const roommates = req.body.roommates;
   const remaining = req.body. Remaining;
   const image = req.file.buffer.toString('base64');
   db.query('INSERT INTO apartment SET ?' , {monthlyCost:cost , space :space , description:description , city :city , location :location , roomCount:roomCount , ownerName:ownerName , ownerPhone:ownerPhone , imageHere:image , roommates:roommates , remainingRoommates:remaining } , (error,results)=>{
     if(error){
       console.log(error);
     } 
     else {
      return  res.redirect('/admin');
     }
   
 })
 })  


      module.exports = router;




router.post('/apartmentDB', upload.single('apatrmentImage'), (req, res) => {
    const cost = req.body.monthlyCost;
    const space = req.body.space;
    const description = req.body.description;
    const city = req.body.city;
    const location = req.body.location;
    const roomCount = req.body.roomCount;
    const ownerName = req.body.ownerName;
    const ownerPhone = req.body.ownerPhone;
    const roommates = req.body.roommates;
    const remaining = req.body.Remaining;
    const image = req.file.buffer.toString('base64');
    db.query('INSERT INTO apartment SET ?', { monthlyCost: cost, space: space, description: description, city: city, location: location, roomCount: roomCount, ownerName: ownerName, ownerPhone: ownerPhone, imageHere: image, roommates: roommates, remainingRoommates: remaining }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            return res.redirect('/admin');
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
