// --- Utilities --- //
function saveData(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }
function loadData(key) { return JSON.parse(localStorage.getItem(key) || "[]"); }
function uid() { return '_' + Math.random().toString(36).substr(2, 9); }
function formatMoney(n) { return "R " + (+n).toFixed(2); }

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
      showModule(tabBtn.dataset.tab);
    });
  });
  showModule("invoices");
});

// --- Main Router --- //
function showModule(tab) {
  switch(tab) {
    case "invoices": return showInvoices();
    case "customers": return showCustomers();
    case "vehicles": return showVehicles();
    default: return showInvoices();
  }
}

// ------------ INVOICES MODULE ------------ //
function showInvoices() {
  let ws = document.getElementById('workspace');
  let invoices = loadData("invoices");
  let customers = loadData("customers");
  ws.innerHTML = `
    <h2>Invoices</h2>
    <button onclick="addInvoice()">Add Invoice</button>
    <input id="invsearch" placeholder="Search..." style="float:right;margin-bottom:1em;">
    <table class="table-list"><thead>
      <tr><th>#</th><th>Date</th><th>Customer</th><th>Vehicle</th><th>Total</th><th>Actions</th></tr>
    </thead><tbody>${
      invoices.map((inv,i)=>`<tr>
        <td>${inv.number}</td>
        <td>${inv.date}</td>
        <td>${inv.customerName||""}</td>
        <td>${inv.vehicleReg||""}</td>
        <td>${formatMoney(invTotal(inv))}</td>
        <td>
          <button class="action-btn" onclick="editInvoice('${inv.id}')">Edit</button>
          <button class="action-btn" onclick="deleteInvoice('${inv.id}')">Delete</button>
          <button class="action-btn" onclick="printInvoicePDF('${inv.id}')">Print</button>
        </td>
      </tr>`).join("")
    }</tbody></table>
  `;
  ws.querySelector("#invsearch").oninput = function() {
    let val = this.value.toLowerCase();
    ws.querySelectorAll("tbody tr").forEach(tr => {
      let txt = tr.textContent.toLowerCase();
      tr.style.display = txt.includes(val) ? "" : "none";
    });
  };
}
function invTotal(inv) {
  return (inv.lines||[]).reduce((s,l)=>
    s + (parseFloat(l.qty||0) * parseFloat(l.sale||0)) * (1-parseFloat(l.discount||0)/100) * (1+parseFloat(l.tax||0)/100)
  ,0);
}
window.addInvoice = function() { invoiceForm(); };
window.editInvoice = function(id) {
  let inv = loadData("invoices").find(i=>i.id===id);
  invoiceForm(inv);
};
window.deleteInvoice = function(id) {
  if(!confirm("Delete invoice?")) return;
  let arr = loadData("invoices");
  arr = arr.filter(x=>x.id!==id); saveData("invoices",arr); showInvoices();
};
function invoiceForm(inv) {
  let customers = loadData("customers");
  let vehicles = [];
  let vehicleSelectHtml = '';
  if (inv && inv.customerId) {
    let c = customers.find(c=>c.id===inv.customerId);
    vehicles = (c && c.vehicles) ? c.vehicles : [];
  }
  showModal(`
    <h3>${inv?"Edit":"New"} Invoice</h3>
    <form id="invf">
      <label>Date</label><input name="date" type="date" required value="${inv?inv.date:(new Date).toISOString().slice(0,10)}">
      <label>Invoice #</label><input name="number" required value="${inv?inv.number:""}">
      <label>Customer</label>
      <select name="customerId" required>
        <option value="">-- Select Customer --</option>
        ${customers.map(c=>`<option value="${c.id}"${inv&&inv.customerId==c.id?" selected":""}>${c.name}</option>`).join("")}
      </select>
      <button type="button" onclick="addCustomerFromInv()">+ New Customer</button>
      <label>Vehicle</label>
      <select name="vehicleReg" id="vehselect">
        <option value="">-- Select Vehicle --</option>
        ${(vehicles||[]).map(v=>`<option value="${v.reg}"${inv&&inv.vehicleReg==v.reg?" selected":""}>${v.reg} (${v.make||""} ${v.model||""})</option>`).join("")}
      </select>
      <button type="button" onclick="addVehicleFromInv()">+ New Vehicle</button>
      <div id="linesarea"></div>
      <button type="button" onclick="addInvLine()">+ Add Line</button>
      <br>
      <button type="submit">Save</button>
    </form>
    <style>
      #linesarea table {margin:0.5em 0;}
      #linesarea input {width:90px;}
    </style>
  `, ()=>{showInvoices();});
  let lines = inv && inv.lines ? JSON.parse(JSON.stringify(inv.lines)) : [];
  renderLines();
  document.getElementById("invf").customerId.onchange = function() {
    let c = customers.find(c=>c.id==this.value);
    vehicles = c && c.vehicles ? c.vehicles : [];
    let vehsel = document.getElementById("vehselect");
    vehsel.innerHTML = `<option value="">-- Select Vehicle --</option>` +
      vehicles.map(v=>`<option value="${v.reg}">${v.reg} (${v.make||""} ${v.model||""})</option>`).join("");
  };
  function renderLines() {
    document.getElementById("linesarea").innerHTML = lines.length ?
    `<table class="table-list"><tr>
      <th>Description</th><th>Qty</th><th>Cost</th><th>Sale</th><th>Discount %</th><th>Tax %</th><th>Total</th><th>Remove</th>
    </tr>${
      lines.map((l,i)=>`<tr>
        <td><input value="${l.desc||""}" onchange="invLineEdit(${i},'desc',this.value)"></td>
        <td><input type="number" min="1" value="${l.qty||1}" onchange="invLineEdit(${i},'qty',this.value)"></td>
        <td><input type="number" min="0" step="0.01" value="${l.cost||0}" onchange="invLineEdit(${i},'cost',this.value)"></td>
        <td><input type="number" min="0" step="0.01" value="${l.sale||0}" onchange="invLineEdit(${i},'sale',this.value)"></td>
        <td><input type="number" min="0" max="100" step="0.01" value="${l.discount||0}" onchange="invLineEdit(${i},'discount',this.value)"></td>
        <td><input type="number" min="0" max="100" step="0.01" value="${l.tax||0}" onchange="invLineEdit(${i},'tax',this.value)"></td>
        <td>${formatMoney((l.qty||1)*(l.sale||0)*(1-(l.discount||0)/100)*(1+(l.tax||0)/100))}</td>
        <td><button type="button" onclick="invLineDelete(${i})">X</button></td>
      </tr>`).join("")
    }</table>` : `<em>No lines yet</em>`;
  }
  window.addInvLine = function() {
    lines.push({desc:'',qty:1,cost:0,sale:0,discount:0,tax:0});
    renderLines();
  };
  window.invLineEdit = function(idx,field,val) {
    lines[idx][field] = val;
    renderLines();
  };
  window.invLineDelete = function(idx) {
    lines.splice(idx,1);
    renderLines();
  };
  document.getElementById("invf").onsubmit = function(e) {
    e.preventDefault();
    if(!lines.length) return alert("Add at least one line!");
    let arr = loadData("invoices");
    let c = customers.find(c=>c.id==this.customerId.value);
    let obj = {
      id: inv?inv.id:uid(),
      date: this.date.value,
      number: this.number.value,
      customerId: this.customerId.value,
      customerName: c ? c.name : "",
      vehicleReg: this.vehicleReg.value,
      lines: JSON.parse(JSON.stringify(lines))
    };
    if(inv) {
      let idx = arr.findIndex(x=>x.id===inv.id);
      arr[idx] = obj;
    } else arr.push(obj);
    saveData("invoices",arr); hideModal(); showInvoices();
  };
}
window.printInvoicePDF = function(id) {
  let inv = loadData("invoices").find(i=>i.id===id);
  if(!inv) return;
  let { jsPDF } = window.jspdf;
  let pdf = new jsPDF();
  pdf.setFontSize(16);
  pdf.text(`INVOICE #${inv.number}`, 15, 15);
  pdf.setFontSize(12);
  pdf.text(`Date: ${inv.date}`, 15, 25);
  pdf.text(`Customer: ${inv.customerName||""}`, 15, 35);
  pdf.text(`Vehicle: ${inv.vehicleReg||""}`, 15, 45);
  let y = 55;
  pdf.setFontSize(11);
  pdf.text("Description", 15, y);
  pdf.text("Qty", 90, y);
  pdf.text("Cost", 105, y);
  pdf.text("Sale", 125, y);
  pdf.text("Disc%", 145, y);
  pdf.text("Tax%", 160, y);
  pdf.text("Total", 180, y);
  y += 7;
  inv.lines.forEach(l=>{
    pdf.text(String(l.desc||""), 15, y);
    pdf.text(String(l.qty||""), 90, y);
    pdf.text(String(l.cost||""), 105, y);
    pdf.text(String(l.sale||""), 125, y);
    pdf.text(String(l.discount||""), 145, y);
    pdf.text(String(l.tax||""), 160, y);
    let lineTotal = (l.qty||1)*(l.sale||0)*(1-(l.discount||0)/100)*(1+(l.tax||0)/100);
    pdf.text(formatMoney(lineTotal), 180, y, {align:"right"});
    y+=7;
    if(y>270) { pdf.addPage(); y=20; }
  });
  y+=7;
  pdf.setFontSize(14); pdf.text(`TOTAL: ${formatMoney(invTotal(inv))}`, 155, y);
  pdf.save(`invoice-${inv.number}.pdf`);
};

