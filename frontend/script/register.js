let submit_register = document.querySelector(".registerform");

let apiuser="http://localhost:3000/user/"

submit_register.addEventListener("submit", (event) => {
    event.preventDefault();

    let input_tags = document.querySelectorAll(".registerform input");

    console.log(input_tags)

    let obj = {};
    obj.name = input_tags[0].value;
    
    obj.email = input_tags[1].value;
    obj.password = input_tags[2].value;

    register(obj);
})

async function register(obj) {
    try {
        let response = await fetch(`${apiuser}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        let res=await response.json()
        console.log(res)

        if (res.status == "success") {
            alert("user has been succesfully created");
            window.location.href ="./login.html"
        }
    }
    catch (err) {
        console.log("some error");
    }
}