// Tab Navigation & Init
const tabs = document.querySelectorAll('.tabs button');
const panes = document.querySelectorAll('.tab-content');

function showTab(id) {
  panes.forEach(p => p.id === id ? p.classList.add('active') : p.classList.remove('active'));
  tabs.forEach(b => b.dataset.tab === id ? b.classList.add('active') : b.classList.remove('active'));
}

tabs.forEach(btn => btn.addEventListener('click', () => {
  showTab(btn.dataset.tab);
  renderAll();
}));

document.addEventListener('DOMContentLoaded', () => {
  showTab('create');
  renderAll();
});

// Render Helpers
function renderAll() {
  renderInvoices();
  renderSuppliers();
  renderDebtors();
  renderCreditors();
  renderStock();
  renderPOS();
  renderPetty();
  renderReports();
}

/* INVOICES */
const invoiceForm = document.getElementById('invoiceForm');
const invoiceList = document.getElementById('invoiceList');
invoiceForm.addEventListener('submit', e => {
  e.preventDefault();
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
  invoices.push({
    company: invoiceForm.companyName.value,
    number: invoiceForm.invoiceNumber.value,
    client: invoiceForm.clientName.value,
    amount: parseFloat(invoiceForm.invoiceAmount.value)
  });
  localStorage.setItem('invoices', JSON.stringify(invoices));
  invoiceForm.reset();
  renderInvoices();
});

function renderInvoices() {
  const invs = JSON.parse(localStorage.getItem('invoices') || '[]');
  invoiceList.innerHTML = invs.map((i, idx) =>
    `<div class="list-item">
       <span><strong>${i.company}</strong> #${i.number} → ${i.client} – R${i.amount.toFixed(2)}</span>
       <button onclick="deleteInvoice(${idx})">🗑️</button>
     </div>`).join('');
}

function deleteInvoice(idx) {
  const invs = JSON.parse(localStorage.getItem('invoices') || '[]');
  invs.splice(idx, 1);
  localStorage.setItem('invoices', JSON.stringify(invs));
  renderInvoices();
}

/* SUPPLIERS */
const supplierForm = document.getElementById('supplierForm');
const supplierList = document.getElementById('supplierList');
supplierForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('suppliers') || '[]');
  all.push({
    name: supplierForm.sName.value,
    contact: supplierForm.sContact.value,
    items: supplierForm.sItems.value
  });
  localStorage.setItem('suppliers', JSON.stringify(all));
  supplierForm.reset(); renderSuppliers();
});
function renderSuppliers() {
  const list = JSON.parse(localStorage.getItem('suppliers') || '[]');
  supplierList.innerHTML = list.map((s, i) =>
    `<div class="list-item">
       <span><strong>${s.name}</strong> – ${s.contact} (${s.items})</span>
       <button onclick="deleteSupplier(${i})">🗑️</button>
     </div>`).join('');
}
function deleteSupplier(i) {
  const list = JSON.parse(localStorage.getItem('suppliers') || '[]');
  list.splice(i, 1);
  localStorage.setItem('suppliers', JSON.stringify(list));
  renderSuppliers();
}

/* DEBTORS */
const debtorForm = document.getElementById('debtorForm');
const debtorList = document.getElementById('debtorList');
debtorForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('debtors') || '[]');
  all.push({
    client: debtorForm.dClient.value,
    vehicle: debtorForm.dVehicle.value,
    amount: parseFloat(debtorForm.dAmount.value)
  });
  localStorage.setItem('debtors', JSON.stringify(all));
  debtorForm.reset(); renderDebtors();
});
function renderDebtors() {
  const list = JSON.parse(localStorage.getItem('debtors') || '[]');
  debtorList.innerHTML = list.map((d, i) =>
    `<div class="list-item">
       <span><strong>${d.client}</strong> – ${d.vehicle} – R${d.amount.toFixed(2)}</span>
       <button onclick="deleteDebtor(${i})">🗑️</button>
     </div>`).join('');
}
function deleteDebtor(i) {
  const list = JSON.parse(localStorage.getItem('debtors') || '[]');
  list.splice(i, 1);
  localStorage.setItem('debtors', JSON.stringify(list));
  renderDebtors();
}

/* CREDITORS */
const creditorForm = document.getElementById('creditorForm');
const creditorList = document.getElementById('creditorList');
creditorForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('creditors') || '[]');
  all.push({
    to: creditorForm.cTo.value,
    reason: creditorForm.cReason.value,
    amount: parseFloat(creditorForm.cAmount.value)
  });
  localStorage.setItem('creditors', JSON.stringify(all));
  creditorForm.reset(); renderCreditors();
});
function renderCreditors() {
  const list = JSON.parse(localStorage.getItem('creditors') || '[]');
  creditorList.innerHTML = list.map((c, i) =>
    `<div class="list-item">
       <span><strong>${c.to}</strong> – ${c.reason} – R${c.amount.toFixed(2)}</span>
       <button onclick="deleteCreditor(${i})">🗑️</button>
     </div>`).join('');
}
function deleteCreditor(i) {
  const list = JSON.parse(localStorage.getItem('creditors') || '[]');
  list.splice(i, 1);
  localStorage.setItem('creditors', JSON.stringify(list));
  renderCreditors();
}

