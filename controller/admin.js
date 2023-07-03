const sequelize = require('sequelize');
const kullanici=require('../models/admin');
const ilan=require('../models/ilan');
const basvuru=require('../models/basvuranlar');
const kriterr=require('../models/kriter');
const is_tanimm=require('../models/is-tanim');
const { promiseImpl } = require('ejs');
const session = require('express-session');
const bcrypt=require('bcryptjs');
const basvuran = require('../models/basvuranlar');

const {validationResult} =require('express-validator/check')

exports.getLogin=(req,res,next)=>{
    res.render('admin/admin-login', {
        pageTitle: 'Anasayfa',
        path: 'admin/admin-login',
        errorsMessage:'',
        validationErrors:['']
      });
};

exports.BasvuruDetay=(req,res,next)=>{
  const basvuran_id=req.body.basvuran_id;
  const ilan_id=req.body.ilan_id;
  Promise
  .all([ilan.findOne({where:{id:ilan_id}}),basvuran.findOne({where:{id:basvuran_id}}),kriterr.findAll({where:{ilanId:ilan_id}})])
  .then((veriler)=>{
    res.render('admin/basvuran-details', {
      pageTitle: 'Başvuru Detay',
      path: 'admin/basvuran-detay',
      basvuran:veriler[1],
      ilan:veriler[0],
      kriter:veriler[2],
      yonetici:req.session.user
    });
  })
  .catch(err=>console.log(err));

};

exports.basvuruCevap=(req,res,next)=>{
  const islem=req.body.islem;
  const basvuran_id=req.body.basvuran_id;
  console.log(islem);
  if(islem=="onayla")
  {
    basvuran.findOne({where:{id:basvuran_id}})
    .then(basvuran=>{
      basvuran.durum=1;
      return basvuran.save();
    })
    .then(result=>{
      res.redirect('/onay-basvuru-listesi');
    })
    .catch(err=>console.log(err));
  }
  else if(islem=="reddet")
  {
    basvuran.findOne({where:{id:basvuran_id}})
    .then(basvuran=>{
      basvuran.durum=-1;
      return basvuran.save();
      })
      .then(result=>{
        res.redirect('/red-basvuru-listesi');
      })
      .catch(err=>console.log(err));

  }
}


