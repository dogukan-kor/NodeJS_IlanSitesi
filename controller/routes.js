const ilan=require('../models/ilan');
const kriter=require('../models/kriter');
const is_tanim=require('../models/is-tanim');
const basvuran = require('../models/basvuranlar');

exports.sayfaGetir = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Anibal | Anasayfa',
        path: '/'
      });
};

exports.ilanGetir=(req,res,next)=>{
  ilan.findAll({where:{durum:1}})
  .then(ilanlar=>{
    res.render('is-ilan',{
      pageTitle:'Anibal | İş İlanları',
      path:'/is-ilan',
      ilan:ilanlar
    })
  })
  .catch(err=>console.log(err));  
}


exports.ilanDetayGetir=(req,res,next)=>{
  ilan.findAll()
  .then(ilanlar=>{
    res.render('is-ilan',{
      pageTitle:'Anibal | Detay',
      path:'/is-ilan',
      ilan:ilanlar
    })
  })
  .catch(err=>console.log(err));

}

exports.detayaGit=(req,res,next)=>{
  const ilan_id=req.body.ilan_id;
  console.log('ilan id:',ilan_id)
  Promise
  .all([kriter.findAll({where:{ilanId:ilan_id}}),is_tanim.findAll({where:{ilanId:ilan_id}}),ilan.findOne({where:{id:ilan_id}})])
  .then((veriler)=>{
   res.render('is-ilan-detay',{
      pageTitle:'Anibal | İlan Detay',
      path:'/is-ilan-detay',
      kriter:veriler[0],
      is_tanim:veriler[1],
      ilan:veriler[2],
    })
  })
  .catch(err=>console.log(err));
}

exports.basvuruYap=(req,res,next)=>{
  const ilan_id=req.body.ilan_id
  ilan.findOne({where:{id:ilan_id}})
  .then(_ilan=>{  
    res.render('is-basvuru',{
    pageTitle:'Anibal | İlan Başvuru',
    path:'/is-ilan-basvuru',
    ilan:_ilan

  })
})
  .catch(err=>console.log(err));

}

exports.basvuruGonder=(req,res,next)=>{
  const adsoyad=req.body.adsoyad;
  const eposta=req.body.eposta;
  const telefon=req.body.telefon;
  const resim=req.files.kullanici_foto;
  const cv=req.files.cv; 
  const on_yazi=req.body.onyazi;
  const maas=req.body.maas;
  const is_id=req.body.ilan_id;
  const date = new Date();
  const resimUrl=(resim[0].path).split('public');
  const cvUrl=(cv[0].path).split('public');

   basvuran.create({
    ad_soyad:adsoyad,
    email:eposta,
    telefon:telefon,
    resim:resimUrl[1],
    cv:cvUrl[1],
    on_yazi:on_yazi,
    maas_beklenti:maas,
    ilanId:is_id,
    durum:0
  })
  .then(result=>{
    res.redirect('/') 
  })
  .catch(err=>console.log(err)) 
  
  
}





