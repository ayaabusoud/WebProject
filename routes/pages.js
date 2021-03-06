const express = require("express");
const sql = require("mysql");
const dbDebugger = require('debug')('app:db');
const router = express.Router();

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
      dbDebugger("MYSQL connected ...")
    }
   });

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/signin', (req, res) => {
    const{userID} = req.session;
    res.render('signin');
});

router.get('/forgotPass', (req, res) => {
    res.render('forgotPass');
});

router.get('/resetPass/:id', (req, res) => {
    res.render('resetPass',{id:req.params.id});
});

router.get('/admin/:id',redirectLogin, (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
        if(error)console.log(error)
        else{
            res.render('admin',{ results});
        }
    })
});

router.get('/user/:id',redirectLogin, (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
        if(error)console.log(error)
        else{
            res.render('user',{ results});
        }
    })
});

router.get('/resendEmail', (req, res) => {
    res.render('emailVerfication');
}); 

router.get('/addApartment/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
        if(error)console.log(error)
        else{
            res.render('addApartment',{results});
        }
    })
}); 

router.get('/userapartment/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM apartment WHERE NOT remainingRoommates = 0' , (error , rows ) =>{        
        if(error)console.log(error)
        else{
            db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
                if(error)console.log(error)
                else{
                    res.render('userApartment',{rows , results});
                }
            })
        }
    })
});

router.get('/adminapartment/:id', (req, res) => {
    const userid = req.params.id;
    db.query('SELECT user.id AS ID,monthlyCost,roommates,remainingRoommates,city,location,apartment.id,imageHere FROM apartment,user WHERE NOT remainingRoommates = 0 AND user.id =?' ,[userid] ,(error , rows ) =>{
        if(error)console.log(error)
        else{
            db.query('SELECT * FROM user WHERE id = ?' ,[userid], (error , results ) =>{
                if(error)console.log(error)
                else{
                    console.log(rows)
                    res.render('adminApartment',{rows , results});
                }
            })  
        }
    })
});

router.get('/profile/:id',redirectLogin, (req, res) => {
    let id = req.params.id;
    db.query('SELECT * FROM user WHERE id = ? ' ,[id], (error , rows ) =>{
         
        if(error)console.log(error)
        else{
            res.render('profile',{rows});
        }
     })
});

router.get('/apartments', (req, res) => {
    db.query('SELECT * FROM apartment WHERE NOT remainingRoommates = 0 ' , (error , rows ) =>{
        
        if(error)console.log(error)
        else{
                if(error)console.log(error)
                else{
                    res.render('apartments',{rows});
                }
            }  
        })
   
});

router.get('/search',(req,res)=>{
    const {name} = req.query;
    searchInput = name;
    if(req.query == null)  res.render('apartments',{rows,searchInput}) ;
   else{ 
       console.log(searchInput)        
    db.query(`SELECT * FROM apartment WHERE NOT remainingRoommates = 0 AND city  LIKE '${name.toLowerCase()}%' `,   (error , rows) =>{ 
        if(error)console.log(error)
            else{
            if (rows[0] === undefined) res.render('apartments',{message:`there is no available apartments in ${searchInput} city `})
            else {res.render('apartments',{rows}) }
            }
    })
}
    });

 router.get('/bookedRooms',(req,res)=>{       
        db.query(`select DISTINCT c.userID,a.username, a.university,a.phonenumber,a.email,c.apartmentID,b.city,b.location,b.remainingRoommates,c.bookdate,c.duedate from user a , user_apartment c , apartment b where c.userID =a.id and c.apartmentID=b.id`,   (error , rows) =>{ 
    
            if(error)console.log(error)
                else{
                    res.render('bookedRooms',{rows}) 
                }
        })
        });

module.exports = router;
