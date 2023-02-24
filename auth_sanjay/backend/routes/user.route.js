const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const{Usermodel}=require("../models/user.model");
const userRouter=express.Router();
const {authenticate}=require("../middlewares/authenticaton");
const multer=require("multer");
const app=express();
const redis = require('ioredis');
const redisClient = redis.createClient({host:'redis-11809.c256.us-east-1-2.ec2.cloud.redislabs.com',
                                        port:"11809",
                                        username:"default",
                                        password:'ynHf48XJCqLzzxdG4qLiRc8u8A6EVt0W'});

redisClient.on('connect',() => {
    console.log('connected to redis successfully!');
})

redisClient.on('error',(error) => {
    console.log('Redis connection error :', error);
})
// const redis=require("redis");
// const client=redis.createClient();
// client.on("err",(err)=>console.log("redis client error"));

// client.connect();
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
    
    let  {userName,email,password,status,img}=req.body;
    if(!status){
        status=false
    }
    let imgobj={
        data:"",
        contentType: "image/png"
    }
    try {
        bcrypt.hash(password,5,async(err,secure_password)=>{
            if(err){
                console.log(err);
            }
            else{
                const user=new Usermodel({userName,email,password:secure_password,status,img:imgobj});
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

userRouter.get("/getuserdetail",authenticate,async(req,res)=>{
    let userId=req.body.userId;
    await client.set("id",userId);
    try {
        let userData=await Usermodel.findOne({_id:userId});
        res.send(userData);
    } catch (error) {
        console.log(error);
        console.log("something went wrong");
    }
})


const path = require('path');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage,
    // limits:{fileSize: 1000000},
    // fileFilter: function(req, file, cb){
    //   checkFileType(file, cb);
    // }
  }).single('myImage');

  userRouter.post('/upload',async(req, res) => {
    // let userId=await client.get("id");
    upload(req, res, async(err) => {
        if(err){
          console.log(err);
        } else {
            const saveImage =  {
                          data: fs.readFileSync("uploads/" + req.file.filename),
                          contentType: "image/png",
                        }
                    // console.log(saveImage.data);
                    await client.set("imgdata",JSON.stringify(saveImage));z
                    // console.log(JSON.parse(imgdata))
             }
      });
  });
    // console.log(obj)
    
    userRouter.patch("/updateuser",async(req,res)=>{
    let imgdata=await client.get("imgdata")
        let userId=await client.get("id");
        let stringified_data=JSON.parse(imgdata);
    // console.log(userId)
        try {
            let final_data={
                data: Buffer.from(stringified_data.data.data),
                contentType: "image/png",
            }
            // console.log(final_data);
            await Usermodel.findByIdAndUpdate({_id:userId},{img:final_data});
            // res.send(stringified_data)
            res.send({"msg":"Updated the userimg","data":final_data});
        } catch (error) {
            console.log(error);
            console.log("something went wrong");
        }
    })
userRouter.get("/logout",authenticate,async(req,res)=>{
    const token=req.headers.authorization;
    // console.log(token)
    await redisClient.rpush("blacklistToken",token)
    // const blacklisteddata=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    // blacklisteddata.push(token);
    // fs.writeFileSync("./blacklist.json",JSON.stringify(blacklisteddata));
    res.send({"msg":"Logged out successfully"});
})


module.exports={
    userRouter,
    redisClient
}