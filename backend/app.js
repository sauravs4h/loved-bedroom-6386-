var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;


app.get("/",(req,res)=>{
  return res.send("welcome to chess game")
})

// app.use("/chess",express.static('public'));

// app.get('/chess', function (req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });


var io = require('socket.io')(http);

const { socketserver } = require("./serverscript/socketserver");

socketserver(io);









http.listen(port, function () {
  console.log('listening u on port: ' + port);
});

// io.on('connection', function (socket) {
//   console.log('new connection');

//   // Called when the client calls socket.emit('move')
//   socket.on('move', function (msg) {
//     socket.broadcast.emit('move', msg);
//   });
// });

