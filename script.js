const repairs = [];

document.getElementById('repairForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const vehicle = document.getElementById('vehicle').value;
  const item = document.getElementById('item').value;
  const supplier = document.getElementById('supplier').value;
  const cost = parseFloat(document.getElementById('cost').value);
  const charge = parseFloat(document.getElementById('charge').value);

  repairs.push({ vehicle, item, supplier, cost, charge });

  updateInvoice();
  this.reset();
});

function updateInvoice() {
  const invoiceDisplay = document.getElementById('invoiceDisplay');
  const grouped = {};

  repairs.forEach(({ vehicle, item, charge }) => {
    if (!grouped[vehicle]) grouped[vehicle] = [];
    grouped[vehicle].push({ item, charge });
  });

  invoiceDisplay.innerHTML = Object.entries(grouped).map(([vehicle, items]) => {
    const itemsHTML = items.map(i => `<li>${i.item}: R${i.charge.toFixed(2)}</li>`).join('');
    const total = items.reduce((sum, i) => sum + i.charge, 0);
    return `<h3>${vehicle}</h3><ul>${itemsHTML}</ul><strong>Total: R${total.toFixed(2)}</strong>`;
  }).join('<hr>');
}

function exportInvoice() {
  const invoice = document.getElementById('invoiceDisplay').innerHTML;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`<html><head><title>Invoice</title></head><body>${invoice}</body></html>`);
  win.document.close();
  win.print();
}
