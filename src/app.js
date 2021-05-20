const mongoose=require("mongoose");
const dotenv=require("dotenv");
const express=require("express");
const app=express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

//dotenv.config({path:'./config.env'});
require("../db/conn");
app.use(require("../router/auth"));
const User=require("../models/userschema");
//const user=require("../models/userschema");
const port = process.env.PORT || 5000 ;

if(process.env.NODE_ENV== "production")
{
    app.use(express.static("client/build"));
}





app.listen(port,(req,res)=>{
    console.log(`server is running at port no ${port} `);
})