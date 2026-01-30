// ===== CONFIG =====
const BOT_API = 'http://IP_VPS_KAMU:3000/api'; 
// contoh: http://103.xxx.xxx.xxx:3000/api

const BOT_SECRET = 'b50358ca66ccf65dabc11afe03c281be3b4d9f8972dd5dea56f18263f3f94b68';

// ===== FETCH TRANSAKSI =====
async function loadTransactions() {
  try {
    const res = await fetch(`${BOT_API}/transactions`, {
      headers: {
        'x-bot-secret': BOT_SECRET
      }
    });

    const data = await res.json();
    const tbody = document.getElementById('trxList');
    if (!tbody) return;

    tbody.innerHTML = '';

    Object.keys(data).forEach(user => {
      const trx = data[user];

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user}</td>
        <td>${trx.produk}</td>
        <td>${trx.nominal}</td>
        <td>${trx.status}</td>
        <td>
          <button onclick="accTrx('${user}')">ACC</button>
          <button onclick="rejectTrx('${user}')">REJECT</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error('Gagal load transaksi', err);
  }
}

// ===== ACC =====
async function accTrx(user) {
  await fetch(`${BOT_API}/transactions/acc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bot-secret': BOT_SECRET
    },
    body: JSON.stringify({ user })
  });

  loadTransactions();
}

// ===== REJECT =====
async function rejectTrx(user) {
  await fetch(`${BOT_API}/transactions/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bot-secret': BOT_SECRET
    },
    body: JSON.stringify({ user })
  });

  loadTransactions();
}

// ===== AUTO REFRESH =====
setInterval(loadTransactions, 5000);
loadTransactions();

console.log('Admin panel CONNECTED');
