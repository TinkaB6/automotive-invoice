document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab-content");

  function showTab(id) {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      showTab(tab.dataset.tab);
      renderAll();
    });
  });

  // Default view
  showTab("create");
  renderAll();
});

// Render helper to update all sections
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

/* ===== INVOICES ===== */
const invoiceForm = document.getElementById("invoiceForm");
invoiceForm.addEventListener("submit", e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem("invoices") || "[]");
  list.push({
    company: invoiceForm.companyName.value,
    number: invoiceForm.invoiceNumber.value,
    client: invoiceForm.clientName.value,
    amount: parseFloat(invoiceForm.invoiceAmount.value)
  });
  localStorage.setItem("invoices", JSON.stringify(list));
  invoiceForm.reset();
  renderInvoices();
});
function renderInvoices() {
  const list = JSON.parse(localStorage.getItem("invoices") || "[]");
  const container = document.getElementById("invoiceList");
  container.innerHTML = list.map((i, idx) => `
    <div class="list-item">
      <span><strong>${i.company}</strong> #${i.number} → ${i.client} ‒ R${i.amount.toFixed(2)}</span>
      <button onclick="deleteInvoice(${idx})">🗑️</button>
    </div>`).join("");
}
function deleteInvoice(i) {
  const list = JSON.parse(localStorage.getItem("invoices") || "[]");
  list.splice(i, 1);
  localStorage.setItem("invoices", JSON.stringify(list));
  renderInvoices();
}

/* ===== SUPPLIERS ===== */
const supplierForm = document.getElementById("supplierForm");
supplierForm.addEventListener("submit", e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem("suppliers") || "[]");
  list.push({
    name: supplierForm.sName.value,
    contact: supplierForm.sContact.value,
    items: supplierForm.sItems.value
  });
  localStorage.setItem("suppliers", JSON.stringify(list));
  supplierForm.reset();
  renderSuppliers();
});
function renderSuppliers() {
  const list = JSON.parse(localStorage.getItem("suppliers") || "[]");
  const container = document.getElementById("supplierList");
  container.innerHTML = list.map((s, idx) => `
    <div class="list-item">
      <span><strong>${s.name}</strong> – ${s.contact} (${s.items})</span>
      <button onclick="deleteSupplier(${idx})">🗑️</button>
    </div>`).join("");
}
function deleteSupplier(i) {
  const list = JSON.parse(localStorage.getItem("suppliers") || "[]");
  list.splice(i, 1);
  localStorage.setItem("suppliers", JSON.stringify(list));
  renderSuppliers();
}

/* ===== DEBTORS ===== */
const debtorForm = document.getElementById("debtorForm");
debtorForm.addEventListener("submit", e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem("debtors") || "[]");
  list.push({
    client: debtorForm.dClient.value,
    vehicle: debtorForm.dVehicle.value,
    amount: parseFloat(debtorForm.dAmount.value)
  });
  localStorage.setItem("debtors", JSON.stringify(list));
  debtorForm.reset();
  renderDebtors();
});
function renderDebtors() {
  const list = JSON.parse(localStorage.getItem("debtors") || "[]");
  const container = document.getElementById("debtorList");
  container.innerHTML = list.map((d, idx) => `
    <div class="list-item">
      <span><strong>${d.client}</strong> – ${d.vehicle} – R${d.amount.toFixed(2)}</span>
      <button onclick="deleteDebtor(${idx})">🗑️</button>
    </div>`).join("");
}
function deleteDebtor(i) {
  const list = JSON.parse(localStorage.getItem("debtors") || "[]");
  list.splice(i, 1);
  localStorage.setItem("debtors", JSON.stringify(list));
  renderDebtors();
}

/* ===== CREDITORS ===== */
const creditorForm = document.getElementById("creditorForm");
creditorForm.addEventListener("submit", e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem("creditors") || "[]");
  list.push({
    to: creditorForm.cTo.value,
    reason: creditorForm.cReason.value,
    amount: parseFloat(creditorForm.cAmount.value)
  });
  localStorage.setItem("creditors", JSON.stringify(list));
  creditorForm.reset();
  renderCreditors();
});
function renderCreditors() {
  const list = JSON.parse(localStorage.getItem("creditors") || "[]");
  const container = document.getElementById("creditorList");
  container.innerHTML = list.map((c, idx) => `
    <div class="list-item">
      <span><strong>${c.to}</strong> – ${c.reason} – R${c.amount.toFixed(2)}</span>
      <button onclick="deleteCreditor(${idx})">🗑️</button>
    </div>`).join("");
}
function deleteCreditor(i) {
  const list = JSON.parse(localStorage.getItem("creditors") || "[]");
  list.splice(i, 1);
  localStorage.setItem("creditors", JSON.stringify(list));
  renderCreditors();
}

