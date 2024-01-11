
var myform = document.getElementById("myform");
var expenseamount = document.getElementById("expenseamount");
var ecategory = document.getElementById("category");
var edescription = document.getElementById("description");
var t_body = document.getElementById("tablebody");

var btnincome = document.getElementById('btn_income');
var txtincome = document.getElementById('income');
var btnlogout = document.getElementById('btnlogout');
var btnpremium = document.getElementById('premium');
var lb = document.getElementById('leaderboard');
var lbt_body = document.getElementById('lbtablebody');
var tot_expense = document.getElementById('texpense');

var btndownload = document.getElementById('downloadexpense');

var tblLink = document.getElementById('downloadLinkTable');
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const rowsPerPage = document.getElementById('rowsPerPage');
let currentPageForDownloadLink = 1;
var labelTotalLinks = document.getElementById('labelfortotlinks');

let total_no_of_links = 0;
let total_no_of_pages = 0;


btnincome.addEventListener('click',(e) => 
{
  e.preventDefault();
  if(btnincome.innerHTML == "Edit")
  {
    txtincome.disabled = false;
    btnincome.innerHTML = "Submit";
  }
  else
  {
    const obj = {
      income : txtincome.value
    }

    const token = localStorage.getItem('token');
    axios.post("http://localhost:4000/updateIncome",obj,{headers:{"Authorization":token}})
      .then(() => {
        console.log("success");
        alert("Income updated successfully to INR "+obj.income);
        txtincome.disabled = true;
        btnincome.innerHTML = "Edit";
      })
      .catch(err => {
        alert("Something went wrong, "+err)
      })

  }
})


window.addEventListener('DOMContentLoaded',async (e) => {
  e.preventDefault();
  try
  {
    const token = localStorage.getItem("token");
    const premiumUser = localStorage.getItem("isPremium");
    if(premiumUser=="true")
    {
      btnpremium.innerHTML = "Premium User";
      btnpremium.disabled=true;
      premiumFeature();
    }
    const result = await axios.get("http://localhost:4000/account/getexpenses",{headers:{"Authorization":token}});
    
     tot_expense.value = result.data.totexpense[0].Total_Expense;
     txtincome.value = result.data.totexpense[0].Income;
    
        for(var i =0;i<result.data.allexpenses.length;i++)
        {
            addInTable(result.data.allexpenses[i]);
        }
        await fetchDownloadLinks(1);
  }catch(error){
        document.body.innerHTML = document.body.innerHTML+'<h4>Error in fetching data</h4>';
        console.log(error);
  }
})

async function fetchDownloadLinks(currentPage)
{
    currentPageForDownloadLink = currentPage;
    var rowsPP = document.getElementById('rowsPerPage').value;
    // console.log('selectedValue',rowsPP);
    // console.log("Selected page",currentPage);
    const token = localStorage.getItem("token");
    const result_link = await axios.get(`http://localhost:4000/account/pagination/${rowsPP}/${currentPage}`,{headers:{"Authorization":token}});
    let totLink = result_link.data.count;
    let sr = ((currentPage-1)*rowsPP )+1;
    let er = (currentPage)*rowsPP;
    if(er>totLink)
      er=totLink;
    labelTotalLinks.textContent = `${sr}-${er} of ${totLink}`;
    while (tblLink.rows.length > 0) {
      tblLink.deleteRow(0);
    }
    for(var i = 0;i<result_link.data.record.length;i++)
    {
        addLinkInTable(result_link.data.record[i],sr);
        sr++;
    }   
    total_no_of_links = totLink;
    total_no_of_pages = Math.ceil(totLink/rowsPP);
    controlButtonStatus();
}

prevButton.addEventListener('click',(e) => {
  e.preventDefault();
  currentPageForDownloadLink--;
  fetchDownloadLinks(currentPageForDownloadLink);
})

nextButton.addEventListener('click',(e) => {
  e.preventDefault();
  currentPageForDownloadLink++;
  fetchDownloadLinks(currentPageForDownloadLink);
})


const disableButton = (button) => {
  button.classList.add('disabled');
  button.setAttribute('disabled',true);
}

const enableButton = (button) => {
  button.classList.remove('disabled');
  button.removeAttribute('disabled');
}

const controlButtonStatus = () => {
  if(currentPageForDownloadLink == 1)
    disableButton(prevButton);
  else
    enableButton(prevButton);

    if(currentPageForDownloadLink == total_no_of_pages)
      disableButton(nextButton);
    else
      enableButton(nextButton);
}

//adding premium feature
async function premiumFeature()
{
  console.log("Calling premium feature");
  lb.style.visibility='visible';
    const lbdata = await axios.get("http://localhost:4000/account/premium/getfeature");
    //console.log("first data "+ lbdata.data.lbobj);
    for(var i=0;i<lbdata.data.lbobj.length;i++)
    {
      const record = lbdata.data.lbobj[i];
      addInFeatureTable(record,i+1);
    }
}

