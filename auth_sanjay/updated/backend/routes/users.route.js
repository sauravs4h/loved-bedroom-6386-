const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const {Usermodel} = require("../models/user.model");
const {authenticator} = require("../middleware/authorization")
const fs = require("fs")
const redis = require('ioredis');
const path = require("path")


const redisClient = redis.createClient({host:'redis-17642.c305.ap-south-1-1.ec2.cloud.redislabs.com',
                                        port:"17642",
                                        username:"default",
                                        password:'emUuXynvxsTVrvthAn7w7HoBzaBVr6FU'});

redisClient.on('connect',() => {
    console.log('connected to redis successfully!');
})

redisClient.on('error',(error) => {
    console.log('Redis connection error :', error);
})

// redisClient.set("place","bangalore");

// console.log(await redisClient.get("place"))

// redisClient.set("id",456454);



const userRoute = express.Router()


/// user register through the link --------->localhost:5050/user/register
                   //data required --------->{
                                        //      "userName":"vamshi",
                                        //      "email":"yendavamshi@gmail.com",
                                        //      "password":"vamshi"
                                        //  }
                  // Method  --------------> POST     
                  //And we are also checking for unique username and email while registering                 
userRoute.post("/register",async(req,res)=>{
    const {userName,email,password,status,img}=req.body;
    try {
        let all_data = await Usermodel.find({email});

        if(all_data.length === 0){
            bcrypt.hash(password, 5,async(err,val)=>{
                if(err){
                    res.send("some thing went wrong")
                }else{
                    let nickname = await Usermodel.find({userName});
                     if(nickname.length > 0){
                        res.send({"Response" : "UserName already Used"})
                    
                        }else{
                            let imgobj={
                                data:"",
                                contentType: "image/png"
                            }
                    const user=new Usermodel({userName,email,password:val,status:false,img:imgobj});
                    await user.save()
                    res.send({"Response" : "User registered Successfully"})
                        }
                }
            })
        }else{
            res.send({"Response" : "User already registered with same mail"})
        }
    } catch (error) {
        res.send("some thing went wrong")
    }
})


//User to login form the link is ----------------> localhost:5050/user/login
                         //Body  ----------------> 
                                                //    {
                                                //     "userName" : "ram",
                                                //     "password" : "vamshi"
                                                //    }
                        //Method----------------> POST 
// In response ------------------> access_tocken and userdetials will be given                        
userRoute.post("/login",async(req,res)=>{
    
    const {userName,password}=req.body;
    try {
        const user = await Usermodel.find({userName});
        const hashed_pass = user[0].password;
        if(user.length>0){
            bcrypt.compare(password,hashed_pass,async(err,result)=>{
                if(result){
                    const token = jwt.sign({userid:user[0]._id},process.env.key);
                    const {_id,userName,email,password,status,img} = user[0]
                    let body = {
                        status : true
                    }
                    await Usermodel.findByIdAndUpdate(_id,body)
                    res.status(200).send({"msg":"Login Successfull","Access_Token":token,"username":userName,"email":email})
                }else{
                    res.status(401).send({err :"Wrong Password"})
                }
            })
        }else{
            res.status(404).send({err : "User not registered"})
        }
    } catch (error) {
        res.status(400).send({err : "Wrong crenditials"})
    }
})


// for admin to get all the users ----->localhost:5050/user/allusers
userRoute.get("/allusers",async(req,res)=>{
    try {
        let allusers = await Usermodel.find();
        res.status(200).send(allusers)
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({
    storage: storage,
}).single('myImage');


userRoute.post('/upload',async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
          console.log(err);
        } else {
            const saveImage =  {
                          data: fs.readFileSync("uploads/" + req.file.filename),
                          contentType: "image/png",
                        }
                    await redisClient.set("imgdata",JSON.stringify(saveImage));
             }
      });
  });

userRoute.use(authenticator);


userRoute.get("/getuserdetail",async(req,res)=>{
    let userId=req.body.userid;
    await redisClient.set("user_id",userId);
    try {
        let userData=await Usermodel.findOne({_id:userId});
        res.send(userData);
    } catch (error) {
        console.log(error);
        console.log("something went wrong");
    }
})

userRoute.patch("/updateuser",async(req,res)=>{
    let imgdata=await redisClient.get("imgdata")
        let userId = req.body.userid;
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





//for user logout  -------------------->localhost:5050/user/logout
                //---------------------> Authorization required
userRoute.post('/logout',async(req,res)=>{
    try {
        const token=req.headers.authorization;
        await redisClient.rpush("blacklistToken",token)
        let body = {
            status : false
        }
        await Usermodel.findByIdAndUpdate({_id:req.body.userid},body)
        
        res.status(200).send({msg:'Logged out successfully..'});
    } 
    catch (error) {
        res.send(error);
    }
})





module.exports={
    userRoute,
    redisClient
}

