var express = require('express');
var cors = require('cors')
var app = express();

const {connection}=require("./config/db")
const {Usermodel}=require("./models/user.model")
const {usern}=require("./routes/user.route")

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
// app.get('/chess', function (req, res) {
//   // res.sendFile(__dirname + '/public/index.html');
//   res.send("hello")
//   res.sendFile(process.cwd() + '/public/index.html');
// });






// app.use("/chess",express.static('public'));




// var io = require('socket.io')(http);

const { socketserver } = require("./serverscript/socketserver");

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

  console.log('listening u on port: ' + port);
});

// io.on('connection', function (socket) {
//   console.log('new connection');

//   // Called when the client calls socket.emit('move')
//   socket.on('move', function (msg) {
//     socket.broadcast.emit('move', msg);
//   });
// });



// var http = require('http').Server(app);