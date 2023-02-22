const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    userName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    status:Boolean
},{versionKey:false});

const Usermodel=mongoose.model("users",userSchema);


module.exports={
    Usermodel
}