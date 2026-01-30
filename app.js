const BOT_API = 'http://IP_VPS_KAMU:3000/api'; // Ganti
const BOT_SECRET = 'b50358ca66ccf65dabc11afe03c281be3b4d9f8972dd5dea56f18263f3f94b68';

let chartInstance;

async function loadTransactions() {
  try {
    const res = await fetch(`${BOT_API}/transactions`, {
      headers:{'x-bot-secret':BOT_SECRET}
    });
    const data = await res.json();
    const tbody = document.getElementById('trxList');
    tbody.innerHTML = '';

    let totalPending=0,totalAcc=0,todayTrx=0;
    Object.keys(data).forEach(user=>{
      const trx = data[user];
      if(trx.status==='Pending') totalPending++;
      else if(trx.status==='ACC') totalAcc++;
      todayTrx++;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user}</td>
        <td>${trx.produk}</td>
        <td>${trx.nominal}</td>
        <td><span class="${trx.status==='Pending'?'status-pending':trx.status==='ACC'?'status-acc':'status-reject'}">${trx.status}</span></td>
        <td>
          <button class="btn-acc" onclick="accTrx('${user}')">ACC</button>
          <button class="btn-reject" onclick="rejectTrx('${user}')">Reject</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('totalPending').innerText=totalPending;
    document.getElementById('totalAcc').innerText=totalAcc;
    document.getElementById('todayTrx').innerText=todayTrx;

    updateChart(data);

  } catch(err){ console.error('Gagal load transaksi',err); }
}

async function accTrx(user){
  await fetch(`${BOT_API}/transactions/acc`,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-bot-secret':BOT_SECRET},
    body: JSON.stringify({user})
  });
  loadTransactions();
}

async function rejectTrx(user){
  await fetch(`${BOT_API}/transactions/reject`,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-bot-secret':BOT_SECRET},
    body: JSON.stringify({user})
  });
  loadTransactions();
}

setInterval(loadTransactions,5000);
loadTransactions();

function updateChart(data){
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  const products={};
  Object.values(data).forEach(trx=>{
    if(products[trx.produk]) products[trx.produk]+=1;
    else products[trx.produk]=1;
  });
  const labels=Object.keys(products);
  const counts=Object.values(products);

  if(chartInstance) chartInstance.destroy();
  chartInstance=new Chart(ctx,{
    type:'bar',
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
