const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const multer=require('multer');//dosya işlemleri için
const session=require('express-session');
const mySqlStore=require('express-mysql-session')(session);
const csrf=require('csurf');


const app = express();
const Store=new mySqlStore({
  host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Dk123.',
	database: 'anibal'
});

const csrfProtection=csrf();

const fileStorage=multer.diskStorage({
  destination: (req,file,cb)=>{
   if(req.files['cv']){
    console.log('cv ye girdi')
    cb(null,'public/cv');
   }
   else{
    console.log('resim olur')
    cb(null,'public/basvuran_foto');
   }
    
  },
  filename:(req,file,cb)=>{
    const date = new Date();
    cb(null,date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear()+"-"+date.getHours()+"-"+ date.getMinutes()+"-"+ date.getSeconds()+"-"+file.originalname);
  }
})

const admin=require('./models/admin');
const ilan=require('./models/ilan');
const kriter=require('./models/kriter');
const is_tanim=require('./models/is-tanim');
const basvuran=require('./models/basvuranlar')


app.set('view engine', 'ejs'); //ejs kullanılırken yapılır
app.set('views', 'views');

const Routes = require('./routes/routes');
const Admin=require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage}).fields([{name:'kullanici_foto'},{name:'cv'}]));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: Store
    })
  );

app.use(csrfProtection);


app.use((req, res, next) => {
    
    if (!req.session.user) {
        return next();
    }
    admin.findByPk(req.session.user.id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  }); 

app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn;
  res.locals.csrfToken=req.csrfToken();
  next();
})

app.use(Routes);
app.use(Admin);

ilan.hasMany(kriter);
ilan.hasMany(is_tanim);
ilan.hasMany(basvuran);
sequelize 
/* .sync({force:true}) */
.sync()//modelde ki tabloları oluşturur
.then(result=>{

    app.listen(3000); 
})
.catch(err=>console.log(err));

