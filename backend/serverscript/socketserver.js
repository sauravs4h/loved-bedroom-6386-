const { uid } = require('uid');
let users=[];


const {redis}=require("../servise/redis");


const socketserver=(io)=>{
    
    io.on("connection",(socket)=>{
        console.log("client is connected");

        socket.on("username",(name)=>{
            
            let username=name;
            let room=uid(10)
       
            const user={
                id: socket.id,
                name: username,
                room: room
            }

            users.push(user)

            socket.join(room);
         //   console.log(users)
            io.emit("roomDetail", users);

        });
        
        socket.on('sendJoinRequest', (requestData) => {

            let user = users.filter(user=>user.id == socket.id)[0];

            socket.broadcast.to(requestData.room).emit('joinRequestRecieved', {
                id: user.id,
                name: user.name,
                room: user.room
            });
        });
        socket.on('acceptGameRequest', (requestData) => {
           // 
            let user = users.filter(user=>user.id == socket.id)[0];
            let room=user.room

            console.log("b"+room)
           
            socket.broadcast.to(requestData).emit('gameRequestAccepted', {
                id: user.id,
                name: user.name,
                room: user.room,

                
            });

            socket.broadcast.to(requestData).emit('ooproom', room);  
            
        });

        socket.on("setOrientation",(data)=>{
            let user = users.filter(user=>user.id == socket.id)[0];

         //   console.log(user)
            socket.broadcast.to(data.room).emit('setOrientationOppnt', {
                color:data.color,
                id: user.id,
                name: user.name,
                room: user.room,
            });
        })

        socket.on('move', (requestData) => {
            console.log(requestData);
            socket.broadcast.emit('move', requestData);
            socket.broadcast.to(requestData.room).emit('oppntChessMove',{
                // color: requestData.color,
                from: requestData.from,
                to: requestData.to,
                piece: requestData.piece,
                promo: requestData.promo||''

            });
        });
    })
}
module.exports={socketserver}
