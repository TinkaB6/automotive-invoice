// Utility: save/load data in localStorage
function saveData(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Ribbon navigation
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
    actionBtn.addEventListener('click', () => {
      showWorkspace(actionBtn.dataset.action);
    });
  });

  showWelcome();
});

// Workspace loader
function showWorkspace(action) {
  const ws = document.getElementById('workspace');
  // Processing
  if(action==="purchase-orders") return renderPurchaseOrders(ws);
  if(action==="invoicing") return renderInvoicing(ws);
  if(action==="goods-receiving") return renderGoodsReceiving(ws);
  if(action==="return-to-suppliers") return renderReturnToSuppliers(ws);
  if(action==="credit-notes") return renderCreditNotes(ws);
  if(action==="quotes") return renderQuotes(ws);
  // Debtors
  if(action==="debtors-maintenance") return renderDebtorMaintenance(ws);
  if(action==="debtors-add") return renderDebtorAdd(ws);
  if(action==="debtors-enquiries") return renderDebtorEnquiries(ws);
  if(action==="debtors-receipts") return renderDebtorReceipts(ws);
  // Creditors
  if(action==="creditors-maintenance") return renderCreditorMaintenance(ws);
  if(action==="creditors-add") return renderCreditorAdd(ws);
  if(action==="creditors-enquiries") return renderCreditorEnquiries(ws);
  if(action==="creditors-receipts") return renderCreditorReceipts(ws);
  // Stock
  if(action==="product-list") return renderProductList(ws);
  if(action==="stock-in") return renderStockIn(ws);
  if(action==="stock-out") return renderStockOut(ws);
  if(action==="stock-adjustment") return renderStockAdjustment(ws);
  if(action==="stock-transfer") return renderStockTransfer(ws);
  if(action==="low-stock-alerts") return renderLowStockAlerts(ws);
  if(action==="stock-history") return renderStockHistory(ws);
  // POS
  if(action==="new-sale") return renderNewSale(ws);
  if(action==="hold-resume-sale") return renderHoldResumeSale(ws);
  if(action==="customer-search") return renderCustomerSearch(ws);
  if(action==="product-search") return renderProductSearch(ws);
  if(action==="discounts-offers") return renderDiscountsOffers(ws);
  if(action==="payment") return renderPayment(ws);
  if(action==="print-email-receipt") return renderPrintEmailReceipt(ws);
  if(action==="sales-history") return renderSalesHistory(ws);
  if(action==="refunds-returns") return renderRefundsReturns(ws);
  if(action==="cash-drawer") return renderCashDrawer(ws);
  // Reports
  if(action==="stock-reports") return renderStockReports(ws);
  if(action==="sales-reports") return renderSalesReports(ws);
  if(action==="analytics") return renderAnalytics(ws);
  // Default
  ws.innerHTML = `<h2>${action}</h2><p>Not implemented.</p>`;
}
function showWelcome() {
  document.getElementById('workspace').innerHTML = `
    <h2>Welcome to IQ Retail Web</h2>
    <p>Select a function from the ribbon above.</p>
  `;
}

// --- Processing: All Sub Actions ---
function renderPurchaseOrders(ws) { renderBasicFormList(ws, "Purchase Orders", "purchaseOrders", ["Order #","Supplier","Date","Amount"], ["orderNo","supplier","date","amount"]); }
function renderInvoicing(ws)      { renderBasicFormList(ws, "Invoicing", "invoices", ["Invoice #","Customer","Date","Amount"], ["invoiceNo","customer","date","amount"]); }
function renderGoodsReceiving(ws) { renderBasicFormList(ws, "Goods Receiving", "goodsReceiving", ["GRN #","Supplier","Date","Amount"], ["grnNo","supplier","date","amount"]); }
function renderReturnToSuppliers(ws) { renderBasicFormList(ws, "Return to Suppliers", "returnToSuppliers", ["Return #","Supplier","Date","Amount"], ["returnNo","supplier","date","amount"]); }
function renderCreditNotes(ws)    { renderBasicFormList(ws, "Credit Notes", "creditNotes", ["Credit Note #","Customer","Date","Amount"], ["creditNo","customer","date","amount"]); }
function renderQuotes(ws)         { renderBasicFormList(ws, "Quotes", "quotes", ["Quote #","Customer","Date","Amount"], ["quoteNo","customer","date","amount"]); }

