const express=require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require("cookie-parser");


const {Usermodel}=require("../models/user.model");


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

    if(useravailable){
        bcrypt.compare(password, hashpassword, function(err, result) {
            
            if(err){
                return res.send("try again")
            }
            if(result==false){
               return res.send({msg:"login faild",status:"error"})
            }
            const token = jwt.sign({ id: userid }, 'hush');

            res.cookie("name",username)
            res.cookie("token",token)
            return res.send({msg:"login successful","token":token,status:"success","name":username});

            
        });
        
    }
    else{
        return res.send({msg:"please signup",status:"error"})
    }
    
})



module.exports={usern}