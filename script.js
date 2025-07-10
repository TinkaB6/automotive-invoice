let currentLines = [];
showTab('create');

function showTab(tab) {
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    renderSuppliers();
    renderDebtors();
    renderCreditors();
    renderStock();
  });
});

}

document.getElementById('invoiceForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = vehicle.value, i = item.value, s = supplier.value, cst = +cost.value||0, ch = +charge.value;
  currentLines.push({v,i,s,cst,ch});
  invoiceForm.reset();
  renderPreview();
  saveInvoiceBtn.disabled = false;
});

function renderPreview(){
  const c = currentLines;
  let html = '', total = 0;
  lines = currentLines.forEach((l, idx)=>{
    total += l.ch;
    html += `<div class="invoice-row">
      <div>${l.v} – ${l.i}</div>
      <div>R${l.ch.toFixed(2)}</div>
      <div><button onclick="removeLine(${idx})">🗑️</button></div>
    </div>`;
  });
  html += `<div class="total">Total: R${total.toFixed(2)}</div>`;
  invoicePreview.innerHTML = html;
}

function removeLine(idx){
  currentLines.splice(idx,1);
  renderPreview();
  saveInvoiceBtn.disabled = currentLines.length === 0;
}

function saveInvoice(){
  const inv = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    lines: currentLines.slice()
  };
  const all = JSON.parse(localStorage.getItem('invoices')||'[]');
  all.push(inv);
  localStorage.setItem('invoices', JSON.stringify(all));
  currentLines = [];
  renderPreview();
  saveInvoiceBtn.disabled = true;
  alert('Invoice Saved! 🎉');
}

function renderHistory(){
  const all = JSON.parse(localStorage.getItem('invoices')||'[]');
  if(all.length === 0) { historyList.innerHTML = '<p>No invoices saved yet.</p>'; return; }
  historyList.innerHTML = all.map(inv => {
    const sum = inv.lines.reduce((a,l)=>a+l.ch,0);
    return `<div class="history-item">
      <button class="nav-btn" onclick="deleteInv(${inv.id})">Delete</button>
      <strong>Invoice #${inv.id}</strong> | ${inv.date} | Total: R${sum.toFixed(2)}
      <button onclick="viewInvoice(${inv.id})">View</button>
    </div>`;
  }).join('');
}

function deleteInv(id){
  let all = JSON.parse(localStorage.getItem('invoices')||'[]');
  all = all.filter(inv => inv.id !== id);
  localStorage.setItem('invoices', JSON.stringify(all));
  renderHistory();
}

function viewInvoice(id){
  const inv = JSON.parse(localStorage.getItem('invoices')||'[]').find(x=>x.id===id);
  if(!inv) return;
  let html = `<h3>Invoice #${inv.id} (${inv.date})</h3>`;
  let tot = 0;
  inv.lines.forEach(l=>{
    tot += l.ch;
    html += `<div class="invoice-row"><div>${l.v}–${l.i}</div><div>R${l.ch.toFixed(2)}</div></div>`;
  });
  html += `<div class="total">Total: R${tot.toFixed(2)}</div>`;
  historyList.innerHTML = html;
}
// === SUPPLIERS ===
supplierForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('suppliers')||'[]');
  all.push({name: sName.value, contact: sContact.value, items: sItems.value});
  localStorage.setItem('suppliers', JSON.stringify(all));
  supplierForm.reset();
  renderSuppliers();
});

function renderSuppliers(){
  const list = JSON.parse(localStorage.getItem('suppliers')||'[]');
  supplierList.innerHTML = list.map((s, i) => `
    <div><strong>${s.name}</strong> – ${s.contact} (${s.items})
    <button onclick="deleteSupplier(${i})">🗑️</button></div>`).join('');
}
function deleteSupplier(i){
  const list = JSON.parse(localStorage.getItem('suppliers')||'[]');
  list.splice(i,1);
  localStorage.setItem('suppliers', JSON.stringify(list));
  renderSuppliers();
}

// === DEBTORS ===
debtorForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('debtors')||'[]');
  all.push({client: dClient.value, vehicle: dVehicle.value, amount: +dAmount.value});
  localStorage.setItem('debtors', JSON.stringify(all));
  debtorForm.reset();
  renderDebtors();
});

function renderDebtors(){
  const list = JSON.parse(localStorage.getItem('debtors')||'[]');
  debtorList.innerHTML = list.map((d, i) => `
    <div><strong>${d.client}</strong> – ${d.vehicle} – R${d.amount.toFixed(2)}
    <button onclick="deleteDebtor(${i})">🗑️</button></div>`).join('');
}
function deleteDebtor(i){
  const list = JSON.parse(localStorage.getItem('debtors')||'[]');
  list.splice(i,1);
  localStorage.setItem('debtors', JSON.stringify(list));
  renderDebtors();
}

// === CREDITORS ===
creditorForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('creditors')||'[]');
  all.push({to: cTo.value, reason: cReason.value, amount: +cAmount.value});
  localStorage.setItem('creditors', JSON.stringify(all));
  creditorForm.reset();
  renderCreditors();
});

function renderCreditors(){
  const list = JSON.parse(localStorage.getItem('creditors')||'[]');
  creditorList.innerHTML = list.map((c, i) => `
    <div><strong>${c.to}</strong> – ${c.reason} – R${c.amount.toFixed(2)}
    <button onclick="deleteCreditor(${i})">🗑️</button></div>`).join('');
}
function deleteCreditor(i){
  const list = JSON.parse(localStorage.getItem('creditors')||'[]');
  list.splice(i,1);
  localStorage.setItem('creditors', JSON.stringify(list));
  renderCreditors();
}

// Initialize on tab open
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    renderSuppliers();
    renderDebtors();
    renderCreditors();
  });
});
// === STOCK ===
const stockForm = document.getElementById('stockForm');
const stockName = document.getElementById('stockName');
const stockQty = document.getElementById('stockQty');
const stockCost = document.getElementById('stockCost');
const stockSell = document.getElementById('stockSell');
const stockList = document.getElementById('stockList');

stockForm.addEventListener('submit', e => {
  e.preventDefault();
  let list = JSON.parse(localStorage.getItem('stock')||'[]');
  const index = list.findIndex(item => item.name.toLowerCase() === stockName.value.toLowerCase());
  if(index >= 0){
    // If item exists, update quantity & prices
    list[index].quantity += +stockQty.value;
    list[index].cost = +stockCost.value;
    list[index].sell = +stockSell.value;
  } else {
    list.push({ name: stockName.value, quantity: +stockQty.value, cost: +stockCost.value, sell: +stockSell.value });
  }
  localStorage.setItem('stock', JSON.stringify(list));
  stockForm.reset();
  renderStock();
});

function renderStock(){
  const list = JSON.parse(localStorage.getItem('stock')||'[]');
  stockList.innerHTML = list.map((item, i) => `
    <div>
      <strong>${item.name}</strong> – Qty: ${item.quantity}, Cost: R${item.cost.toFixed(2)}, Sell: R${item.sell.toFixed(2)}
      <button onclick="deleteStock(${i})">🗑️</button>
    </div>
  `).join('');
}

function deleteStock(i){
  const list = JSON.parse(localStorage.getItem('stock')||'[]');
  list.splice(i,1);
  localStorage.setItem('stock', JSON.stringify(list));
  renderStock();
}