// --- Debtors ---
function renderDebtorMaintenance(ws) { renderBasicFormList(ws, "Debtor Maintenance", "debtorMaintenance", ["Account #","Name","Contact"], ["accountNo","name","contact"]); }
function renderDebtorAdd(ws)         { renderBasicFormList(ws, "Add Debtor", "debtors", ["Account #","Name","Contact"], ["accountNo","name","contact"]); }
function renderDebtorEnquiries(ws)   { renderSearchList(ws, "Debtor Enquiries", "debtors", ["Account #","Name","Contact"], ["accountNo","name","contact"]); }
function renderDebtorReceipts(ws)    { renderBasicFormList(ws, "Debtor Receipts", "debtorReceipts", ["Receipt #","Account #","Amount","Date"], ["receiptNo","accountNo","amount","date"]); }

// --- Creditors ---
function renderCreditorMaintenance(ws) { renderBasicFormList(ws, "Creditor Maintenance", "creditorMaintenance", ["Account #","Name","Contact"], ["accountNo","name","contact"]); }
function renderCreditorAdd(ws)         { renderBasicFormList(ws, "Add Creditor", "creditors", ["Account #","Name","Contact"], ["accountNo","name","contact"]); }
function renderCreditorEnquiries(ws)   { renderSearchList(ws, "Creditor Enquiries", "creditors", ["Account #","Name","Contact"], ["accountNo","name","contact"]); }
function renderCreditorReceipts(ws)    { renderBasicFormList(ws, "Creditor Receipts", "creditorReceipts", ["Receipt #","Account #","Amount","Date"], ["receiptNo","accountNo","amount","date"]); }

// --- Stock ---
function renderProductList(ws)    { renderBasicFormList(ws, "Product List", "products", ["SKU","Name","Qty","Cost","Sell Price"], ["sku","name","qty","cost","price"]); }
function renderStockIn(ws)        { renderBasicFormList(ws, "Stock In", "stockIn", ["SKU","Qty","Date"], ["sku","qty","date"]); }
function renderStockOut(ws)       { renderBasicFormList(ws, "Stock Out", "stockOut", ["SKU","Qty","Date"], ["sku","qty","date"]); }
function renderStockAdjustment(ws){ renderBasicFormList(ws, "Stock Adjustment", "stockAdjust", ["SKU","Old Qty","New Qty","Reason"], ["sku","oldqty","newqty","reason"]); }
function renderStockTransfer(ws)  { renderBasicFormList(ws, "Stock Transfer", "stockTransfer", ["SKU","From","To","Qty","Date"], ["sku","from","to","qty","date"]); }
function renderLowStockAlerts(ws) {
  let products = loadData("products");
  ws.innerHTML = `<h2>Low Stock Alerts</h2><table class="table-list"><tr><th>SKU</th><th>Name</th><th>Qty</th></tr>${
    products.filter(p=>parseInt(p.qty)<5).map(p=>`<tr><td>${p.sku}</td><td>${p.name}</td><td>${p.qty}</td></tr>`).join("")||'<tr><td colspan="3">No low stock items.</td></tr>'
  }</table>`;
}
function renderStockHistory(ws) {
  ws.innerHTML = `<h2>Stock History</h2>
    <p>(Shows all stock in, out, adjustments and transfers)</p>
    <div>
      <b>Stock In:</b>
      <ul>${loadData("stockIn").map(s=>`<li>${s.date||''} SKU:${s.sku} +${s.qty}</li>`).join("")}</ul>
      <b>Stock Out:</b>
      <ul>${loadData("stockOut").map(s=>`<li>${s.date||''} SKU:${s.sku} -${s.qty}</li>`).join("")}</ul>
      <b>Adjustments:</b>
      <ul>${loadData("stockAdjust").map(s=>`<li>SKU:${s.sku} ${s.oldqty}→${s.newqty} (${s.reason})</li>`).join("")}</ul>
      <b>Transfers:</b>
      <ul>${loadData("stockTransfer").map(s=>`<li>${s.date||''} SKU:${s.sku} ${s.from}→${s.to} (${s.qty})</li>`).join("")}</ul>
    </div>`;
}

