document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab-content");

  function showTab(id) {
    sections.forEach(sec => sec.classList.remove("active"));
    const tabSection = document.getElementById(id);
    if (tabSection) tabSection.classList.add("active");
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
if (invoiceForm) {
  invoiceForm.addEventListener("submit", e => {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem("invoices") || "[]");
    list.push({
      company: invoiceForm.companyName.value,
      number: invoiceForm.invoiceNumber.value,
      client: invoiceForm.clientName.value,
      amount: parseFloat(invoiceForm.invoiceAmount.value) || 0
    });
    localStorage.setItem("invoices", JSON.stringify(list));
    invoiceForm.reset();
    renderInvoices();
  });
}
function renderInvoices() {
  const list = JSON.parse(localStorage.getItem("invoices") || "[]");
  const container = document.getElementById("invoiceList");
  if (!container) return;
  container.innerHTML = list.map((i, idx) => `
    <div class="list-item">
      <span><strong>${i.company || ""}</strong> #${i.number || ""} → ${i.client || ""} ‒ R${typeof i.amount === "number" && !isNaN(i.amount) ? i.amount.toFixed(2) : "0.00"}</span>
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
if (supplierForm) {
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
}
function renderSuppliers() {
  const list = JSON.parse(localStorage.getItem("suppliers") || "[]");
  const container = document.getElementById("supplierList");
  if (!container) return;
  container.innerHTML = list.map((s, idx) => `
    <div class="list-item">
      <span><strong>${s.name || ""}</strong> – ${s.contact || ""} (${s.items || ""})</span>
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
if (debtorForm) {
  debtorForm.addEventListener("submit", e => {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem("debtors") || "[]");
    list.push({
      client: debtorForm.dClient.value,
      vehicle: debtorForm.dVehicle.value,
      amount: parseFloat(debtorForm.dAmount.value) || 0
    });
    localStorage.setItem("debtors", JSON.stringify(list));
    debtorForm.reset();
    renderDebtors();
  });
}
function renderDebtors() {
  const list = JSON.parse(localStorage.getItem("debtors") || "[]");
  const container = document.getElementById("debtorList");
  if (!container) return;
  container.innerHTML = list.map((d, idx) => `
    <div class="list-item">
      <span><strong>${d.client || ""}</strong> – ${d.vehicle || ""} – R${typeof d.amount === "number" && !isNaN(d.amount) ? d.amount.toFixed(2) : "0.00"}</span>
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
if (creditorForm) {
  creditorForm.addEventListener("submit", e => {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem("creditors") || "[]");
    list.push({
      to: creditorForm.cTo.value,
      reason: creditorForm.cReason.value,
      amount: parseFloat(creditorForm.cAmount.value) || 0
    });
    localStorage.setItem("creditors", JSON.stringify(list));
    creditorForm.reset();
    renderCreditors();
  });
}
function renderCreditors() {
  const list = JSON.parse(localStorage.getItem("creditors") || "[]");
  const container = document.getElementById("creditorList");
  if (!container) return;
  container.innerHTML = list.map((c, idx) => `
    <div class="list-item">
      <span><strong>${c.to || ""}</strong> – ${c.reason || ""} – R${typeof c.amount === "number" && !isNaN(c.amount) ? c.amount.toFixed(2) : "0.00"}</span>
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
if (stockForm) {
  stockForm.addEventListener("submit", e => {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem("stock") || "[]");
    const nameLower = stockForm.stockName.value.toLowerCase();
    const idx = list.findIndex(item => item.name && item.name.toLowerCase() === nameLower);
    const newItem = {
      name: stockForm.stockName.value,
      quantity: Number(stockForm.stockQty.value) || 0,
      cost: parseFloat(stockForm.stockCost.value) || 0,
      sell: parseFloat(stockForm.stockSell.value) || 0
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
}
function renderStock() {
  const list = JSON.parse(localStorage.getItem("stock") || "[]");
  const container = document.getElementById("stockList");
  if (!container) return;
  container.innerHTML = list.map((it, idx) => `
    <div class="list-item">
      <span><strong>${it.name || ""}</strong> – Qty: ${it.quantity || 0}, Cost: R${typeof it.cost === "number" && !isNaN(it.cost) ? it.cost.toFixed(2) : "0.00"}, Sell: R${typeof it.sell === "number" && !isNaN(it.sell) ? it.sell.toFixed(2) : "0.00"}</span>
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
  if (!container) return;
  container.innerHTML = stock.map((it, idx) => `
    <div class="list-item">
      <span><strong>${it.name || ""}</strong> – ${it.quantity || 0} in stock @ R${typeof it.sell === "number" && !isNaN(it.sell) ? it.sell.toFixed(2) : "0.00"}</span>
      <button onclick="addToCart(${idx})">Add</button>
    </div>`).join("");
  updatePOSTotal();
}
window.addToCart = function(idx) {
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
  const posTotalElem = document.getElementById("posTotal");
  if (posTotalElem) posTotalElem.textContent = total.toFixed(2);
}
const completeSaleBtn = document.getElementById("completeSaleBtn");
if (completeSaleBtn) {
  completeSaleBtn.addEventListener("click", completeSale);
}
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
if (pettyForm) {
  pettyForm.addEventListener("submit", e => {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem("petty") || "[]");
    list.push({ desc: pettyForm.pettyDesc.value, amount: parseFloat(pettyForm.pettyAmount.value) || 0 });
    localStorage.setItem("petty", JSON.stringify(list));
    pettyForm.reset();
    renderPetty();
  });
}
function renderPetty() {
  const list = JSON.parse(localStorage.getItem("petty") || "[]");
  const total = list.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const pettyBalanceElem = document.getElementById("pettyBalance");
  if (pettyBalanceElem) pettyBalanceElem.textContent = total.toFixed(2);
  const container = document.getElementById("pettyList");
  if (!container) return;
  container.innerHTML = list.map((p, idx) => `
    <div class="list-item">
      <span>${p.desc || ""} – R${typeof p.amount === "number" && !isNaN(p.amount) ? p.amount.toFixed(2) : "0.00"}</span>
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
  if (!container) return;
  if (dates.length === 0) {
    container.innerHTML = "<div>No sales recorded yet.</div>";
  } else {
    container.innerHTML = dates.map(d => `
      <div class="list-item"><span>${d}: R${typeof sales[d] === "number" && !isNaN(sales[d]) ? sales[d].toFixed(2) : "0.00"}</span></div>
    `).join("");
  }
}

// Expose delete functions for inline onclick
window.deleteInvoice = deleteInvoice;
window.deleteSupplier = deleteSupplier;
window.deleteDebtor = deleteDebtor;
window.deleteCreditor = deleteCreditor;
window.deleteStock = deleteStock;
window.deletePetty = deletePetty;
