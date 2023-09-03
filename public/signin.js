var myform = document.getElementById('signup-form');
var email = document.getElementById('email');
var password = document.getElementById('password');
var errortext = document.getElementById('error');

myform.addEventListener('submit',async (e)=> {
    e.preventDefault();
    try
    {   
        const obj_data = {
            useremail : email.value,
            userpassword : password.value
        }
        const result = await axios.post("http://localhost:4000/signIn",obj_data);
        console.log("Account verified");
        
    }catch(error)
    {
        console.log(error);
        console.log(error.response.data.error);
        errortext.value = error.response.data.error;
    }
    myform.reset();
})