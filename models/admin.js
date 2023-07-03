const {Sequelize,DataTypes}=require('sequelize');

const sequelize=require('../util/database');

const admin=sequelize.define('admins',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
      
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:true,
    },
    surname:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    yetki:{
      type:DataTypes.STRING,
      allowNull:false,
    }
  });
  
  
  module.exports=admin;