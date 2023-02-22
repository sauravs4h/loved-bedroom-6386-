const jwt=require("jsonwebtoken");
const fs=require("fs");

const authenticate=(req,res,next)=>{
    // const token =req.headers.authorization?.split(" ")[1];
    const token =req.headers.authorization;
    if(!token){
        res.send({"msg":"login again"})
    }
    const blacklisteddata=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    if(blacklisteddata.includes(token)){
        return res.send("Login again");
    }else{
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