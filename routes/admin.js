const path = require('path');
const express = require('express');
const { check,body } = require('express-validator/check');

const AdminController=require('../controller/admin');
const isAuth=require('../middleware/is-auth');

const { Router } = require('express');
const kullanici=require('../models/admin');

const adminRouter=express.Router();

adminRouter.get('/login', AdminController.getLogin);

adminRouter.get('/admin-panel',isAuth, AdminController.getPanel);

adminRouter.get('/form-panel',isAuth, AdminController.getFormPanel);

adminRouter.get('/table-panel',isAuth, AdminController.getTablePanel);

adminRouter.get('/basvuru-listesi',isAuth, AdminController.getBasvuruList); 

adminRouter.get('/red-basvuru-listesi',isAuth, AdminController.getRedBasvuruList); 

adminRouter.get('/onay-basvuru-listesi',isAuth, AdminController.getOnayBasvuruList); 

adminRouter.get('/ilan-listesi',isAuth, AdminController.getİlanList);

adminRouter.get('/aski-ilan',isAuth, AdminController.getAskiİlan);

adminRouter.get('/admin-listesi',isAuth, AdminController.getAdminList);

adminRouter.post('/ilan-duzenle',isAuth, AdminController.İlanDuzenle);

adminRouter.post('/ilan_Guncelle',isAuth, AdminController.İlanGuncelle);

adminRouter.post('/basvuruCevapla',isAuth,AdminController.basvuruCevap);

adminRouter.get('/ilan-ekleme',isAuth, AdminController.İlanEkleme);

adminRouter.post('/admin-duzenle',isAuth, AdminController.getAdminDuzenle);

adminRouter.post('/admin-guncelle',isAuth, AdminController.adminGuncelle);

adminRouter.get('/admin-ekle',isAuth, AdminController.getAdminEkle);

adminRouter.post('/basvuru-detay',isAuth, AdminController.BasvuruDetay);

adminRouter.get('/logout', AdminController.Logout);

adminRouter.post('/Admin',[
    check('eposta')
    .isEmail()
    .withMessage('E Posta formatı hatalı!')
    .custom((value,{req})=>{
        return kullanici.findOne({where:{email:value}})
        .then(user=>{
            if(!user){
                return Promise.reject('Bu e-postaya kayıtlı bir kullanıcı mevcut değil!')
            }
        })
    }),
 
    body('sifre', 'Şifre formatı hatalı!')
      .isLength({ min: 5 })
      .isAlphanumeric()
],
AdminController.postLogin);

adminRouter.post('/admin_Ekle',[
    check('eposta')
    .isEmail()
    .withMessage('Geçersiz E-Posta adresi girdiniz.Lütfen tekrar deneyin.')
    .custom((value,{req})=>{
        return kullanici.findOne({where:{email:value}})
        .then(user=>{
            if(user){
                return Promise.reject('Bu e-postaya kayıtlı bir kullanıcı mevcut!')
            }
        })
    }),

    body(
        'sifre',
        'Lütfen 6 karakterli ve numeric değerli bir şifre giriniz'
        )
        .isLength({min:6})
        .isAlphanumeric(),
    body('sifre2',).custom((value,{req})=>{
        if(value!==req.body.sifre){
            throw new Error('Şifreler eşleşmiyor!')
        }
        return true;
    })





    
],
AdminController.createAdmin
); 

adminRouter.post('/ilan_Ekle',AdminController.createİlan);

module.exports=adminRouter;