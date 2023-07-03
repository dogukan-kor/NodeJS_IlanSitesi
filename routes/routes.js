const path = require('path');

const express = require('express');

const Routes=require('../controller/routes');

const router=express.Router();

router.get('/', Routes.sayfaGetir);

router.get('/is-ilan',Routes.ilanGetir);

router.get('/is-ilan-detay',Routes.ilanDetayGetir);

router.post('/detay_Getir',Routes.detayaGit);

router.post('/basvuruYap',Routes.basvuruYap);

router.post('/basvuruYolla',Routes.basvuruGonder);

module.exports=router;