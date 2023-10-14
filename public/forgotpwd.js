var email = document.getElementById('email');
var btnsendlink = document.getElementById('btnsendlink');
var errortext = document.getElementById('error');
var myform = document.getElementById("pwdreset-form");

btnsendlink.addEventListener('click',async (e) => {
    e.preventDefault();
    try{
        const obj = {
            emailid : email.value
        }
        const result = await axios.post("http://localhost:4000/password/forgotpassword",obj);
        myform.reset();
        alert(`Reset password link has been sent to your email ID: ${obj.emailid}`);

    }catch(error)
    {
        errortext.value = "User doesn't exist";
        myform.reset();
        console.log(error);
    }
})


