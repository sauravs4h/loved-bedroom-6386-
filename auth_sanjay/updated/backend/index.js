const express = require("express");
const cors = require("cors")
require("dotenv").config();




//methods
const {connection}=require("./config/db")
const {userRoute} = require("./routes/users.route")





const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))




app.get("/",async(req,res)=>{
    res.status(400).send("every thing is working good in the server")
})

app.use("/user",userRoute)

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Server is connected to DB")
    } catch (error) {
        console.log("Not able to connect to DB")
    }
    console.log(`The server is connected to ${process.env.port}`)
})



