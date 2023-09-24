
var myform = document.getElementById("myform");
var expenseamount = document.getElementById("expenseamount");
var ecategory = document.getElementById("category");
var edescription = document.getElementById("description");
var t_body = document.getElementById("tablebody");

var btnincome = document.getElementById('btn_income');
var txtincome = document.getElementById('income');

var btnlogout = document.getElementById('btnlogout');


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
    txtincome.disabled = true;
    btnincome.innerHTML = "Edit";
  }
})


window.addEventListener('DOMContentLoaded',async (e) => {
  e.preventDefault();
  try
  {
    const token = localStorage.getItem("token");
    const result = await axios.get("http://localhost:4000/account/getexpenses",{headers:{"Authorization":token}});
    for(var i =0;i<result.data.allexpenses.length;i++)
        {
            //console.log(result.data.allexpenses[i]);
            addInTable(result.data.allexpenses[i]);
        }
  }catch(error){
        document.body.innerHTML = document.body.innerHTML+'<h4>Error in fetching data</h4>';
        console.log(error);
  }
  
})

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
      })
      .catch(error => {
            document.body.innerHTML = document.body.innerHTML+'<h4>Something went wrong</h4>';
            console.log(error);
      })

  })


}

myform.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const obj_data = {
      amount: expenseamount.value,
      category: ecategory.value,
      description: edescription.value,
    };

    const token = localStorage.getItem('token');
    const newData = await axios.post("http://localhost:4000/postnewexpense",obj_data,{headers:{"Authorization":token}});
    const ret_data = newData.data.expensedata;

    addInTable(ret_data);

    myform.reset();
  } catch (err) {
    document.body.innerHTML = document.body.innerHTML+"<h1>Something went wrong</h1>";
  }
});


btnlogout.addEventListener('click',(e) => {
  e.preventDefault();
  localStorage.clear();
  location.replace("/signIn");
})







// Example body of the table

// <tr>
//                 <td>Mark</td>
//                 <td>Otto</td>
//                 <td>@mdo</td>   
//                 <td><button class="btn-dark">Delete</button></td>
//             </tr>
//             <tr>
//                 <td>Jacob</td>
//                 <td>Thornton</td>
//                 <td>@fat</td>
//                 <td><button class="btn-dark">Delete</button></td>
//             </tr>