/* ===== STOCK ===== */
const stockForm = document.getElementById("stockForm");
stockForm.addEventListener("submit", e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem("stock") || "[]");
  const nameLower = stockForm.stockName.value.toLowerCase();
  const idx = list.findIndex(item => item.name.toLowerCase() === nameLower);
  const newItem = {
    name: stockForm.stockName.value,
    quantity: Number(stockForm.stockQty.value),
    cost: parseFloat(stockForm.stockCost.value),
    sell: parseFloat(stockForm.stockSell.value)
  };
  if (idx > -1) {
    list[idx].quantity += newItem.quantity;
    list[idx].cost = newItem.cost;
    list[idx].sell = newItem.sell;
  } else {
    list.push(newItem);
  }
  localStorage.setItem("stock", JSON.stringify(list));
  stockForm.reset();
  renderStock();
});
function renderStock() {
  const list = JSON.parse(localStorage.getItem("stock") || "[]");
  const container = document.getElementById("stockList");
  container.innerHTML = list.map((it, idx) => `
    <div class="list-item">
      <span><strong>${it.name}</strong> – Qty: ${it.quantity}, Cost: R${it.cost.toFixed(2)}, Sell: R${it.sell.toFixed(2)}</span>
      <button onclick="deleteStock(${idx})">🗑️</button>
    </div>`).join("");
}
function deleteStock(i) {
  const list = JSON.parse(localStorage.getItem("stock") || "[]");
  list.splice(i, 1);
  localStorage.setItem("stock", JSON.stringify(list));
  renderStock();
}

/* ===== POS ===== */
let posCart = [];
function renderPOS() {
  const stock = JSON.parse(localStorage.getItem("stock") || "[]");
  const container = document.getElementById("posItems");
  container.innerHTML = stock.map((it, idx) => `
    <div class="list-item">
      <span><strong>${it.name}</strong> – ${it.quantity} in stock @ R${it.sell.toFixed(2)}</span>
      <button onclick="addToCart(${idx})">Add</button>
    </div>`).join("");
  updatePOSTotal();
}
function addToCart(idx) {
  const stock = JSON.parse(localStorage.getItem("stock") || "[]");
  if (stock[idx].quantity <= 0) {
    alert("Out of stock!");
    return;
  }
  const cartIdx = posCart.findIndex(c => c.name === stock[idx].name);
  if (cartIdx > -1) posCart[cartIdx].qty++;
  else posCart.push({ name: stock[idx].name, price: stock[idx].sell, qty: 1 });
  stock[idx].quantity--;
  localStorage.setItem("stock", JSON.stringify(stock));
  renderPOS();
}
function updatePOSTotal() {
  const total = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("posTotal").textContent = total.toFixed(2);
}
document.addEventListener("click", e => {
  if (e.target.matches("button") && e.target.textContent === "Complete Sale") {
    completeSale();
  }
});
function completeSale() {
  if (posCart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  const total = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const today = new Date().toISOString().slice(0, 10);
  const sales = JSON.parse(localStorage.getItem("sales") || "{}");
  sales[today] = (sales[today] || 0) + total;
  localStorage.setItem("sales", JSON.stringify(sales));
  alert(`Sale completed. Total: R${total.toFixed(2)}`);
  posCart = [];
  renderPOS();
}

/* ===== PETTY CASH ===== */
const pettyForm = document.getElementById("pettyForm");
pettyForm.addEventListener("submit", e => {
  e.preventDefault();
  const list = JSON.parse(localStorage.getItem("petty") || "[]");
  list.push({ desc: pettyForm.pettyDesc.value, amount: parseFloat(pettyForm.pettyAmount.value) });
  localStorage.setItem("petty", JSON.stringify(list));
  pettyForm.reset();
  renderPetty();
});
function renderPetty() {
  const list = JSON.parse(localStorage.getItem("petty") || "[]");
  const total = list.reduce((sum, p) => sum + p.amount, 0);
  document.getElementById("pettyBalance").textContent = total.toFixed(2);
  const container = document.getElementById("pettyList");
  container.innerHTML = list.map((p, idx) => `
    <div class="list-item">
      <span>${p.desc} – R${p.amount.toFixed(2)}</span>
      <button onclick="deletePetty(${idx})">🗑️</button>
    </div>`).join("");
}
function deletePetty(i) {
  const list = JSON.parse(localStorage.getItem("petty") || "[]");
  list.splice(i, 1);
  localStorage.setItem("petty", JSON.stringify(list));
  renderPetty();
}

/* ===== DAILY REPORTS ===== */
function renderReports() {
  const sales = JSON.parse(localStorage.getItem("sales") || "{}");
  const dates = Object.keys(sales).sort((a, b) => b.localeCompare(a));
  const container = document.getElementById("reportList");
  if (dates.length === 0) {
    container.innerHTML = "<div>No sales recorded yet.</div>";
  } else {
    container.innerHTML = dates.map(d => `
      <div class="list-item"><span>${d}: R${sales[d].toFixed(2)}</span></div>
    `).join("");
  }
}
