const express=require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const fs=require("fs")

const cookieParser = require("cookie-parser");


const {Usermodel}=require("../models/user.model");
// const { json } = require("express");
// const { stringify } = require("querystring");
// const redis=require("../services/redis")


const usern=express.Router();

usern.use(express.json());
usern.use(cookieParser());


usern.get("/",(req,res)=>{
    res.send("this is user routes")
})



usern.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body;

    const useravailable= await Usermodel.findOne({email});

    if(useravailable){
       return  res.send({msg:"you are already available , please login"});
    }

    bcrypt.hash(password, 5, async function(err, hash) {
        if(err){
            res.send({msg:"something is wrong",status:"error"})
        }
        const user= new Usermodel({name,email,password:hash});
        await user.save();
        return res.send({msg:"signup successful",status:"success"});
    });
})

usern.post("/login",async(req,res)=>{
    
    const {email,password}=req.body;
    
    const useravailable= await Usermodel.findOne({email});
    const userid=useravailable?._id;
    const username=useravailable?.name;
    const hashpassword=useravailable?.password

     //console.log(hashpassword);

    if(useravailable){
        bcrypt.compare(password, hashpassword, function(err, result) {
            
            if(err){
                return res.send("try again")
            }
            if(result==false){
               return res.send({msg:"login faild",status:"error"})
            }
            const token = jwt.sign({ id: userid }, 'hush');
            // const refreshtoken = jwt.sign({ id: userid }, 'dush',{expiresIn:"7d"});

            // return res.send({msg:"login successful","token":token,status:"success",refreshtoken:refreshtoken,"name":username});

            res.cookie("name",username)
            res.cookie("token",token)
            return res.send({msg:"login successful","token":token,status:"success","name":username});

            
        });
        
    }
    else{
        return res.send({msg:"please signup",status:"error"})
    }
    
})

// usern.get("/refreshtoken",(req,res)=>{

//     const token=req.headers.authorization?.split(" ")[1]

//     if(!token){
//         return res.send({msg:"please login"});
//     }

//     jwt.verify(token, 'dush', function(err, decoded) {
//         if(err){
//             return res.send({msg:"please login"})
//         }else{
//             const refreshtoken = jwt.sign({  }, 'hush',{expiresIn:"1hr"});
//             res.send({token:refreshtoken});
//         }
        
//       });
    
    
// })


// usern.post("/logout",(req,res)=>{

//     const token=req.headers.authorization?.split(" ")[1];
//     const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
//     let tokenavailable=blacklist.includes(token)
//     //console.log(tokenavailable);

//     if(!tokenavailable){
//         blacklist.push(token);
//         fs.writeFileSync("./blacklist.json",JSON.stringify(blacklist));
//     }
    
//     return res.send({msg:"logout successfully"})
    

    
// })


// usern.post("/forgetpassword",async(req,res)=>{
//     const {email,newpassword,otp}=req.body;

//     if(email==undefined||newpassword==undefined||otp==undefined){
//         return res.send({msg:"enter full details",status:"error"});
//     }

//     try{
//         let validotp=await redis.get(email+"otp")

//         let user=await Usermodel.findOne({email});
//         console.log(user)

//         let user_id=user._id

//         if(otp==validotp){

//             bcrypt.hash(newpassword, 5, async function(err, hash) {
//                 if(err){
//                     res.send({msg:"something is wrong",status:"error"})
//                 }
//                 await Usermodel.findByIdAndUpdate(user_id,{password:hash});
//                 return res.send({msg:"password update successfully",status:"success"});
//             });

//             // await Usermodel.findByIdAndUpdate(email,{password:newpassword});

//             // return res.send({msg:"password update successfully"})
//         }
//         else{
//             return res.send({msg:"invalid otp",status:"error"})
//         }
//     }
//     catch(err){
//         console.log(err);
//     }
    


    
// })



module.exports={usern}