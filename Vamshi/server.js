const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const {v4 : uuidV4} = require("uuid")

app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/",(req,res)=>{
  res.redirect(`/${uuidV4()}`)
})








app.get("/:room",(req,res)=>{
    res.render("room",{roomId : req.params.room})
})


io.on("connection",socket =>{
  socket.on("join-room",(roomId,userId,user)=>{
  //   var rooms = io.sockets.adapter.rooms;
  //   var clients = function (rm) {
  //     return io.of('/').adapter.rooms[rm];
  // };
  //   console.log(rooms)

  io.in(`${roomId}`).allSockets().then(result=>{
    if(result.size < 2){
      socket.join(roomId)
      setTimeout(() => {
        socket.broadcast.to(roomId).emit("user-connected", userId);
      }, 1000);
    } 
  })
    

    
    // socket.broadcast.emit("wickets",`${wickets}`)
    
    
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message,user);
    });

    socket.on('disconnect',()=>{
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    })
  })
})

let port = 5050

server.listen(port,()=>{
  console.log(`start on port ${port}`)
})