// ------------ CUSTOMERS & VEHICLES (minimal, for invoices) ------------ //
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
window.addCustomerFromInv = function() {
  showModal(`
    <h3>Add Customer</h3>
    <form id="custf">
      <label>Name</label><input name="name" required>
      <label>Telephone</label><input name="phone">
      <label>Email</label><input name="email" type="email">
      <label>Address</label><input name="address">
      <button type="submit">Save</button>
    </form>
  `, () => invoiceForm());
  document.getElementById("custf").onsubmit = function(e) {
    e.preventDefault();
    let arr = loadData("customers");
    let obj = {id:uid(), name:this.name.value, phone:this.phone.value, email:this.email.value, address:this.address.value, vehicles:[]};
    arr.push(obj); saveData("customers",arr); hideModal(); invoiceForm();
  };
};

// Vehicles
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
window.addVehicleFromInv = function() {
  let customers = loadData("customers");
  let cidx = document.getElementById("invf").customerId.value;
  if(!cidx) return alert("Please select a customer first");
  let custIndex = customers.findIndex(c=>c.id==cidx);
  showModal(`
    <h3>Add Vehicle</h3>
    <form id="vehf">
      <label>Owner</label>
      <input value="${customers[custIndex].name}" disabled><input type="hidden" name="owner" value="${custIndex}">
      <label>Reg #</label><input name="reg" required>
      <label>Make</label><input name="make" required>
      <label>Model</label><input name="model">
      <label>VIN</label><input name="vin">
      <label>Color</label><input name="color">
      <button type="submit">Save</button>
    </form>
  `, ()=> invoiceForm());
  document.getElementById("vehf").onsubmit = function(e) {
    e.preventDefault();
    let cidx = +this.owner.value, customers = loadData("customers");
    let v = {reg:this.reg.value, make:this.make.value, model:this.model.value, vin:this.vin.value, color:this.color.value};
    customers[cidx].vehicles = customers[cidx].vehicles||[]; customers[cidx].vehicles.push(v);
    saveData("customers",customers); hideModal(); invoiceForm();
  };
};
