let inputloginform=document.querySelector(".loginform");

inputloginform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let input_tags=document.querySelectorAll(".loginform input");
    let obj={};
    obj.userName=input_tags[0].value;
    obj.password=input_tags[1].value;
    login(obj)
})
async function login(obj){
    try{
        let login_data=await fetch("http://localhost:4000/user/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(obj)
        })
        if(login_data.ok){
            let token=await login_data.json();
            localStorage.setItem("auth_token",token.token);
            
            alert("login successfull");
            window.location.href="userprofile.html"
        }else{
            alert("wrong credentials")
        }
    }
    catch(err){
        alert("wrong credentials")
        console.log("Some error");
    }
}
