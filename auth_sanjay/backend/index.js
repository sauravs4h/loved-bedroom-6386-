const express=require("express");
const cors=require("cors")
const app=express();
const {connection}=require("./configs/db");
const {userRouter}=require("./routes/user.route");
const {authenticate}=require("./middlewares/authenticaton")
require("dotenv").config();

app.use(express.json())

app.use(cors({
    origin:"*"
}));
// app.use(express.static("public"))
app.get("/",(req,res)=>{
    res.send("WELCOME")
});
app.use("/user",userRouter)

app.get("/chesspage",authenticate,(req,res)=>{
    res.send("chess page");
})
const port=4000;

app.listen(port,async()=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
        console.log({"msg":"something went wrong while connecting to server"});
    }
    console.log(`The Server is running at ${port}`)
})