function addInFeatureTable(record,i)
{
  // console.log("Records fetched");
  // console.log(record);
  const pname = record.Profile_name;
  const texpense = record.Total_Expense==null?0:record.Total_Expense;
  var tr = document.createElement("tr");
  lbt_body.appendChild(tr);

  var th = document.createElement("th");
  th.appendChild(document.createTextNode(i));
  tr.appendChild(th);

  var td_name = document.createElement("td");
  td_name.appendChild(document.createTextNode(pname));
  tr.appendChild(td_name);

  var td_texpense = document.createElement("td");
  td_texpense.appendChild(document.createTextNode(texpense));
  tr.appendChild(td_texpense);

}

function addInTable(obj) {
  const amt = obj.amount;
  const category = obj.category;
  const description = obj.description;
  const expenseid=obj.id;
  

  //Adding data in table

  var tr = document.createElement("tr");
  t_body.appendChild(tr);

  var t_category = document.createElement("td");
  t_category.appendChild(document.createTextNode(category));
  tr.appendChild(t_category);

  var t_amount = document.createElement("td");
  t_amount.appendChild(document.createTextNode("INR "+amt));
  tr.appendChild(t_amount);

  var t_description = document.createElement("td");
  t_description.appendChild(document.createTextNode(description));
  tr.appendChild(t_description);

  var t_delbtn = document.createElement("td");
  var delbtn = document.createElement("button");
  delbtn.classList.add("btn-dark");
  delbtn.appendChild(document.createTextNode("Delete"));
  t_delbtn.appendChild(delbtn);
  tr.appendChild(t_delbtn);


  var t_id = document.createElement('td');
  t_id.appendChild(document.createTextNode(expenseid));
  t_id.classList.add('tdid');
  tr.appendChild(t_id);



  delbtn.addEventListener('click',(e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:4000/account/deleteExpense/${expenseid}`,{headers:{"Authorization":token}})
      .then(result => {
        tr.remove();
        location.reload();
      })
      .catch(error => {
            document.body.innerHTML = document.body.innerHTML+'<h4>Something went wrong</h4>';
          //  console.log(error);
      })

  })
}

function addLinkInTable(linkRow,i)
{
  var tr = document.createElement("tr");
  tr.classList.add('linksRow');
  tblLink.appendChild(tr);

  var th_number = document.createElement('th');
  th_number.appendChild(document.createTextNode(i));
  tr.appendChild(th_number);

  var td_date = document.createElement('td');
  td_date.appendChild(document.createTextNode(linkRow.createdAt));
  tr.appendChild(td_date);


  var td_link = document.createElement('td');
  var a = document.createElement('a');
  var linkText = document.createTextNode('File.txt');
  a.appendChild(linkText);
  a.href = linkRow.link;
  td_link.appendChild(a);
  tr.appendChild(td_link);
  total_no_of_links++;
}


function download()
{
  const token = localStorage.getItem('token');
  axios.get("http://localhost:4000/account/download",{headers:{"Authorization":token}})
    .then(response => {
      if(response.status==200)
      {
        var a = document.createElement('a');
        a.href=response.data.fileurl;
        a.download='myexpense.csv';
        a.click();
       // console.log("Saved LInk",response.data.savedLink);
        addLinkInTable(response.data.savedLink,total_no_of_links+1);
      }
      else
      {
        throw new Error(response.data.message);
      }
    })
    .catch(err => {
      console.log("Something went wrong" + err);
    })
}




myform.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const obj_data = {
      amount: expenseamount.value,
      category: ecategory.value,
      description: edescription.value
    };

    const token = localStorage.getItem('token');
    const newData = await axios.post("http://localhost:4000/postnewexpense",obj_data,{headers:{"Authorization":token}});
    const ret_data = newData.data.expensedata;

    //addInTable(ret_data);

    myform.reset();
    
    location.reload();
  } catch (err) {
    document.body.innerHTML = document.body.innerHTML+"<h1>Something went wrong</h1>";
  }
});


btnlogout.addEventListener('click',(e) => {
  e.preventDefault();
  localStorage.clear();
  location.replace("/signIn");
})


btnpremium.onclick = async function(e) 
{
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:4000/purchase/premium_membership",{headers:{"Authorization":token}});
  
  var options = 
  {
    "key" : response.data.key_id,
    "order_id" : response.data.order.id,
    "handler" : async function(response) {
      await axios.post('http://localhost:4000/purchase/updatetransactionstatus',{
        order_id: options.order_id,
        payment_id : response.razorpay_payment_id},{headers : {"Authorization": token}})
        alert('You are a premium user now');
        localStorage.setItem('isPremium',true);
        location.reload();
    }
  }
  
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed',function(response) {
    axios.post('http://localhost:4000/purchase/failedtransaction',{
      order_id: options.order_id})
    .then(() => {
      alert("Payment could not process, try again!");
    })
    .catch((err) => {console.log(err)});
  })
}