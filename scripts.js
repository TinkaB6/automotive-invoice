// Utility: save/load data in localStorage
function saveData(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// -- Ribbon navigation --
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  document.querySelectorAll('.ribbon-tabs button').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.ribbon-tabs button').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      let group = tabBtn.dataset.tab;
      document.querySelectorAll('.ribbon-actions-group').forEach(g => {
        if(g.dataset.group === group) g.classList.add('active');
        else g.classList.remove('active');
      });
      // Clear workspace
      showWelcome();
    });
  });

  // Sub-action click
  document.querySelectorAll('.ribbon-btn').forEach(actionBtn => {
    actionBtn.addEventListener('click', () => {
      const action = actionBtn.dataset.action;
      showWorkspace(action);
    });
  });

  // Show Welcome on load
  showWelcome();
});

// -- Workspace loader --
function showWorkspace(action) {
  const workspace = document.getElementById('workspace');
  switch(action) {
    // Processing
    case "purchase-orders": renderPOPage(workspace); break;
    case "invoicing": renderInvoicePage(workspace); break;
    case "goods-receiving": renderGoodsReceivingPage(workspace); break;
    case "return-to-suppliers": renderReturnSuppliersPage(workspace); break;
    case "credit-notes": renderCreditNotesPage(workspace); break;
    case "quotes": renderQuotesPage(workspace); break;

    // Debtors
    case "debtors-maintenance": renderDebtorMaintenancePage(workspace); break;
    case "debtors-add": renderDebtorAddPage(workspace); break;
    case "debtors-enquiries": renderDebtorEnquiriesPage(workspace); break;
    case "debtors-receipts": renderDebtorReceiptsPage(workspace); break;

    // Creditors
    case "creditors-maintenance": renderCreditorMaintenancePage(workspace); break;
    case "creditors-add": renderCreditorAddPage(workspace); break;
    case "creditors-enquiries": renderCreditorEnquiriesPage(workspace); break;
    case "creditors-receipts": renderCreditorReceiptsPage(workspace); break;

    // Stock
    case "product-list": renderStockProductListPage(workspace); break;
    case "stock-in": renderStockInPage(workspace); break;
    case "stock-out": renderStockOutPage(workspace); break;
    case "stock-adjustment": renderStockAdjustmentPage(workspace); break;
    case "stock-transfer": renderStockTransferPage(workspace); break;
    case "low-stock-alerts": renderLowStockAlertsPage(workspace); break;
    case "stock-history": renderStockHistoryPage(workspace); break;

    // POS
    case "new-sale": renderPOSNewSalePage(workspace); break;
    case "hold-resume-sale": renderPOSHoldResumePage(workspace); break;
    case "customer-search": renderPOSCustomerSearchPage(workspace); break;
    case "product-search": renderPOSProductSearchPage(workspace); break;
    case "discounts-offers": renderPOSDiscountsOffersPage(workspace); break;
    case "payment": renderPOSPaymentPage(workspace); break;
    case "print-email-receipt": renderPOSPrintEmailPage(workspace); break;
    case "sales-history": renderPOSSalesHistoryPage(workspace); break;
    case "refunds-returns": renderPOSRefundsReturnsPage(workspace); break;
    case "cash-drawer": renderPOSCashDrawerPage(workspace); break;

    // Reports
    case "stock-reports": renderStockReportsPage(workspace); break;
    case "sales-reports": renderSalesReportsPage(workspace); break;
    case "analytics": renderAnalyticsPage(workspace); break;

    // Default
    default:
      workspace.innerHTML = `<h2>${action}</h2><p>Not implemented.</p>`;
  }
}
function showWelcome() {
  document.getElementById('workspace').innerHTML = `
    <h2>Welcome to IQ Retail Web</h2>
    <p>Select a function from the ribbon above.</p>
  `;
}

