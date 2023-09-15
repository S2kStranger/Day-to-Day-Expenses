var myform = document.getElementById('signup-form');
var email = document.getElementById('email');
var password = document.getElementById('password');
var errortext = document.getElementById('error');
var btnsignin = document.getElementById('btnsignup');

myform.addEventListener('submit',(e)=> {
    e.preventDefault();
      
        const obj_data = {
            useremail : email.value,
            userpassword : password.value
        }
        axios.post("http://localhost:4000/signIn",obj_data)
        .then(result => {
             const ret=result.data.token;
             localStorage.setItem("token",ret);
            //console.log("Logged ID: "+result.data.record.id);
            console.log("Account verified");
            //const obj=JSON.parse(JSON.stringify(result));
            console.log("Result is:"+result);
            location.replace("/account");
        })
        .catch(error => {
            console.log(error);
            console.log(error.response.data.error);
            errortext.value = error.response.data.error;
        })
       
    myform.reset();
})