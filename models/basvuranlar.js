const {Sequelize,DataTypes}=require('sequelize');

const sequelize=require('../util/database');

const basvuran=sequelize.define('basvuran',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
      
    },
    ad_soyad:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    telefon:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
      },
    resim:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    cv:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    on_yazi:{
        type:DataTypes.STRING,
        allowNull:false,
      },
    maas_beklenti:{
        type:DataTypes.INTEGER,
        allowNull:false,
       },
    durum:{
        type:DataTypes.INTEGER,
        allowNull:false,
       },
  });
  
  
  module.exports=basvuran;