/* STOCK */
const stockForm = document.getElementById('stockForm');
const stockList = document.getElementById('stockList');
stockForm.addEventListener('submit', e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem('stock') || '[]');
  const name = stockForm.stockName.value.toLowerCase();
  const idx = list.findIndex(it => it.name.toLowerCase() === name);
  const item = {
    name: stockForm.stockName.value,
    quantity: parseInt(stockForm.stockQty.value),
    cost: parseFloat(stockForm.stockCost.value),
    sell: parseFloat(stockForm.stockSell.value)
  };
  if (idx >= 0) {
    list[idx].quantity += item.quantity;
    list[idx].cost = item.cost;
    list[idx].sell = item.sell;
  } else {
    list.push(item);
  }
  localStorage.setItem('stock', JSON.stringify(list));
  stockForm.reset(); renderStock();
});
function renderStock() {
  const list = JSON.parse(localStorage.getItem('stock') || '[]');
  stockList.innerHTML = list.map((it, i) =>
    `<div class="list-item">
       <span><strong>${it.name}</strong> – Qty: ${it.quantity}, Cost: R${it.cost.toFixed(2)}, Sell: R${it.sell.toFixed(2)}</span>
       <button onclick="deleteStock(${i})">🗑️</button>
     </div>`).join('');
}
function deleteStock(i) {
  const list = JSON.parse(localStorage.getItem('stock') || '[]');
  list.splice(i, 1);
  localStorage.setItem('stock', JSON.stringify(list));
  renderStock();
}

/* POS */
let posCart = [];
function renderPOS() {
  const stock = JSON.parse(localStorage.getItem('stock') || '[]');
  const posItems = document.getElementById('posItems');
  posItems.innerHTML = stock.map((it, idx) =>
    `<div class="list-item">
       <span><strong>${it.name}</strong> – ${it.quantity} in stock @ R${it.sell.toFixed(2)}</span>
       <button onclick="addToCart(${idx})">Add</button>
     </div>`).join('');
  updatePOSTotal();
}
function addToCart(index) {
  const stock = JSON.parse(localStorage.getItem('stock') || '[]');
  if (stock[index].quantity <= 0) { alert("Out of stock!"); return; }
  const cartIndex = posCart.findIndex(c => c.name === stock[index].name);
  if (cartIndex >= 0) posCart[cartIndex].qty++;
  else posCart.push({ name: stock[index].name, price: stock[index].sell, qty: 1 });
  stock[index].quantity--;
  localStorage.setItem('stock', JSON.stringify(stock));
  renderPOS();
}
function updatePOSTotal() {
  const total = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('posTotal').textContent = total.toFixed(2);
}
document.getElementById('completeSaleBtn').addEventListener('click', completeSale);
function completeSale() {
  if (!posCart.length) { alert("Cart is empty!"); return; }
  const total = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const today = new Date().toISOString().slice(0,10);
  const sales = JSON.parse(localStorage.getItem('sales') || '{}');
  sales[today] = (sales[today] || 0) + total;
  localStorage.setItem('sales', JSON.stringify(sales));
  alert(`Sale completed. Total: R${total.toFixed(2)}`);
  posCart = [];
  renderPOS();
}

/* PETTY */
const pettyForm = document.getElementById('pettyForm');
const pettyList = document.getElementById('pettyList');
const pettyBalance = document.getElementById('pettyBalance');
pettyForm.addEventListener('submit', e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem('petty') || '[]');
  list.push({
    desc: pettyForm.pettyDesc.value,
    amount: parseFloat(pettyForm.pettyAmount.value)
  });
  localStorage.setItem('petty', JSON.stringify(list));
  pettyForm.reset(); renderPetty();
});
function renderPetty() {
  const list = JSON.parse(localStorage.getItem('petty') || '[]');
  const total = list.reduce((sum, i) => sum + i.amount, 0);
  pettyBalance.textContent = total.toFixed(2);
  pettyList.innerHTML = list.map((p,i) =>
    `<div class="list-item">
       <span>${p.desc} – R${p.amount.toFixed(2)}</span>
       <button onclick="deletePetty(${i})">🗑️</button>
     </div>`).join('');
}
function deletePetty(i) {
  const list = JSON.parse(localStorage.getItem('petty') || '[]');
  list.splice(i, 1);
  localStorage.setItem('petty', JSON.stringify(list));
  renderPetty();
}

/* REPORTS */
function renderReports() {
  const sales = JSON.parse(localStorage.getItem('sales') || '{}');
  const days = Object.keys(sales).sort((a,b) => b.localeCompare(a));
  document.getElementById('reportList').innerHTML = days.length
    ? days.map(d => `<div class="list-item"><span>${d}: R${sales[d].toFixed(2)}</span></div>`).join('')
    : `<div>No sales recorded yet.</div>`;
}
