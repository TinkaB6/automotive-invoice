let currentLines = [];
showTab('create');

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
  if(tab === 'history') renderHistory();
}

document.getElementById('invoiceForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = vehicle.value, i = item.value, s = supplier.value, cst = +cost.value||0, ch = +charge.value;
  currentLines.push({v,i,s,cst,ch});
  invoiceForm.reset();
  renderPreview();
  saveInvoiceBtn.disabled = false;
});

function renderPreview(){
  const c = currentLines;
  let html = '', total = 0;
  lines = currentLines.forEach((l, idx)=>{
    total += l.ch;
    html += `<div class="invoice-row">
      <div>${l.v} – ${l.i}</div>
      <div>R${l.ch.toFixed(2)}</div>
      <div><button onclick="removeLine(${idx})">🗑️</button></div>
    </div>`;
  });
  html += `<div class="total">Total: R${total.toFixed(2)}</div>`;
  invoicePreview.innerHTML = html;
}

function removeLine(idx){
  currentLines.splice(idx,1);
  renderPreview();
  saveInvoiceBtn.disabled = currentLines.length === 0;
}

function saveInvoice(){
  const inv = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    lines: currentLines.slice()
  };
  const all = JSON.parse(localStorage.getItem('invoices')||'[]');
  all.push(inv);
  localStorage.setItem('invoices', JSON.stringify(all));
  currentLines = [];
  renderPreview();
  saveInvoiceBtn.disabled = true;
  alert('Invoice Saved! 🎉');
}

function renderHistory(){
  const all = JSON.parse(localStorage.getItem('invoices')||'[]');
  if(all.length === 0) { historyList.innerHTML = '<p>No invoices saved yet.</p>'; return; }
  historyList.innerHTML = all.map(inv => {
    const sum = inv.lines.reduce((a,l)=>a+l.ch,0);
    return `<div class="history-item">
      <button class="nav-btn" onclick="deleteInv(${inv.id})">Delete</button>
      <strong>Invoice #${inv.id}</strong> | ${inv.date} | Total: R${sum.toFixed(2)}
      <button onclick="viewInvoice(${inv.id})">View</button>
    </div>`;
  }).join('');
}

function deleteInv(id){
  let all = JSON.parse(localStorage.getItem('invoices')||'[]');
  all = all.filter(inv => inv.id !== id);
  localStorage.setItem('invoices', JSON.stringify(all));
  renderHistory();
}

function viewInvoice(id){
  const inv = JSON.parse(localStorage.getItem('invoices')||'[]').find(x=>x.id===id);
  if(!inv) return;
  let html = `<h3>Invoice #${inv.id} (${inv.date})</h3>`;
  let tot = 0;
  inv.lines.forEach(l=>{
    tot += l.ch;
    html += `<div class="invoice-row"><div>${l.v}–${l.i}</div><div>R${l.ch.toFixed(2)}</div></div>`;
  });
  html += `<div class="total">Total: R${tot.toFixed(2)}</div>`;
  historyList.innerHTML = html;
}
