function showTab(id){
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// === SUPPLIERS ===
const supplierForm = document.getElementById('supplierForm');
const sName = document.getElementById('sName');
const sContact = document.getElementById('sContact');
const sItems = document.getElementById('sItems');
const supplierList = document.getElementById('supplierList');

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
const debtorForm = document.getElementById('debtorForm');
const dClient = document.getElementById('dClient');
const dVehicle = document.getElementById('dVehicle');
const dAmount = document.getElementById('dAmount');
const debtorList = document.getElementById('debtorList');

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
const creditorForm = document.getElementById('creditorForm');
const cTo = document.getElementById('cTo');
const cReason = document.getElementById('cReason');
const cAmount = document.getElementById('cAmount');
const creditorList = document.getElementById('creditorList');

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

// === POS ===
let posCart = [];

function renderPOS(){
  const stock = JSON.parse(localStorage.getItem('stock')||'[]');
  const posItems = document.getElementById('posItems');
  posItems.innerHTML = stock.map((item,i)=>`
    <div>
      <strong>${item.name}</strong> – ${item.quantity} available @ R${item.sell.toFixed(2)}
      <button onclick="addToCart(${i})">Add</button>
    </div>
  `).join('');
  updatePOSTotal();
}

function addToCart(index){
  const stock = JSON.parse(localStorage.getItem('stock')||'[]');
  const item = stock[index];
  if(item.quantity <= 0){
    alert("Out of stock!");
    return;
  }
  const cartIndex = posCart.findIndex(c => c.name === item.name);
  if(cartIndex >= 0){
    posCart[cartIndex].qty += 1;
  } else {
    posCart.push({ name: item.name, price: item.sell, qty: 1 });
  }
  stock[index].quantity -=1;
  localStorage.setItem('stock', JSON.stringify(stock));
  renderPOS();
}

function updatePOSTotal(){
  const total = posCart.reduce((sum, item)=> sum + item.price * item.qty, 0);
  document.getElementById('posTotal').textContent = total.toFixed(2);
}

function completeSale(){
  if(posCart.length === 0){
    alert("Cart is empty!");
    return;
  }
  let total = posCart.reduce((sum, item)=> sum + item.price * item.qty, 0);

  // Save to daily sales
  const today = new Date().toISOString().slice(0,10); // e.g. 2025-07-10
  let sales = JSON.parse(localStorage.getItem('sales')||'{}');
  sales[today] = (sales[today]||0) + total;
  localStorage.setItem('sales', JSON.stringify(sales));

  alert("Sale completed. Total: R" + total.toFixed(2));
  posCart = [];
  renderPOS();
}

}

// === INIT ALL ON TAB OPEN ===
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    renderSuppliers();
    renderDebtors();
    renderCreditors();
    renderStock();
    renderPOS();
    renderPetty();
    renderReports();
  });
});

  });
});
// === PETTY CASH ===
const pettyForm = document.getElementById('pettyForm');
const pettyDesc = document.getElementById('pettyDesc');
const pettyAmount = document.getElementById('pettyAmount');
const pettyList = document.getElementById('pettyList');
const pettyBalance = document.getElementById('pettyBalance');

pettyForm.addEventListener('submit', e => {
  e.preventDefault();
  const all = JSON.parse(localStorage.getItem('petty')||'[]');
  all.push({desc: pettyDesc.value, amount: +pettyAmount.value});
  localStorage.setItem('petty', JSON.stringify(all));
  pettyForm.reset();
  renderPetty();
});

function renderPetty(){
  const list = JSON.parse(localStorage.getItem('petty')||'[]');
  let total = list.reduce((sum, p)=> sum + p.amount, 0);
  pettyBalance.textContent = total.toFixed(2);
  pettyList.innerHTML = list.map((p,i)=>`
    <div>${p.desc} – R${p.amount.toFixed(2)}
    <button onclick="deletePetty(${i})">🗑️</button></div>
  `).join('');
}

function deletePetty(i){
  const list = JSON.parse(localStorage.getItem('petty')||'[]');
  list.splice(i,1);
  localStorage.setItem('petty', JSON.stringify(list));
  renderPetty();
}
// === DAILY REPORTS ===
const reportList = document.getElementById('reportList');

function renderReports(){
  const sales = JSON.parse(localStorage.getItem('sales')||'{}');
  const days = Object.keys(sales).sort((a,b)=> b.localeCompare(a));
  reportList.innerHTML = days.length 
    ? days.map(day=> `<div>${day}: R${sales[day].toFixed(2)}</div>`).join('')
    : "<div>No sales recorded yet.</div>";
}
