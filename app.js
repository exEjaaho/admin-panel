// LOGIN CREDENTIALS
const USER = "Ejaa";
const PASS = "Ejaa990011";

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const BOT_API = "http://IP_VPS_BOT:3000/api"; // Ganti sesuai IP bot WA
const BOT_SECRET = "b50358ca66ccf65dabc11afe03c281be3b4d9f8972dd5dea56f18263f3f94b68";          // Ganti sesuai bot

// Auto-login check
if(localStorage.getItem("login")==="ok"){
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadTransactions();
}

// LOGIN FUNCTION
function login(){
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if(u===USER && p===PASS){
    localStorage.setItem("login","ok");
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadTransactions();
  } else {
    document.getElementById("loginError").innerText = "Username / Password salah";
  }
}

// LOGOUT
function logout(){
  localStorage.removeItem("login");
  location.reload();
}

// FETCH TRANSAKSI DARI BOT
async function loadTransactions(){
  try{
    const res = await fetch(`${BOT_API}/transactions`,{
      headers:{'x-bot-secret': BOT_SECRET}
    });
    const data = await res.json();

    // Update table
    const tbody = document.getElementById("trxList");
    tbody.innerHTML = '';
    let totalPending=0,totalAcc=0,totalRevenue=0;
    Object.entries(data).forEach(([user,trx])=>{
      if(trx.status==='Pending') totalPending++;
      if(trx.status==='ACC') totalAcc++;
      totalRevenue += trx.nominal || 0;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user}</td>
        <td>${trx.produk}</td>
        <td><span class="status ${trx.status.toLowerCase()}">${trx.status}</span></td>
        <td>
          <button class="action" onclick="acc('${user}')">ACC</button>
          <button class="action" onclick="rej('${user}')">REJECT</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Update cards
    document.querySelector("#cardPending span").innerText = totalPending;
    document.querySelector("#cardAcc span").innerText = totalAcc;
    document.querySelector("#cardTotal span").innerText = Object.keys(data).length;
    document.querySelector("#cardRevenue span").innerText = "Rp " + totalRevenue.toLocaleString();

    // Update chart
    const ctx = document.getElementById("chart").getContext('2d');
    const products = {};
    Object.values(data).forEach(trx=>{
      products[trx.produk] = (products[trx.produk]||0)+1;
    });
    const labels = Object.keys(products);
    const counts = Object.values(products);

    if(window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart(ctx,{
      type:'bar',
      data:{
        labels,
        datasets:[{label:'Transaksi',data:counts,backgroundColor:'#8b5cf6'}]
      },
      options:{responsive:true, maintainAspectRatio:false}
    });

  }catch(err){
    console.error(err);
  }
}

// ACC / REJECT FUNCTIONS
async function acc(user){
  await fetch(`${BOT_API}/transactions/acc`,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-bot-secret': BOT_SECRET},
    body: JSON.stringify({user})
  });
  loadTransactions();
}

async function rej(user){
  await fetch(`${BOT_API}/transactions/reject`,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-bot-secret': BOT_SECRET},
    body: JSON.stringify({user})
  });
  loadTransactions();
}

// REFRESH EVERY 5 DETIK
setInterval(()=>{if(localStorage.getItem("login")==="ok") loadTransactions();},5000);    type:'bar',
    data:{
      labels:labels,
      datasets:[{
        label:'Transactions',
        data:counts,
        backgroundColor:'#4e54c8'
      }]
    },
    options:{ responsive:true, maintainAspectRatio:false }
  });
}

console.log('Admin panel full modern ready');    data:{
      labels:labels,
      datasets:[{
        label:'Transactions',
        data:counts,
        backgroundColor:'#4e54c8'
      }]
    },
    options:{ responsive:true, maintainAspectRatio:false }
  });
}

console.log('Admin panel modern ready');
