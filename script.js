<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Business Dashboard</title>
  <style>
    .hidden { display: none; }
    .tabs button {
      padding: 10px;
      margin: 5px;
      cursor: pointer;
    }
    .tab {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #aaa;
    }
  </style>
</head>
<body>

  <div class="tabs">
    <button onclick="showTab('create')">Create Invoice</button>
    <button onclick="showTab('suppliers')">Suppliers</button>
    <button onclick="showTab('debtors')">Debtors</button>
    <button onclick="showTab('creditors')">Creditors</button>
    <button onclick="showTab('stock')">Stock</button>
    <button onclick="showTab('pos')">POS</button>
    <button onclick="showTab('petty')">Petty Cash</button>
    <button onclick="showTab('reports')">Reports</button>
  </div>

  <!-- CREATE INVOICE -->
  <div id="create" class="tab">
    <form id="invoiceForm">
      <input id="companyName" placeholder="Company Name" required><br>
      <input id="invoiceNumber" placeholder="Invoice #" required><br>
      <input id="clientName" placeholder="Client Name" required><br>
      <input id="invoiceAmount" type="number" placeholder="Amount" required><br>
      <button type="submit">Add Invoice</button>
    </form>
    <div id="invoiceList"></div>
  </div>

  <!-- SUPPLIERS -->
  <div id="suppliers" class="tab hidden">
    <form id="supplierForm">
      <input id="sName" placeholder="Supplier Name" required><br>
      <input id="sContact" placeholder="Contact" required><br>
      <input id="sItems" placeholder="Items" required><br>
      <button type="submit">Add Supplier</button>
    </form>
    <div id="supplierList"></div>
  </div>

  <!-- DEBTORS -->
  <div id="debtors" class="tab hidden">
    <form id="debtorForm">
      <input id="dClient" placeholder="Client Name" required><br>
      <input id="dVehicle" placeholder="Vehicle" required><br>
      <input id="dAmount" type="number" placeholder="Amount" required><br>
      <button type="submit">Add Debtor</button>
    </form>
    <div id="debtorList"></div>
  </div>

  <!-- CREDITORS -->
  <div id="creditors" class="tab hidden">
    <form id="creditorForm">
      <input id="cTo" placeholder="Creditor To" required><br>
      <input id="cReason" placeholder="Reason" required><br>
      <input id="cAmount" type="number" placeholder="Amount" required><br>
      <button type="submit">Add Creditor</button>
    </form>
    <div id="creditorList"></div>
  </div>

  <!-- STOCK -->
  <div id="stock" class="tab hidden">
    <form id="stockForm">
      <input id="stockName" placeholder="Item Name" required><br>
      <input id="stockQty" type="number" placeholder="Quantity" required><br>
      <input id="stockCost" type="number" placeholder="Cost Price" required><br>
      <input id="stockSell" type="number" placeholder="Selling Price" required><br>
      <button type="submit">Add/Update Stock</button>
    </form>
    <div id="stockList"></div>
  </div>

  <!-- POS -->
  <div id="pos" class="tab hidden">
    <h3>Point of Sale</h3>
    <div id="posItems"></div>
    <div>Total: R<span id="posTotal">0.00</span></div>
    <button onclick="completeSale()">Complete Sale</button>
  </div>

  <!-- PETTY CASH -->
  <div id="petty" class="tab hidden">
    <form id="pettyForm">
      <input id="pettyDesc" placeholder="Description" required><br>
      <input id="pettyAmount" type="number" placeholder="Amount" required><br>
      <button type="submit">Add Entry</button>
    </form>
    <div>Balance: R<span id="pettyBalance">0.00</span></div>
    <div id="pettyList"></div>
  </div>

  <!-- REPORTS -->
  <div id="reports" class="tab hidden">
    <h3>Daily Sales Report</h3>
    <div id="reportList"></div>
  </div>

  <!-- SCRIPTS -->
  <script>
    // your entire JavaScript goes here (the one you pasted earlier)
  </script>
</body>
</html>