// --- POS ---
function renderNewSale(ws) {
  ws.innerHTML = `<h2>New Sale</h2>
    <form id="saleForm">
      <label>Product SKU</label>
      <input name="sku" required>
      <label>Qty</label>
      <input name="qty" type="number" min="1" value="1" required>
      <button type="submit">Add to Cart</button>
    </form>
    <div id="saleCart"></div>
    <button id="completeSaleBtn">Complete Sale</button>`;
  let cart = [];
  function renderCart() {
    ws.querySelector("#saleCart").innerHTML = cart.length===0?'<em>No items in cart.</em>':`
      <table class="table-list"><tr><th>SKU</th><th>Qty</th><th>Remove</th></tr>${
        cart.map((c,i)=>`<tr><td>${c.sku}</td><td>${c.qty}</td>
        <td><button class="action-btn" onclick="removeCartItem(${i})">Delete</button></td></tr>`).join("")
      }</table>`;
  }
  ws.querySelector("#saleForm").onsubmit = e => {
    e.preventDefault();
    let f = e.target;
    cart.push({sku:f.sku.value,qty:parseInt(f.qty.value)});
    renderCart();f.reset();
  };
  window.removeCartItem = i => { cart.splice(i,1); renderCart(); };
  ws.querySelector("#completeSaleBtn").onclick=()=>{
    let sales = loadData("sales");
    let t = new Date().toISOString();
    sales.push({cart:JSON.parse(JSON.stringify(cart)),time:t});
    saveData("sales",sales);
    cart=[];renderCart();
    alert("Sale completed!");
  };
  renderCart();
}
function renderHoldResumeSale(ws) {
  ws.innerHTML = `<h2>Hold/Resume Sale</h2><p>Feature for pausing/resuming sales (not implemented).</p>`;
}
function renderCustomerSearch(ws) {
  ws.innerHTML = `<h2>Customer Search</h2>
    <input id="customerSearchBox" placeholder="Search by name or account #">
    <ul id="custResults"></ul>`;
  let debtors = loadData("debtors");
  const box = ws.querySelector("#customerSearchBox");
  const res = ws.querySelector("#custResults");
  box.oninput = ()=>{
    let q = box.value.toLowerCase();
    res.innerHTML = debtors.filter(d=>d.name.toLowerCase().includes(q)||d.accountNo.toLowerCase().includes(q))
      .map(d=>`<li>${d.accountNo} - ${d.name} (${d.contact})</li>`).join("") || "<li>No results</li>";
  };
}
function renderProductSearch(ws) {
  ws.innerHTML = `<h2>Product Search/Scan</h2>
    <input id="productSearchBox" placeholder="Search by SKU or name">
    <ul id="prodResults"></ul>`;
  let products = loadData("products");
  const box = ws.querySelector("#productSearchBox");
  const res = ws.querySelector("#prodResults");
  box.oninput = ()=>{
    let q = box.value.toLowerCase();
    res.innerHTML = products.filter(p=>p.sku.toLowerCase().includes(q)||p.name.toLowerCase().includes(q))
      .map(p=>`<li>${p.sku} - ${p.name} (Qty: ${p.qty})</li>`).join("") || "<li>No results</li>";
  };
}
function renderDiscountsOffers(ws) { ws.innerHTML = `<h2>Discounts & Offers</h2><p>(Configure discounts/promotions here.)</p>`; }
function renderPayment(ws) { ws.innerHTML = `<h2>Payment</h2><p>Feature to process payments (not implemented).</p>`; }
function renderPrintEmailReceipt(ws) { ws.innerHTML = `<h2>Print/Email Receipt</h2><p>Feature to print or email receipts (not implemented).</p>`; }
function renderSalesHistory(ws) {
  let sales = loadData("sales");
  ws.innerHTML = `<h2>Sales History</h2>
    <table class="table-list"><tr><th>Date</th><th>Items</th></tr>${
      sales.map(s=>`<tr><td>${s.time}</td><td>${
        s.cart.map(i=>`${i.sku} x${i.qty}`).join("<br>")
      }</td></tr>`).join("")||'<tr><td colspan="2">No sales yet.</td></tr>'
    }</table>`;
}
function renderRefundsReturns(ws) {
  ws.innerHTML = `<h2>Refunds/Returns</h2><p>Feature to process returns or refunds (not implemented).</p>`;
}
function renderCashDrawer(ws) {
  ws.innerHTML = `<h2>Cash Drawer</h2><p>Function to manage cash drawer (not implemented).</p>`;
}

