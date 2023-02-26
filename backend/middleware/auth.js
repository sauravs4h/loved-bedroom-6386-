const jwt = require('jsonwebtoken');
const fs=require("fs");


const authentication=(req,res,next)=>{

    const token=req.headers.authorization?.split(" ")[1]

    if(!token){
       return res.send({msg:"please loginn"})
    }

    
    // const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
    

    // if(blacklist.includes(token)){
    //     res.send({msg:"please login"})
    // }else{
        jwt.verify(token, 'hush', function(err, decoded) {
            if(err){
                return res.send({msg:err.message,status:"error"})
            }

          console.log("decode:-",decoded)
            
            const mainid=decoded.id;
            req.body.userid=mainid;
          
    
            
            next()
          });

    

    

}


module.exports={authentication}



