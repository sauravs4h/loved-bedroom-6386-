let userName=document.getElementById("userName");
let email=document.getElementById("email");
let user_status=document.getElementById("status");



async function getUserProfileData(){
    try{
        console.log(localStorage.getItem("auth_token"))
        let userData = await fetch("http://localhost:4000/user/getuserdetail",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`${localStorage.getItem("auth_token")}`
            },
        })

        if(userData.ok){
            let data=await userData.json();
            adduserdetail(data);
            console.log(data);

        }else{
            console.log("error");
            alert("wrong credentials")
        }
    }
    catch(err){
        alert("wrong credentials")
        console.log("Some error");
    }
}

 // let renderimg=document.getElementById("renderimg");
        let render=document.querySelector(".imageupload2")
        function adduserdetail(data){
            userName.innerText=data.userName;
            email.innerText=data.email;
            if(data.img.data.data==""){
                render.innerHTML=`<img  alt="userimg" id="renderimg" src="https://thumbs.dreamstime.com/b/man-icon-profile-member-user-perconal-symbol-vector-white-isolated-background-136664260.jpg">`
            }else{
                const base64String = btoa(
                    String.fromCharCode(...new Uint8Array(data.img.data.data))
                  );
                var image = new Image();
                image.src = `data:image/png;base64, ${base64String}`;
                render.appendChild(image)
            }
        }
// console.log(base64String)
// renderimg.style.src=`data:image/png;base64,${base64String}`;

async function updateimg(){
    try{
        let userData=await fetch("http://localhost:4000/user/updateuser",{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                Authorization:`${localStorage.getItem("auth_token")}`
            }
        })
        if(userData.ok){
            let d=await userData.json();
            // console.log(d.data);
            // getUserProfileData()
            // let data=await userData.json();
            // adduserdetail(data);
            // console.log(data);
        }else{
            console.log("error");
        }
    }
    catch(err){
        console.log("Some error");
    }
}
updateimg();
getUserProfileData();
