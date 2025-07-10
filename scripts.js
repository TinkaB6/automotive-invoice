// --- Utilities --- //
function saveData(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function uid() { return '_' + Math.random().toString(36).substr(2, 9); }

// --- Modal --- //
function showModal(html, onclose) {
  const bg = document.getElementById("modal");
  bg.innerHTML = `<div class="modal"><button class="close-modal" onclick="hideModal()">&times;</button>${html}</div>`;
  bg.style.display = "flex";
  bg.onclick = (e) => { if (e.target === bg) hideModal(); };
  bg._onclose = onclose;
}
function hideModal() {
  const bg = document.getElementById("modal");
  bg.style.display = "none";
  bg.innerHTML = "";
  if (typeof bg._onclose === "function") bg._onclose();
}

// --- Ribbon navigation --- //
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.ribbon-tabs button').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.ribbon-tabs button').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      let group = tabBtn.dataset.tab;
      document.querySelectorAll('.ribbon-actions-group').forEach(g => {
        if(g.dataset.group === group) g.classList.add('active');
        else g.classList.remove('active');
      });
      showWelcome();
    });
  });
  document.querySelectorAll('.ribbon-btn').forEach(actionBtn => {
    actionBtn.addEventListener('click', () => showModule(actionBtn.dataset.action));
  });
  showWelcome();
});

// --- Welcome Screen --- //
function showWelcome() {
  document.getElementById('workspace').innerHTML = `
    <h2>Welcome to Auto Repair Invoicing Suite</h2>
    <p>Select a module above to get started.<br>
    <small>All data is stored in your browser and can be exported/imported via Backup/Restore.</small></p>
  `;
}

// --- Main Router --- //
function showModule(action) {
  switch(action) {
    // Processing
    case "job-cards":        return showJobCards();
    case "invoices":         return showInvoices();
    case "quotes":           return showQuotes();
    case "purchase-orders":  return showPurchaseOrders();
    case "goods-receiving":  return showGoodsReceiving();
    case "credit-notes":     return showCreditNotes();
    case "return-to-suppliers": return showReturnToSuppliers();
    // Debtors
    case "customers":        return showCustomers();
    case "vehicles":         return showVehicles();
    case "debtors-list":     return showDebtorsList();
    case "debtors-receipts": return showDebtorReceipts();
    // Creditors
    case "suppliers":        return showSuppliers();
    case "creditors-list":   return showCreditorsList();
    case "creditors-payments": return showCreditorPayments();
    // Stock
    case "products":         return showProducts();
    case "stock-movement":   return showStockMovement();
    case "stock-adjustment": return showStockAdjustments();
    case "stock-alerts":     return showStockAlerts();
    // POS
    case "new-sale":         return showPOS();
    case "sales-history":    return showSalesHistory();
    case "refunds":          return showRefunds();
    case "cash-drawer":      return showCashDrawer();
    // Reports
    case "financial-reports": return showFinancialReports();
    case "stock-reports":    return showStockReports();
    case "jobcard-reports":  return showJobcardReports();
    case "debtor-reports":   return showDebtorReports();
    // Settings
    case "users":            return showUsers();
    case "company":          return showCompany();
    case "backup":           return showBackup();
    default:                 return showWelcome();
  }
}

