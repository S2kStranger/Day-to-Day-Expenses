var myform = document.getElementById('signup-form');
var nam = document.getElementById('profilename');
var purpose = document.getElementById('profilepurpose');
var email = document.getElementById('email');
var password = document.getElementById('password');
var information = document.getElementById('information');
var btnsignup= document.getElementById('btnsignup');
var errortext = document.getElementById('error');

myform.addEventListener('submit', async(e) => {
    e.preventDefault();
    try
    {
        const obj_data = {
            pname : nam.value,
            ppurpose : purpose.value,
            pemail : email.value,
            ppassword : password.value,
            pinformation : information.value
        }

        const result = await axios.post("http://localhost:4000/postsignupdata",obj_data);
        errortext.value=""; 
        if(result)
        {
            console.log("Success");
            //window.location.href = "/signIn";
            location.replace("/signIn");
        }

    }catch(error){
       errortext.value = 'User already Exists.';
    }
    myform.reset();
})