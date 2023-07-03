const {Sequelize,DataTypes}=require('sequelize');

const sequelize=new Sequelize('anibal','root','Dk123.',{
    dialect:'mysql',
    host:'localhost'}
);

module.exports=sequelize;


