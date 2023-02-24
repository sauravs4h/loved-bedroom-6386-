const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const redis = require('ioredis');
//const {redisClient}= require("../routes/users.route")


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



const authenticator= async function(req,res,next){
    try {
        const token=req.headers.authorization;
        if(!token){
            console.log(2)
            res.send({err: 'Please login again..!'});
        }
        let blacklisteddata=await redisClient.lrange("blacklistToken",0,-1);

        if(blacklisteddata.includes(token)){
            console.log(1)
        res.send({err:"Please login again..!"});
        }else{
        jwt.verify(token,process.env.key,(err,decoded)=>{
            if(decoded){
                const userID = decoded.userid;
                req.body.userid = userID
                next();
            }
            else{
                console.log(3)
                res.send({err: 'Please login again..!'});
            }
        })
    }
    }
    
    catch (error) {
        res.send('Something went wrongg..!');
    }
}

module.exports={authenticator}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2M2Y3Yzk1NGUzMzIzZTRhODM2Njk1OGEiLCJpYXQiOjE2NzcyNDE4ODR9.wM8IGqnS_4Lvl2e2vgvyoTi9eCFhLptuW4yFrLVZ4uE