document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab-content");

  function showTab(id) {
    sections.forEach(sec => sec.classList.remove("active"));
    const tabSection = document.getElementById(id);
    if (tabSection) tabSection.classList.add("active");
    // Store the active tab in localStorage
    localStorage.setItem("activeTab", id);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      showTab(tab.dataset.tab);
      renderAll();
    });
  });

  // Restore last active tab, or default to "create"
  const lastTab = localStorage.getItem("activeTab") || "create";
  showTab(lastTab);
  renderAll();
});

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

  if (list.length === 0) {
    container.innerHTML = "<div>No invoices yet.</div>";
    return;
  }

  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Invoice #</th>
          <th>Client</th>
          <th>Amount (R)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((i, idx) => `
        <tr>
          <td>${i.company || ""}</td>
          <td>${i.number || ""}</td>
          <td>${i.client || ""}</td>
          <td>${typeof i.amount === "number" && !isNaN(i.amount) ? i.amount.toFixed(2) : "0.00"}</td>
          <td>
            <button onclick="printInvoice(${idx})">🖨️ Print</button>
            <button onclick="deleteInvoice(${idx})">🗑️ Delete</button>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
window.deleteInvoice = function(i) {
  const list = JSON.parse(localStorage.getItem("invoices") || "[]");
  list.splice(i, 1);
  localStorage.setItem("invoices", JSON.stringify(list));
  renderInvoices();
};
window.printInvoice = function(idx) {
  const list = JSON.parse(localStorage.getItem("invoices") || "[]");
  const i = list[idx];
  if (!i) return;
  const html = `
    <h2>Invoice</h2>
    <p><strong>Company:</strong> ${i.company}</p>
    <p><strong>Invoice #:</strong> ${i.number}</p>
    <p><strong>Client:</strong> ${i.client}</p>
    <p><strong>Amount:</strong> R${typeof i.amount === "number" && !isNaN(i.amount) ? i.amount.toFixed(2) : "0.00"}</p>
  `;
  const w = window.open('', '', 'width=600,height=400');
  w.document.write(`<html><head><title>Print Invoice</title>
    <style>body{font-family:sans-serif;padding:2em;}h2{margin-bottom:1em;}</style>
    </head><body>${html}</body></html>`);
  w.print();
  w.close();
};

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
  if (list.length === 0) {
    container.innerHTML = "<div>No suppliers yet.</div>";
    return;
  }
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Items</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((s, idx) => `
        <tr>
          <td>${s.name || ""}</td>
          <td>${s.contact || ""}</td>
          <td>${s.items || ""}</td>
          <td>
            <button onclick="deleteSupplier(${idx})">🗑️ Delete</button>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
window.deleteSupplier = function(i) {
  const list = JSON.parse(localStorage.getItem("suppliers") || "[]");
  list.splice(i, 1);
  localStorage.setItem("suppliers", JSON.stringify(list));
  renderSuppliers();
};

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
  if (list.length === 0) {
    container.innerHTML = "<div>No debtors yet.</div>";
    return;
  }
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Client</th>
          <th>Vehicle</th>
          <th>Amount (R)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((d, idx) => `
        <tr>
          <td>${d.client || ""}</td>
          <td>${d.vehicle || ""}</td>
          <td>${typeof d.amount === "number" && !isNaN(d.amount) ? d.amount.toFixed(2) : "0.00"}</td>
          <td>
            <button onclick="deleteDebtor(${idx})">🗑️ Delete</button>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
window.deleteDebtor = function(i) {
  const list = JSON.parse(localStorage.getItem("debtors") || "[]");
  list.splice(i, 1);
  localStorage.setItem("debtors", JSON.stringify(list));
  renderDebtors();
};

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
  if (list.length === 0) {
    container.innerHTML = "<div>No creditors yet.</div>";
    return;
  }
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>To</th>
          <th>Reason</th>
          <th>Amount (R)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((c, idx) => `
        <tr>
          <td>${c.to || ""}</td>
          <td>${c.reason || ""}</td>
          <td>${typeof c.amount === "number" && !isNaN(c.amount) ? c.amount.toFixed(2) : "0.00"}</td>
          <td>
            <button onclick="deleteCreditor(${idx})">🗑️ Delete</button>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
window.deleteCreditor = function(i) {
  const list = JSON.parse(localStorage.getItem("creditors") || "[]");
  list.splice(i, 1);
  localStorage.setItem("creditors", JSON.stringify(list));
  renderCreditors();
};

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
  if (list.length === 0) {
    container.innerHTML = "<div>No stock items yet.</div>";
    return;
  }
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Cost (R)</th>
          <th>Selling Price (R)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((it, idx) => `
        <tr>
          <td>${it.name || ""}</td>
          <td>${it.quantity || 0}</td>
          <td>${typeof it.cost === "number" && !isNaN(it.cost) ? it.cost.toFixed(2) : "0.00"}</td>
          <td>${typeof it.sell === "number" && !isNaN(it.sell) ? it.sell.toFixed(2) : "0.00"}</td>
          <td>
            <button onclick="deleteStock(${idx})">🗑️ Delete</button>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
window.deleteStock = function(i) {
  const list = JSON.parse(localStorage.getItem("stock") || "[]");
  list.splice(i, 1);
  localStorage.setItem("stock", JSON.stringify(list));
  renderStock();
};

/* ===== POS ===== */
let posCart = [];
function renderPOS() {
  const stock = JSON.parse(localStorage.getItem("stock") || "[]");
  const container = document.getElementById("posItems");
  if (!container) return;
  container.innerHTML = stock.length === 0
    ? "<div>No stock available for sale.</div>"
    : stock.map((it, idx) => `
      <div class="list-item">
        <span><strong>${it.name || ""}</strong> – ${it.quantity || 0} in stock @ R${typeof it.sell === "number" && !isNaN(it.sell) ? it.sell.toFixed(2) : "0.00"}</span>
        <button onclick="addToCart(${idx})">Add</button>
      </div>`).join("");
  updatePOSTotal();
  renderSalesHistory();
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
};
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
  if (!sales[today]) sales[today] = [];
  sales[today].push({
    items: posCart.map(i => ({ ...i })),
    total,
    time: new Date().toLocaleTimeString()
  });
  localStorage.setItem("sales", JSON.stringify(sales));
  alert(`Sale completed. Total: R${total.toFixed(2)}`);
  posCart = [];
  renderPOS();
}
function renderSalesHistory() {
  const sales = JSON.parse(localStorage.getItem("sales") || "{}");
  let allSales = [];
  Object.entries(sales).forEach(([date, salesArr]) => {
    salesArr.forEach(sale => {
      allSales.push({ date, ...sale });
    });
  });
  const container = document.getElementById("salesHistory");
  if (!container) return;
  if (allSales.length === 0) {
    container.innerHTML = "<div>No sales yet.</div>";
    return;
  }
  allSales.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Items</th>
          <th>Total (R)</th>
        </tr>
      </thead>
      <tbody>
        ${allSales.map(sale => `
        <tr>
          <td>${sale.date}</td>
          <td>${sale.time || ""}</td>
          <td>
            ${sale.items.map(i => `${i.name} x${i.qty}`).join("<br>")}
          </td>
          <td>${typeof sale.total === "number" && !isNaN(sale.total) ? sale.total.toFixed(2) : "0.00"}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
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
  if (list.length === 0) {
    container.innerHTML = "<div>No petty cash transactions yet.</div>";
    return;
  }
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount (R)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((p, idx) => `
        <tr>
          <td>${p.desc || ""}</td>
          <td>${typeof p.amount === "number" && !isNaN(p.amount) ? p.amount.toFixed(2) : "0.00"}</td>
          <td>
            <button onclick="deletePetty(${idx})">🗑️ Delete</button>
          </td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
window.deletePetty = function(i) {
  const list = JSON.parse(localStorage.getItem("petty") || "[]");
  list.splice(i, 1);
  localStorage.setItem("petty", JSON.stringify(list));
  renderPetty();
};

/* ===== DAILY REPORTS ===== */
function renderReports() {
  const sales = JSON.parse(localStorage.getItem("sales") || "{}");
  const dates = Object.keys(sales).sort((a, b) => b.localeCompare(a));
  const container = document.getElementById("reportList");
  if (!container) return;
  if (dates.length === 0) {
    container.innerHTML = "<div>No sales recorded yet.</div>";
    return;
  }
  container.innerHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Date</th>
          <th># of Sales</th>
          <th>Total (R)</th>
        </tr>
      </thead>
      <tbody>
        ${dates.map(d => {
          const total = sales[d].reduce((sum, s) => sum + (typeof s.total === "number" ? s.total : 0), 0);
          return `
          <tr>
            <td>${d}</td>
            <td>${sales[d].length}</td>
            <td>${total.toFixed(2)}</td>
          </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}