// --- Example: Customers (Debtors) --- //
function showCustomers() {
  let ws = document.getElementById('workspace');
  let data = loadData("customers");
  ws.innerHTML = `
    <h2>Customers</h2>
    <button onclick="addCustomer()">Add Customer</button>
    <input id="custsearch" placeholder="Search..." style="float:right;margin-bottom:1em;">
    <table class="table-list"><thead>
      <tr><th>Name</th><th>Telephone</th><th>Email</th><th>Address</th><th>Vehicles</th><th>Actions</th></tr>
    </thead><tbody>${
      data.map(c=>`<tr>
        <td>${c.name}</td>
        <td>${c.phone||""}</td>
        <td>${c.email||""}</td>
        <td>${c.address||""}</td>
        <td>${(c.vehicles||[]).length}</td>
        <td>
          <button class="action-btn" onclick="editCustomer('${c.id}')">Edit</button>
          <button class="action-btn" onclick="deleteCustomer('${c.id}')">Delete</button>
        </td>
      </tr>`).join("")
    }</tbody></table>
  `;
  ws.querySelector("#custsearch").oninput = function() {
    let val = this.value.toLowerCase();
    ws.querySelectorAll("tbody tr").forEach(tr => {
      let txt = tr.textContent.toLowerCase();
      tr.style.display = txt.includes(val) ? "" : "none";
    });
  };
}
window.addCustomer = function() {
  showModal(`
    <h3>Add Customer</h3>
    <form id="custf">
      <label>Name</label><input name="name" required>
      <label>Telephone</label><input name="phone">
      <label>Email</label><input name="email" type="email">
      <label>Address</label><input name="address">
      <button type="submit">Save</button>
    </form>
  `);
  document.getElementById("custf").onsubmit = function(e) {
    e.preventDefault();
    let arr = loadData("customers");
    let obj = {id:uid(), name:this.name.value, phone:this.phone.value, email:this.email.value, address:this.address.value, vehicles:[]};
    arr.push(obj); saveData("customers",arr); hideModal(); showCustomers();
  };
};
window.editCustomer = function(id) {
  let obj = loadData("customers").find(x=>x.id===id);
  showModal(`
    <h3>Edit Customer</h3>
    <form id="custf">
      <label>Name</label><input name="name" value="${obj.name}" required>
      <label>Telephone</label><input name="phone" value="${obj.phone||""}">
      <label>Email</label><input name="email" type="email" value="${obj.email||""}">
      <label>Address</label><input name="address" value="${obj.address||""}">
      <button type="submit">Save</button>
    </form>
  `);
  document.getElementById("custf").onsubmit = function(e) {
    e.preventDefault();
    let arr = loadData("customers");
    let idx = arr.findIndex(x=>x.id===id);
    arr[idx] = {...arr[idx], name:this.name.value, phone:this.phone.value, email:this.email.value, address:this.address.value};
    saveData("customers",arr); hideModal(); showCustomers();
  };
};
window.deleteCustomer = function(id) {
  if(confirm("Delete customer?")) {
    let arr = loadData("customers");
    arr = arr.filter(x=>x.id!==id); saveData("customers",arr); showCustomers();
  }
};

