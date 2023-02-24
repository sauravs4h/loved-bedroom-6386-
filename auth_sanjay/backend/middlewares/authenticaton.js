const jwt=require("jsonwebtoken");
const fs=require("fs");
// const {redisClient}=require("../routes/user.route")
const redis = require('ioredis');
const redisClient = redis.createClient({host:'redis-11809.c256.us-east-1-2.ec2.cloud.redislabs.com',
                                        port:"11809",
                                        username:"default",
                                        password:'ynHf48XJCqLzzxdG4qLiRc8u8A6EVt0W'});

redisClient.on('connect',() => {
    console.log('connected to redis successfully!');
})

const authenticate=async (req,res,next)=>{
    // const token =req.headers.authorization?.split(" ")[1];
    const token =req.headers.authorization;
    if(!token){
        res.send({"msg":"login again"})
    }
    let blacklisteddata=await redisClient.lrange("blacklistToken",0,-1);

    if(blacklisteddata.includes(token)){
        return res.send("Login again");
    }
    // const blacklisteddata=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    // if(blacklisteddata.includes(token)){
    //     return res.send("Login again");
    // }
    else{
        // console.log(data);
        jwt.verify(token,"chess",(err,decoded)=>{
            if(err){
                res.send({"msg":"Pls login again","err":err.message});
            }else{
                req.body.userId=decoded.userID;
                next();
            }
        })
    }
    
}

module.exports={
    authenticate
}