let inputloginform = document.querySelector(".loginform");

let apiuser="http://localhost:3000/user/"

inputloginform.addEventListener("submit", (e) => {
    e.preventDefault();
    let input_tags = document.querySelectorAll(".loginform input");
    let obj = {};
    obj.email = input_tags[0].value;
    obj.password = input_tags[1].value;
    login(obj)
})

async function login(obj) {
    try {
        let responce = await fetch(`${apiuser}login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })

        let res=await responce.json()

        console.log(res);

        if(res.status=="success"){
            
            localStorage.setItem("auth_token", JSON.stringify(res.token));
            // let name=res.name;
            localStorage.setItem("name", JSON.stringify(res.name));
            alert("login successfull");


            document.cookie=`token=${res.token}`;
            document.cookie=`token=${res.name}`;


            window.location.href = "http://localhost:3000/chess/"

        }

          else {
            alert("wrong credentials")
        }
    }
    catch (err) {
        alert("wrong credentials")
        console.log("Some error");
    }
}






















