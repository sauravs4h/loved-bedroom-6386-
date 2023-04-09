var express = require('express');
var cors = require('cors')
var app = express();

const {connection}=require("./config/db");
const {Usermodel}=require("./models/user.model");
const {usern}=require("./routes/user.route");
const { socketserver } = require("./serverscript/socketserver");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/user",usern)


app.get("/",(req,res)=>{
  return res.send("welcome to chess game")
})

const http=require("http");
const httpserver=http.createServer(app);

const Server=require("socket.io");
const io=new Server(httpserver,{ cors: { origin: "*" } });
app.use("/chess",express.static('public'));



socketserver(io);

var port = process.env.PORT || 3000;

httpserver.listen(port, async function () {

  try{
    await connection
    console.log("connect with db")
  }
  catch(err){
    console.log(err)
  }

  console.log('listening to port: ' + port);
});
