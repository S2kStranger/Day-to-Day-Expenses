var myform = document.getElementById('cpwd-form');
var npwd = document.getElementById('newpassword');
var cpwd = document.getElementById('c_password');
var btnsubmit = document.getElementById('btnsubmit');
var txterror = document.getElementById('error');
const url = window.location.href;
const uuid = url.substring(url.lastIndexOf('/') + 1);

myform.addEventListener('submit',async (e) => {
    e.preventDefault();
    try
    {
        if(npwd.value!=cpwd.value)
        {
            throw new Error("Password does not match");
            return;
        }
        const obj = {
            newpwd : npwd.value,
            confirmpwd : cpwd.value,
            uid : uuid
        }
         const result = await axios.post("http://localhost:4000/password/submitpassword",obj);
         alert("Password successfully changed, click OK to signIn");
         location.replace("/signIn");



    }catch(error)
    {

        txterror.value = error;
    }

})