let submit_register = document.querySelector(".registerform");

submit_register.addEventListener("submit", (event) => {
    event.preventDefault();

    let input_tags = document.querySelectorAll(".registerform input");
    let obj = {};
    obj.userName = input_tags[0].value;
    obj.email = input_tags[1].value;
    obj.password = input_tags[2].value;

    register(obj);
})

async function register(obj) {
    try {
        let post_data = await fetch("http://localhost:4000/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });
        if (post_data.ok == true) {
            alert("user has been succesfully created");
        }
    }
    catch (err) {
        console.log("some error");
    }
}