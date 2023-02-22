const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const{Usermodel}=require("../models/user.model");
const userRouter=express.Router();
// const redis=require("redis");
// const authenticate=require("../middlewares/authenticate.middleware");
// var cookieParser = require('cookie-parser');
// const app=express();
// app.use(cookieParser())
const fs=require("fs")
// const Client=redis.createClient();
// Client.on("error",(err)=> console.log("Redis client error"));
// Client.connect();
userRouter.post("/register",async (req,res)=>{
    
    let  {userName,email,password,status}=req.body;
    if(!status){
        status=false
    }
    try {
        bcrypt.hash(password,5,async(err,secure_password)=>{
            if(err){
                console.log(err);
            }
            else{
                const user=new Usermodel({userName,email,password:secure_password,status});
                await user.save();
                res.send({"msg":"User Registered"});
            }
        })
    } catch (error) {
        console.log(error);
        res.send({"msg":"Errror while registering"});
    }
});

userRouter.post("/login",async(req,res)=>{
    const {userName,password}=req.body;
    try {
        const user=await Usermodel.find({userName});
        // console.log(user)
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result ==true){
                    const token=jwt.sign({userID:user[0]._id},"chess");
                    // res.cookie("token","this is the token stored in cookie");
                    // res.cookie("token",token);
                    // Client.SETEX("token",60,token);
                    // const refreshtoken=jwt.sign({userID:user[0]._id,userrole:user.role},"refreshsecret",{expiresIn:300});
                    // Client.SETEX("refreshtoken",300,refreshtoken);
                    res.send({"msg":"login successful","token":token})
                }else{
                    res.send({"msg":"Wrong credentials"});
                }
            })
        }else{
            res.send("wrong credentials");
        }
    } catch (error) {
        console.log(error);
        console.log("something went wrong");
    }
})
// userRouter.get("/getnewtoken",async(req,res)=>{
//     const refreshtoken=await Client.GET("refreshtoken");
//     if(!refreshtoken){
//         res.send("Login again");
//     }
//     jwt.verify(refreshtoken,"refreshsecret",(err,decoded)=>{
//         if(err){
//             res.send({"msg":"pls login again","err":err.message})
//         }else{
//             console.log(decoded)
//             const token=jwt.sign({userID:decoded.userID},"sanjay",{expiresIn:60});
//             Client.SETEX("token",60,token);
//             res.send({"msg":"login successfull got an another token through refresh token",token})
//         }
//     })
// })
userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization;
    // await Client.rPush("blacklist",token);
    const blacklisteddata=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    blacklisteddata.push(token);
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklisteddata));
    res.send({"msg":"Logged out successfully"});
})
module.exports={
    userRouter
}