exports.getPanel=(req,res,next)=>{
  Promise
   .all([ilan.count(),basvuran.count(),basvuran.findAll({where:{durum:1}})])
   .then((veriler)=>{   
     res.render('admin/admin_panel', {
      pageTitle: 'Anasayfa',
      path: '/admin-panel',
      isAuthenticated: req.session.isLoggedIn,
      ilan_sayisi:veriler[0],
      basvuran_sayisi:veriler[1],
      onayli_basvuran:veriler[2].length,
      yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
};

exports.getFormPanel=(req,res,next)=>{
  
     res.render('admin/form-panel', {
      pageTitle: 'form',
      path: '/form-panel',
      yonetici:req.session.user
    }); 

};


exports.getBasvuruList=(req,res,next)=>{
   Promise
   .all([kullanici.findAll(),ilan.findAll(),basvuru.findAll({where:{durum:0}})])
   .then((veriler)=>{   
     res.render('admin/basvurular', {
       pageTitle:'Admin | Başvurular',
       baslik:'Başvuran Kişi Listesi',
       path:'/basvuru',
       admins:veriler[0],
       ilanlar:veriler[1],
       basvuran:veriler[2],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
 };

 exports.getRedBasvuruList=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll(),basvuru.findAll({where:{durum:-1}})])
   .then((veriler)=>{   
     res.render('admin/red-basvuru', {
       pageTitle:'Admin | Red Başvuru',
       baslik:'Reddedilen Kişiler',
       path:'/red-basvuru',
       admins:veriler[0],
       ilanlar:veriler[1],
       basvuran:veriler[2],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
 };

 exports.getOnayBasvuruList=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll(),basvuru.findAll({where:{durum:1}})])
   .then((veriler)=>{   
     res.render('admin/basvurular', {
       pageTitle:'Admin | Onaylı Başvuru',
       baslik:'Onaylanan Kişiler',
       path:'/onay-basvuru',
       admins:veriler[0],
       ilanlar:veriler[1],
       basvuran:veriler[2],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
 };

 exports.getİlanList=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll({where:{durum:1}}),basvuru.findAll()])
   .then((veriler)=>{   
     res.render('admin/ilanlar', {
       pageTitle:'Admin | İlanlar',
       baslik:'İlanlar',
       path:'/ilan',
       admins:veriler[0],
       ilanlar:veriler[1],
       basvuran:veriler[2],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
 };

 exports.getAskiİlan=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll({where:{durum:0}}),basvuru.findAll()])
   .then((veriler)=>{   
     res.render('admin/ilanlar', {
       pageTitle:'Admin |Askıdaki İlanlar',
       path:'/askı-ilan',
       baslik:'Askıdaki İlanlar',
       admins:veriler[0],
       ilanlar:veriler[1],
       basvuran:veriler[2],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
 };
 
 
 exports.getAdminList=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll(),basvuru.findAll()])
   .then((veriler)=>{   
     res.render('admin/adminler', {
       pageTitle:'Admin | Adminler',
       path:'/table-panel',
       admins:veriler[0],
       ilanlar:veriler[1],
       basvuran:veriler[2],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
  
 };

exports.getTablePanel=(req,res,next)=>{
 //Başarıya adım adım!
  Promise
  .all([kullanici.findAll(),ilan.findAll(),basvuru.findAll()])
  .then((veriler)=>{
    res.render('admin/table', {
      pageTitle:'Admin | Tablolar',
      path:'/table-panel',
      admins:veriler[0],
      ilanlar:veriler[1],
      basvuran:veriler[2],
      yonetici:req.session.user
    });
  })
  .catch(err=>console.log(err));
 
};

exports.İlanDuzenle=(req,res,next)=>{
  const ilan_id=req.body.ilan_id;
  const islem=req.body.islem;
  if(islem=="duzenle"){
    Promise
    .all([ilan.findOne({where:{id:ilan_id}}),kriterr.findAll({where:{ilanId:ilan_id}}),is_tanimm.findAll({where:{ilanId:ilan_id}})])
    .then((veriler)=>{
      res.render('admin/ilan-islem', {
        pageTitle:'Admin | İlan Düzenle',
        path:'/ilan-duzenle',
        ilan:veriler[0],
        kriter:veriler[1],
        is_tanims:veriler[2],
        yonetici:req.session.user
      });
    })
    .catch(err=>console.log(err));
  }
  else if(islem=="sil"){
    ilan.findByPk(ilan_id)
    .then(ilan=>{
      return ilan.destroy();
    })
    .then(result=>{
      res.redirect('/ilan-listesi');
    })
    .catch(err=>console.log(err));
  }
  else if(islem=="askı"){
    ilan.findByPk(ilan_id)
    .then(ilan=>{
      ilan.durum=0;
      return ilan.save();
    })
    .then(result=>{
      res.redirect('/ilan-listesi');
    })
    .catch(err=>console.log(err));
  }
  else if(islem=="aktif"){
    ilan.findByPk(ilan_id)
    .then(ilan=>{
      ilan.durum=1;
      return ilan.save();
    })
    .then(result=>{
      res.redirect('/ilan-listesi');
    })
    .catch(err=>console.log(err));
  }
  
 };


exports.İlanGuncelle=(req,res,next)=>{
  const ilan_id=req.body.ilan_id;
  const is_adi=req.body.is_adi;
  const pozisyon=req.body.pozisyon;
  const il=req.body.il;
  const ilce=req.body.ilce;
  const is_tanim=req.body.is_tanim;
  const kriter=req.body.kriter;
  const islem=req.body.ilan_id;
  

  if (kriter) {
    var dizi_kriter=kriter.split(",");
    dizi_kriter.forEach(i => {
      if(i!=""){
      kriterr.create({
        kriter:i,
        ilanId:ilan_id,
      })
      .then(result=>{
        res.redirect('/ilan-listesi');
      })
      .catch(err=>console.log(err))
      }
    });
  }
  else{
    //boş olduğunu belirten mesaj döndürür
  }

  if(is_tanim){
    var dizi_tanim=is_tanim.split(",");
    dizi_tanim.forEach(i => {
      if(i!=""){
      is_tanimm.create({
        tanim:i,
        ilanId:ilan_id,
      })
      .then(result=>{
        res.redirect('/ilan-listesi');
      })
      .catch(err=>console.log(err))
      }
    });
  }
  else{
    //boş olduğunu belirten mesaj döndürür
  } 

  ilan.findByPk(ilan_id)
  .then(ilan=>{
    ilan.is_adi=is_adi;
    ilan.pozisyon=pozisyon;
    ilan.il=il;
    ilan.ilce=ilce;
    return ilan.save(); 
    }
  ).then(result=>{
    res.redirect('/ilan-listesi');
  })
  .catch(err=>console.log(err));
                    
};

 exports.adminGuncelle=(req,res,next)=>{

 };


 
 exports.İlanEkleme=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll()])
   .then((veriler)=>{
     res.render('admin/ilan-islem', {
       pageTitle:'Admin | İlan Ekleme',
       path:'/ilan-ekle',
       admins:veriler[0],
       ilanlar:veriler[1],
       yonetici:req.session.user
     });
   })
   .catch(err=>console.log(err));
 };


 exports.getAdminDuzenle=(req,res,next)=>{
  //Başarıya adım adım!
  const admin_id=req.body.admin_id;
  kullanici.findOne({where:{id:admin_id}})
  .then(admn=>{
    res.render('admin/admin-ekle', {
      pageTitle:'Admin | Admin Düzenle',
      path:'/admin-duzenle',
      admin:admn,
      yonetici:req.session.user,
      errorsMessage:''
    });
  })
  .catch(err=>console.log(err));
};

 exports.getAdminEkle=(req,res,next)=>{
  //Başarıya adım adım!
   Promise
   .all([kullanici.findAll(),ilan.findAll()])
   .then((veriler)=>{
     res.render('admin/admin-ekle', {
       pageTitle:'Admin | Admin Ekle',
       path:'/admin-ekle',
       admins:veriler[0],
       ilanlar:veriler[1],
       yonetici:req.session.user,
       errorsMessage:'',
       validationErrors:[]
     });
   })
   .catch(err=>console.log(err));
 };



exports.postLogin=(req,res,next)=>{
  const eposta=req.body.eposta; //kullanıcı adıyla şifre alındı
  const sifre=req.body.sifre;
  const errors=validationResult(req);
  kullanici.findOne({where:{email:eposta}}).
  then(admin=>{
    if(admin)
    {
    bcrypt
    .compare(sifre,admin.password)
    .then(doMatch=>{
      console.log(admin.password)
      if(doMatch){
        req.session.isLoggedIn = true;
        req.session.user = admin;
        req.session.save(err => {
          Promise
   .all([ilan.count(),basvuran.count(),basvuran.findAll({where:{durum:1}})])
   .then((veriler)=>{   
     res.render('admin/admin_panel', {
      pageTitle: 'Anasayfa',
      path: '/admin-panel',
      isAuthenticated: req.session.isLoggedIn,
      ilan_sayisi:veriler[0],
      basvuran_sayisi:veriler[1],
      onayli_basvuran:veriler[2].length,
      yonetici:req.session.user,
    
     });
   })
   .catch(err=>console.log(err));
        /* res.render('admin/admin_panel', {
          pageTitle: 'Anasayfa',
          path: '/admin-panel',
          yonetici:admin,
          isAuthenticated: req.session.isLoggedIn
        }); */
        });
      }
      else{
        res.render('admin/admin-login', {
        pageTitle: 'Anasayfa',
        path: '/admin-login',
        oldInput:{
          eposta:eposta,
          sifre:sifre
        },
        errorsMessage:'Hatalı Şifre',
        validationErrors:errors.array()
      });

      }

    })
    .catch(err=>console.log(err));
    }
    else{
      res.render('admin/admin-login', {
      pageTitle: 'Anasayfa',
      path: '/admin-login',
      oldInput:{
        eposta:eposta,
        sifre:sifre
      },
      errorsMessage:errors.array()[0].msg,
      validationErrors:errors.array()
    });

    }
   })
   .catch(err => console.log(err));
}

exports.Logout = (req, res, next) => {
  /* req.session.isLoggedIn = false; */ //olmasada çalışıyor.
  req.session.destroy(err => {
    res.redirect('/login');
    
  });
};


exports.createAdmin=(req,res,next)=>{
  const ad=req.body.ad;
  const soyad=req.body.soyad;
  const eposta=req.body.eposta;
  const sifre=req.body.sifre;
  const sifre2=req.body.sifre2;
  const _yetki=req.body.yetki;
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    Promise
    .all([kullanici.findAll(),ilan.findAll()])
    .then((veriler)=>{
      res.render('admin/admin-ekle', {
        pageTitle:'Admin | Admin Ekle',
        path:'/admin-ekle',
        admins:veriler[0],
        ilanlar:veriler[1],
        yonetici:req.session.user,
        errorsMessage:errors.array()[0].msg,
        /* validationErrors:errors.array() */
      });
    })
    .catch(err=>console.log(err));
  }
  else{
    
      //Şifreyi güvenli hale getirdik
      bcrypt.hash(sifre,12).then(guvenli_sifre=>{kullanici.create({
        name:ad,
        surname:soyad,
        email:eposta,
        password:guvenli_sifre,
        yetki:_yetki,
      })
      .then(result=>{
        res.redirect('/table-panel')
      })
      .catch(err=>console.log(err))
  
      });
    
  
  }

  
}




exports.createİlan=(req,res,next)=>{
  const ad=req.body.is_adi;
  const pozisyon=req.body.pozisyon;
  const il=req.body.il;
  const ilce=req.body.ilce;
  const is_tanim=req.body.is_tanim;
  const kriter=req.body.kriter;
  var dizi_istanim=is_tanim.split("\r\n"); //Boşluğa göre diziye eleman ekleme
  var dizi_kriter=kriter.split("\r\n");
  console.log(dizi_istanim);
  console.log(dizi_kriter);
 
/*   console.log(ad,pozisyon,il,ilce,is_tanim,kriter); */

  ilan.create({
    is_adi:ad,
    pozisyon:pozisyon,
    il:il,
    ilce:ilce,
    durum:1
  })
  .then(result=>{
    ilan.findAll()
    .then(ilanlar=>{
      let uzunluk=ilanlar.length
      const sonİlan=ilanlar[(uzunluk-1  )]
      dizi_kriter.forEach(i => {
        if(i!=""){
        kriterr.create({
          kriter:i,
          ilanId:sonİlan.id,
        })
        }
      });
     
      return sonİlan.id;
    })
    .then(sonİlan=>{
      dizi_istanim.forEach(i => {
        if(i!=""){
        is_tanimm.create({
          tanim:i,
          ilanId:sonİlan,
          
        });
      }
      });
      
    })
    .then(result=>{
      res.redirect('/table-panel')
    })
    .catch(err=>console.log(err));
  })
  .catch(err=>{console.log(err)});

}


