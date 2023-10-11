var email = document.getElementById('email');
var btnsendlink = document.getElementById('btnsendlink');

btnsendlink.addEventListener('click',async (e) => {
    const obj = {
        emailid : email.value
    }
    const result = await axios.post("http://localhost:4000/forgotpassword",obj);
})