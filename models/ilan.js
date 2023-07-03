const {Sequelize,DataTypes}=require('sequelize');

const sequelize=require('../util/database');

const ilan=sequelize.define('ilan',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
      
    },
    is_adi:{
      type:DataTypes.STRING,
      allowNull:false,
    },
   pozisyon:{
      type:DataTypes.STRING,
      allowNull:false,
    },
   il:{
      type:DataTypes.STRING,
      allowNull:false,
    },
   ilce:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    durum:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
  });
  
  
  module.exports=ilan;