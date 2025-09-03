// === Données et état global ===
const ticket = [];
const parfums = ["Nature", "Sanglier", "Basilic", "Beaufort", "Herbes", "Piment", "Noisette"];

let parfumCount = 1;
let formuleMode = false;
let selectedParfums = [];

// === Navigation menu / catégories ===
function showCategory(id) {
    document.getElementById('mainMenu').classList.add('hidden');
    document.querySelectorAll('.category').forEach(div => div.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goBack() {
    document.querySelectorAll('.category').forEach(div => div.classList.add('hidden'));
    document.getElementById('mainMenu').classList.remove('hidden');
}

// === Gestion du ticket ===
function addToTicket(item) {
    ticket.push(item);
    updateTicket();
}

function updateTicket() {
    const list = document.getElementById("ticketList");
    list.innerHTML = "";
    ticket.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

// Optionnel : vider le ticket en un clic
function clearTicket() {
    ticket.length = 0;
    updateTicket();
}

// === Modale de sélection de parfum ===
function openModal(count, isFormule = false) {
    parfumCount = count;
    formuleMode = isFormule;
    selectedParfums = [];

    const modal = document.getElementById("modal");
    const container = document.getElementById("parfumButtons");

    // Message de consigne
    container.innerHTML = `
    <p>Sélectionnez ${count} parfum${count > 1 ? 's' : ''} :</p>
  `;

    // Création des boutons de parfum
    parfums.forEach(p => {
        const btn = document.createElement("button");
        btn.textContent = p;
        btn.onclick = () => selectParfum(p);
        container.appendChild(btn);
    });

    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
    formuleMode = false;
    selectedParfums = [];
}

// Sélection d’un parfum
function selectParfum(parfum) {
    // Mode formule (pichet + saucisson à 2€)
    if (formuleMode) {
        ticket.push("Pichet de bière - 10€");
        ticket.push(`Saucisson (formule) - ${parfum} - 2€`);
        closeModal();
        updateTicket();
        return;
    }

    // Mode classique
    selectedParfums.push(parfum);

    // Dès qu’on a atteint le nombre de parfums voulu
    if (selectedParfums.length >= parfumCount) {
        selectedParfums.forEach((p, i) => {
            ticket.push(`Saucisson choix ${i + 1} - ${p} - 4,50€`);
        });
        closeModal();
        updateTicket();
    }
}


// 1. Sélecteurs
const ticketLines = document.querySelectorAll('.ticket-line');
const totalDisplay = document.getElementById('ticket-total');
const payInput = document.getElementById('payment-amount');
const changeDisplay = document.getElementById('change-amount');


// 2. Fonctions de mise à jour
function updateLine(line) {
    const price = parseFloat(line.dataset.price);
    const qtyInput = line.querySelector('.qty-input');
    let qty = parseInt(qtyInput.value, 10);
    if (qty < 1) qty = 1;
    qtyInput.value = qty;

    const lineTotal = price * qty;
    line.querySelector('.line-total').textContent = lineTotal.toFixed(2) + ' €';
}

function updateTicketTotal() {
    let sum = 0;
    ticketLines.forEach(line => {
        const lineTotalText = line.querySelector('.line-total').textContent;
        sum += parseFloat(lineTotalText);
    });
    totalDisplay.textContent = sum.toFixed(2);
    updateChange(sum);
}

function updateChange(total) {
    const paid = parseFloat(payInput.value) || 0;
    const change = Math.max(0, paid - total);
    changeDisplay.textContent = change.toFixed(2);
}

// 2. Fonctions de mise à jour
function updateLine(line) {
    const price = parseFloat(line.dataset.price);
    const qtyInput = line.querySelector('.qty-input');
    let qty = parseInt(qtyInput.value, 10);
    if (qty < 1) qty = 1;
    qtyInput.value = qty;

    const lineTotal = price * qty;
    line.querySelector('.line-total').textContent = lineTotal.toFixed(2) + ' €';
}

function updateTicketTotal() {
    let sum = 0;
    ticketLines.forEach(line => {
        const lineTotalText = line.querySelector('.line-total').textContent;
        sum += parseFloat(lineTotalText);
    });
    totalDisplay.textContent = sum.toFixed(2);
    updateChange(sum);
}

function updateChange(total) {
    const paid = parseFloat(payInput.value) || 0;
    const change = Math.max(0, paid - total);
    changeDisplay.textContent = change.toFixed(2);
}

// 3. Attacher les événements
ticketLines.forEach(line => {
    // Bouton plus
    line.querySelector('.qty-plus').addEventListener('click', () => {
        const input = line.querySelector('.qty-input');
        input.value = parseInt(input.value, 10) + 1;
        updateLine(line);
        updateTicketTotal();
    });

    // Bouton moins
    line.querySelector('.qty-minus').addEventListener('click', () => {
        const input = line.querySelector('.qty-input');
        input.value = Math.max(1, parseInt(input.value, 10) - 1);
        updateLine(line);
        updateTicketTotal();
    });

    // Saisie directe
    line.querySelector('.qty-input').addEventListener('input', () => {
        updateLine(line);
        updateTicketTotal();
    });
});

// Paiement espèce
payInput.addEventListener('input', () => {
    updateTicketTotal();
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    ticketLines.forEach(updateLine);
    updateTicketTotal();
});
