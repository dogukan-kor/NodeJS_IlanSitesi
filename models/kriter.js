const {Sequelize,DataTypes}=require('sequelize');

const sequelize=require('../util/database');

const kriter=sequelize.define('kriter',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
      
    },
   kriter:{
      type:DataTypes.STRING,
      allowNull:false,
    },
 
  });
  
  
  module.exports=kriter;