// const socketa = io("http://localhost:3000/", { transports: ["websocket"] })
const socket = io("http://localhost:3000/", { transports: ["websocket"] })




let username = prompt("Enter your name", "shaktiman");


socket.emit("username", username)

let namediv = document.getElementById("names");

socket.on("roomDetail", (detail) => {
    console.log(detail);

    namediv.innerHTML = "";

    detail.forEach((el) => {

        let player = document.createElement("h3");
        player.innerHTML = el.name;
        namediv.append(player);

        player.addEventListener("click", () => {
            sendrequest(el)

        })
    })
})

let notidiv = document.getElementById("notification");


function sendrequest(el){
    socket.emit('sendJoinRequest',el);
    // notidiv.innerHTML="";
    // let sentnote=document.createElement("p");
    // sentnote.innerText="request has been sent";
    alert("request has been sent")

    // notidiv.append(sentnote)
}




socket.on('joinRequestRecieved', (userData) => {

    notidiv.innerHTML="";
    let notification=document.createElement("p")
    let joinbutton=document.createElement("button");
    notification.innerText=`Recieved a game request from ${userData.name}`

    
    joinbutton.innerText="join";
    joinbutton.classList.add("joinbutton")


    joinbutton.addEventListener("click",()=>{

        acceptrequest(userData)
    })
    notidiv.append(notification,joinbutton)





    // console.log(userData);
    // $('.notification')
    // .html('<div class="alert alert-success">Recieved a game request from <strong>'+userData.name+'</strong>. <button data-room="'+userData.room+'" class="btn btn-primary btn-sm acceptGameRequest">Accept</button></div>')
});

function acceptrequest(userData) {



    let room = userData.room
    socket.emit('acceptGameRequest', room);


    notidiv.innerHTML="";
    // let sentnote=document.createElement("p");
    // sentnote.innerText="Please wait for game initialize from host";
    alert("Please wait for game initialize from host")


    // notidiv.append(sentnote)


}



socket.on('gameRequestAccepted', (userData) => {

    // let responce= await redis.set("buser",userData);
    // console.log("ooooooooo", responce)


    notidiv.innerHTML = "";
    let sentnote = document.createElement("p");
    sentnote.innerText = `Game request accepted from ${userData.name}`;


    let choicediv = document.createElement("div");
    let choice_text = document.createElement("p");
    choice_text.innerHTML = 'choose rotetion Choose rotation. <button data-room="' + userData.room + '" data-color="black" type="button" class="btn btn-primary btn-sm setOrientation">Black</button> or <button data-room="' + userData.room + '" data-color="white" type="button" class="btn btn-primary btn-sm setOrientation">White</button>';


    choicediv.append(choice_text);

    notidiv.append(sentnote, choicediv);

});


// code added by vamshi
// send msg 
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");


send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});


socket.on("createMessage", (message, userName) => {
  var time = new Date();
  let cur_time = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <span ${true === true ? "class=outgoing"
      : "class=incoming"}>${message}  <span class="time">   (From ${userName} ${cur_time}) <span></span>
       
    </div>`;
});


















