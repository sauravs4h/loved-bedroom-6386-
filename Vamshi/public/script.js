
const socket = io("/");
const videoGrid = document.getElementById("video-grid")

const mypeer = new Peer(undefined, {
    host : "/",
    port : '5051'
})

const myvideo = document.createElement("video");
myvideo.muted=true;
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio : true
}).then(stream =>{
    addvideoStream(myvideo,stream)

    mypeer.on('call', call =>{
        call.answer(stream)

        const video = document.createElement("video");
        call.on('stream',userVideoStream=>{
            addvideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',userId=>{
        connectToNewUser(userId , stream)
    })
})

 socket.on("user-disconnected",userId =>{
    if (peers[userId]) peers[userId].close()
 })

mypeer.on('open', id =>{
    socket.emit('join-room',ROOM_ID , id)
})

function connectToNewUser(userId,stream){
    const call = mypeer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addvideoStream(video, userVideoStream)
    })
    call.on('close',()=>{
        video.remove()
    })

    peers[userId] = call
}


function addvideoStream(video , stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}