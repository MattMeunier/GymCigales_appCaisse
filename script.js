let ticket = {};

function addItem(name, price) {
    if (ticket[name]) {
        ticket[name].quantity += 1;
    } else {
        ticket[name] = { price: price, quantity: 1 };
    }
    updateTicket();
}

function updateTicket() {
    const table = document.getElementById('ticketTable');
    table.innerHTML = '';
    let total = 0;

    for (const [name, data] of Object.entries(ticket)) {
        const totalLine = data.price * data.quantity;
        total += totalLine;

        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${name}</td>
      <td>${data.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${data.quantity}" onchange="updateQuantity('${name}', this.value)">
      </td>
      <td>${totalLine.toFixed(2)}</td>
      <td><button onclick="removeItem('${name}')">❌ Retirer</button></td>
    `;
        table.appendChild(row);
    }

    document.getElementById('total').textContent = total.toFixed(2);
    calculateChange();
}

function updateQuantity(name, value) {
    const qty = parseInt(value);
    if (qty > 0) {
        ticket[name].quantity = qty;
        updateTicket();
    }
}

function removeItem(name) {
    delete ticket[name];
    updateTicket();
}

function calculateChange() {
    const cash = parseFloat(document.getElementById('cash').value);
    const total = parseFloat(document.getElementById('total').textContent);
    const change = cash - total;
    document.getElementById('change').textContent = change >= 0 ? change.toFixed(2) : '0.00';
}

function resetTicket() {
    ticket = {};
    document.getElementById('ticketTable').innerHTML = '';
    document.getElementById('total').textContent = '0.00';
    document.getElementById('cash').value = '';
    document.getElementById('change').textContent = '0.00';
}

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('✅ Service Worker enregistré', reg))
            .catch(err => console.error('❌ Échec de l’enregistrement du Service Worker', err));
    });
}
