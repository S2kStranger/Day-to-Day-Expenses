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
        axios.post("http://44.220.158.244:4000/signIn",obj_data)
        .then(result => {
             const ret=result.data.token;
             localStorage.setItem("token",ret);
             localStorage.setItem("isPremium",result.data.record.isPremium);
            location.replace("/account");
        })
        .catch(error => {
            errortext.value = error.response.data.error;
        })
       
    myform.reset();
})