// ---- Demo Implementation: Processing > Invoicing ----
function renderInvoicePage(ws) {
  ws.innerHTML = `
    <h2>Invoicing</h2>
    <form id="invoiceForm">
      <label>Invoice #</label>
      <input name="number" required>
      <label>Date</label>
      <input name="date" type="date" required>
      <label>Customer</label>
      <input name="customer" required>
      <label>Amount</label>
      <input name="amount" type="number" step="0.01" required>
      <button type="submit">Add Invoice</button>
    </form>
    <table class="table-list" id="invoiceTable">
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  let invoices = loadData("invoices");
  const table = ws.querySelector("#invoiceTable tbody");
  function render() {
    table.innerHTML = invoices.map((inv, i) => `
      <tr>
        <td>${inv.number}</td>
        <td>${inv.date}</td>
        <td>${inv.customer}</td>
        <td>R ${parseFloat(inv.amount).toFixed(2)}</td>
        <td>
          <button class="action-btn" onclick="editInvoice(${i})">Edit</button>
          <button class="action-btn" onclick="deleteInvoice(${i})">Delete</button>
        </td>
      </tr>
    `).join("");
  }
  render();
  ws.querySelector("#invoiceForm").onsubmit = e => {
    e.preventDefault();
    let f = e.target;
    invoices.push({
      number: f.number.value,
      date: f.date.value,
      customer: f.customer.value,
      amount: f.amount.value
    });
    saveData("invoices", invoices);
    render();
    f.reset();
  };
  window.editInvoice = function(i) {
    let inv = invoices[i];
    let nf = ws.querySelector("#invoiceForm");
    nf.number.value = inv.number;
    nf.date.value = inv.date;
    nf.customer.value = inv.customer;
    nf.amount.value = inv.amount;
    invoices.splice(i, 1);
    render();
    saveData("invoices", invoices);
  };
  window.deleteInvoice = function(i) {
    if (confirm("Delete this invoice?")) {
      invoices.splice(i, 1);
      saveData("invoices", invoices);
      render();
    }
  };
}

// ---- Demo Implementation: Stock > Product List ----
function renderStockProductListPage(ws) {
  ws.innerHTML = `
    <h2>Product List</h2>
    <form id="productForm">
      <label>SKU</label>
      <input name="sku" required>
      <label>Name</label>
      <input name="name" required>
      <label>Qty</label>
      <input name="qty" type="number" min="0" required>
      <label>Cost</label>
      <input name="cost" type="number" step="0.01" required>
      <label>Selling Price</label>
      <input name="price" type="number" step="0.01" required>
      <button type="submit">Add Product</button>
    </form>
    <table class="table-list" id="productTable">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Qty</th>
          <th>Cost</th>
          <th>Sell Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  let products = loadData("products");
  const table = ws.querySelector("#productTable tbody");
  function render() {
    table.innerHTML = products.map((p, i) => `
      <tr>
        <td>${p.sku}</td>
        <td>${p.name}</td>
        <td>${p.qty}</td>
        <td>R ${parseFloat(p.cost).toFixed(2)}</td>
        <td>R ${parseFloat(p.price).toFixed(2)}</td>
        <td>
          <button class="action-btn" onclick="editProduct(${i})">Edit</button>
          <button class="action-btn" onclick="deleteProduct(${i})">Delete</button>
        </td>
      </tr>
    `).join("");
  }
  render();
  ws.querySelector("#productForm").onsubmit = e => {
    e.preventDefault();
    let f = e.target;
    products.push({
      sku: f.sku.value,
      name: f.name.value,
      qty: parseInt(f.qty.value),
      cost: f.cost.value,
      price: f.price.value
    });
    saveData("products", products);
    render();
    f.reset();
  };
  window.editProduct = function(i) {
    let p = products[i];
    let nf = ws.querySelector("#productForm");
    nf.sku.value = p.sku;
    nf.name.value = p.name;
    nf.qty.value = p.qty;
    nf.cost.value = p.cost;
    nf.price.value = p.price;
    products.splice(i, 1);
    saveData("products", products);
    render();
  };
  window.deleteProduct = function(i) {
    if (confirm("Delete this product?")) {
      products.splice(i, 1);
      saveData("products", products);
      render();
    }
  };
}

// ---- You can expand similarly for all other actions (copy Invoice/Product List patterns) ----
// For brevity, only a couple of representative screens are implemented fully here.
// Let me know the next screens you want prioritized and I will generate them for you in full detail.
