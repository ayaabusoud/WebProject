const express = require("express");
const sql = require("mysql");
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
      console.log("MYSQL connected ...")
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

router.get('/resetPass', (req, res) => {
    res.render('resetPass');
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
    const id = req.params.id;
    db.query('SELECT * FROM apartment WHERE NOT remainingRoommates = 0 ' , (error , rows ) =>{
        
        if(error)console.log(error)
        else{
            db.query('SELECT * FROM user WHERE id = ?' ,[id], (error , results ) =>{
                if(error)console.log(error)
                else{
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




module.exports = router;