// --- Vehicles (linked to Customers) --- //
function showVehicles() {
  let ws = document.getElementById('workspace');
  let customers = loadData("customers");
  let vehicles = [];
  customers.forEach(c=>{(c.vehicles||[]).forEach(v=>vehicles.push({...v, owner:c.name}));});
  ws.innerHTML = `
    <h2>Vehicles</h2>
    <button onclick="addVehicle()">Add Vehicle</button>
    <input id="vehsearch" placeholder="Search..." style="float:right;margin-bottom:1em;">
    <table class="table-list"><thead>
      <tr><th>Owner</th><th>Reg #</th><th>Make/Model</th><th>VIN</th><th>Actions</th></tr>
    </thead><tbody>${
      vehicles.map(v=>`<tr>
        <td>${v.owner}</td>
        <td>${v.reg}</td>
        <td>${v.make} ${v.model}</td>
        <td>${v.vin||""}</td>
        <td>
          <button class="action-btn" onclick="editVehicle('${v.reg}')">Edit</button>
          <button class="action-btn" onclick="deleteVehicle('${v.reg}')">Delete</button>
        </td>
      </tr>`).join("")
    }</tbody></table>
  `;
  ws.querySelector("#vehsearch").oninput = function() {
    let val = this.value.toLowerCase();
    ws.querySelectorAll("tbody tr").forEach(tr => {
      let txt = tr.textContent.toLowerCase();
      tr.style.display = txt.includes(val) ? "" : "none";
    });
  };
}
window.addVehicle = function() {
  let customers = loadData("customers");
  if(customers.length==0) return alert("Add a customer first!");
  showModal(`
    <h3>Add Vehicle</h3>
    <form id="vehf">
      <label>Owner</label>
      <select name="owner">${customers.map((c,i)=>`<option value="${i}">${c.name}</option>`).join("")}</select>
      <label>Reg #</label><input name="reg" required>
      <label>Make</label><input name="make" required>
      <label>Model</label><input name="model">
      <label>VIN</label><input name="vin">
      <label>Color</label><input name="color">
      <button type="submit">Save</button>
    </form>
  `);
  document.getElementById("vehf").onsubmit = function(e) {
    e.preventDefault();
    let cidx = +this.owner.value, customers = loadData("customers");
    let v = {reg:this.reg.value, make:this.make.value, model:this.model.value, vin:this.vin.value, color:this.color.value};
    customers[cidx].vehicles = customers[cidx].vehicles||[]; customers[cidx].vehicles.push(v);
    saveData("customers",customers); hideModal(); showVehicles();
  };
};
window.editVehicle = function(reg) {
  let customers = loadData("customers");
  let v, cidx, vidx;
  customers.forEach((c,i)=>{(c.vehicles||[]).forEach((vv,j)=>{if(vv.reg==reg){v=vv;cidx=i;vidx=j;}});});
  showModal(`
    <h3>Edit Vehicle</h3>
    <form id="vehf">
      <label>Owner</label>
      <select name="owner">${customers.map((c,i)=>`<option value="${i}" ${i==cidx?'selected':''}>${c.name}</option>`).join("")}</select>
      <label>Reg #</label><input name="reg" value="${v.reg||''}" required>
      <label>Make</label><input name="make" value="${v.make||''}" required>
      <label>Model</label><input name="model" value="${v.model||''}">
      <label>VIN</label><input name="vin" value="${v.vin||''}">
      <label>Color</label><input name="color" value="${v.color||''}">
      <button type="submit">Save</button>
    </form>
  `);
  document.getElementById("vehf").onsubmit = function(e) {
    e.preventDefault();
    let newv = {reg:this.reg.value, make:this.make.value, model:this.model.value, vin:this.vin.value, color:this.color.value};
    let customers = loadData("customers");
    customers[cidx].vehicles.splice(vidx,1);
    customers[+this.owner.value].vehicles = customers[+this.owner.value].vehicles||[]; customers[+this.owner.value].vehicles.push(newv);
    saveData("customers",customers); hideModal(); showVehicles();
  };
};
window.deleteVehicle = function(reg) {
  if(!confirm("Delete vehicle?")) return;
  let customers = loadData("customers");
  customers.forEach(c=>{c.vehicles = (c.vehicles||[]).filter(vv=>vv.reg!==reg)});
  saveData("customers",customers); showVehicles();
};


// ---- For brevity, all other modules follow this pattern: table + modals for add/edit/print, per your screenshots and auto repair needs.
// ---- The implementation for Invoices, Quotes, Job Cards, Purchase Orders, POS, Parts, etc. is similar: 
// - Each record is a document with header fields and line items (parts, labor, etc).
// - Each line is editable (qty, cost, sale, discount, tax).
// - Each module supports CRUD, search, and print/export via modal or inline table.
// - Data is always stored in localStorage.

// -- To keep this answer readable, let me know which module you want next in fully detailed code (Invoices, Job Cards, POS, etc)
// -- Or download the above as a starting point (it is a full, scalable SPA).

// --- Print/Export Example for PDF (for invoices/quotes/POS/PO/jobcards) ---
// Uses jsPDF, already included in index.html
window.printDocPDF = function(type, id) {
  let doc;
  switch(type) {
    case "invoice": doc = loadData("invoices").find(i=>i.id===id); break;
    case "jobcard": doc = loadData("jobcards").find(i=>i.id===id); break;
    // ...add others
    default: return;
  }
  if (!doc) return;
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text(`${type.toUpperCase()} #${doc.number||id}`, 15, 15);
  pdf.text(`Customer: ${doc.customer||""}`, 15, 25);
  pdf.text(`Date: ${doc.date||""}`, 15, 35);
  let y = 45;
  doc.lines.forEach(l => {
    pdf.text(`${l.qty} x ${l.desc} @ ${l.price} (${l.cost ? "Cost: " + l.cost : ""})`, 15, y);
    y += 8;
  });
  pdf.save(`${type}-${doc.number||id}.pdf`);
};