// --- Reports ---
function renderStockReports(ws) {
  ws.innerHTML = `<h2>Stock Reports</h2>
    <table class="table-list"><tr><th>SKU</th><th>Name</th><th>Qty</th><th>Sell Price</th></tr>${
      loadData("products").map(p=>`<tr><td>${p.sku}</td><td>${p.name}</td><td>${p.qty}</td><td>${p.price}</td></tr>`).join("")||'<tr><td colspan="4">No data.</td></tr>'
    }</table>`;
}
function renderSalesReports(ws) {
  let sales = loadData("sales");
  let total = sales.reduce((s, sale) => s + sale.cart.reduce((t, i) => t + (parseInt(i.qty)||0), 0), 0);
  ws.innerHTML = `<h2>Sales Reports</h2>
    <p>Total sales: ${sales.length}, Total items sold: ${total}</p>`;
}
function renderAnalytics(ws) {
  ws.innerHTML = `<h2>Analytics</h2><p>(Graphs or analytics can go here.)</p>`;
}

// --- Generic form+list rendering helpers ---
function renderBasicFormList(ws, title, storageKey, labels, fields) {
  ws.innerHTML = `<h2>${title}</h2>
    <form id="genericForm">${fields.map((f,i)=>`
      <label>${labels[i]}</label>
      <input name="${f}" ${f.includes("date")?'type="date"':''} required>
    `).join("")}
      <button type="submit">Add</button>
    </form>
    <table class="table-list" id="genericTable">
      <thead><tr>${labels.map(l=>`<th>${l}</th>`).join("")}<th>Actions</th></tr></thead>
      <tbody></tbody>
    </table>
  `;
  let data = loadData(storageKey);
  const table = ws.querySelector("#genericTable tbody");
  function render() {
    table.innerHTML = data.map((row,i)=>`
      <tr>
        ${fields.map(f=>`<td>${row[f]}</td>`).join("")}
        <td>
          <button class="action-btn" onclick="window.editRow('${storageKey}',${i})">Edit</button>
          <button class="action-btn" onclick="window.deleteRow('${storageKey}',${i})">Delete</button>
        </td>
      </tr>`).join("");
  }
  render();
  ws.querySelector("#genericForm").onsubmit = e => {
    e.preventDefault();
    let f = e.target;
    let o = {};
    fields.forEach(ff=>o[ff]=f[ff].value);
    data.push(o); saveData(storageKey,data); render(); f.reset();
  };
  window.editRow = (k,i)=>{
    let row = data[i], f = ws.querySelector("#genericForm");
    fields.forEach(ff=>f[ff].value=row[ff]);
    data.splice(i,1); saveData(storageKey,data); render();
  };
  window.deleteRow = (k,i)=>{
    if(confirm("Delete this entry?")){ data.splice(i,1); saveData(storageKey,data); render(); }
  };
}
function renderSearchList(ws, title, storageKey, labels, fields) {
  ws.innerHTML = `<h2>${title}</h2>
    <input id="searchBox" placeholder="Search...">
    <table class="table-list"><thead><tr>${labels.map(l=>`<th>${l}</th>`).join("")}</tr></thead><tbody id="searchTable"></tbody></table>`;
  let data = loadData(storageKey);
  const table = ws.querySelector("#searchTable");
  function render(q="") {
    let filtered = data.filter(row=>fields.some(f=>(row[f]||"").toLowerCase().includes(q.toLowerCase())));
    table.innerHTML = filtered.map(row=>`<tr>${fields.map(f=>`<td>${row[f]}</td>`).join("")}</tr>`).join("")||"<tr><td colspan='"+fields.length+"'>No results</td></tr>";
  }
  render();
  ws.querySelector("#searchBox").oninput = e => render(e.target.value);
}
