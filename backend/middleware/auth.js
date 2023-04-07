const jwt = require('jsonwebtoken');
const fs=require("fs");


const authentication=(req,res,next)=>{

    const token=req.headers.authorization?.split(" ")[1]

    if(!token){
       return res.send({msg:"please loginn"})
    }
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



