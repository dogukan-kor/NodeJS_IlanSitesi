const {Sequelize,DataTypes}=require('sequelize');

const sequelize=require('../util/database');

const is_tanim=sequelize.define('is_tanim',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
      
    },
   tanim:{
      type:DataTypes.STRING,
      allowNull:false,
    },
 
  });
  
  
  module.exports=is_tanim;