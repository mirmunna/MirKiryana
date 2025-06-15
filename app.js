
let customers = JSON.parse(localStorage.getItem('customers')) || [];

function updateUI() {
  const list = document.getElementById("customerList");
  let give = 0, get = 0;
  list.innerHTML = "";
  customers.forEach((c, i) => {
    const bal = c.entries.reduce((sum, e) => sum + (e.type === 'got' ? e.amount : -e.amount), 0);
    bal > 0 ? get += bal : give += Math.abs(bal);

    list.innerHTML += \`
      <div class="customer">
        <div>
          <strong>\${c.name}</strong><br>
          ₹\${Math.abs(bal)} \${bal >= 0 ? "You'll Get" : "You'll Give"}
        </div>
        <button onclick="openEntry(\${i})">➕</button>
      </div>\`;
  });
  document.getElementById("willGive").innerText = \`₹\${give}\`;
  document.getElementById("willGet").innerText = \`₹\${get}\`;
}

function addCustomerPrompt() {
  const name = prompt("Enter Customer Name");
  if (name) {
    customers.push({ name, entries: [] });
    saveAll();
    updateUI();
  }
}

let currentCustomerIndex = null;

function openEntry(i) {
  currentCustomerIndex = i;
  document.getElementById("entryModal").style.display = "flex";
  document.getElementById("modalTitle").innerText = \`Add Entry for \${customers[i].name}\`;
  document.getElementById("amountInput").value = '';
  document.getElementById("noteInput").value = '';
  document.getElementById("dateInput").value = new Date().toISOString().split('T')[0];
}

function saveEntry(type) {
  const amount = parseFloat(document.getElementById("amountInput").value);
  const note = document.getElementById("noteInput").value;
  const date = document.getElementById("dateInput").value;

  if (!amount || !date) return alert("Fill all fields");
  customers[currentCustomerIndex].entries.push({ type, amount, note, date });
  saveAll();

  const bal = customers[currentCustomerIndex].entries.reduce((sum, e) => sum + (e.type === 'got' ? e.amount : -e.amount), 0);
  const name = customers[currentCustomerIndex].name;
  const message = \`Hi \${name}, you \${type === 'gave' ? 'bought' : 'paid'} ₹\${amount}. Your balance is ₹\${bal}.\`;
  window.open(\`https://wa.me/?text=\${encodeURIComponent(message)}\`, '_blank');

  document.getElementById("entryModal").style.display = "none";
  updateUI();
}

function saveAll() {
  localStorage.setItem('customers', JSON.stringify(customers));
}

updateUI();
