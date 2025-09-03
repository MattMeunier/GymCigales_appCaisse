// === Données et état global ===
const ticket = [];
const parfums = ["Nature", "Sanglier", "Basilic", "Beaufort", "Herbes", "Piment", "Noisette"];

let parfumCount = 1;
let formuleMode = false;
let selectedParfums = [];

// === Navigation menu / catégories ===
function showCategory(id) {
    document.getElementById('newTicketBtn').classList.add('hidden');
    document.getElementById('mainMenu').classList.add('hidden');
    document.querySelectorAll('.category').forEach(div => div.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goBack() {
    document.querySelectorAll('.category').forEach(div => div.classList.add('hidden'));
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('newTicketBtn').classList.remove('hidden');
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
    updateTotal();
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
    const total = ticket.reduce((sum, line) => {
        // extrait le nombre et le prix pour faire la somme
        const match = line.match(/([\d.,]+)€$/);
        if (match) return sum + parseFloat(match[1].replace(',', '.'));
        return sum;
    }, 0);
    document.getElementById("ticket-total").textContent = total.toFixed(2);
}

function updateChange(total) {
    const paid = parseFloat(payInput.value) || 0;
    const change = Math.max(0, paid - total);
    changeDisplay.textContent = change.toFixed(2);
}

// 3. Attacher les événements
ticketLines.forEach(line => {
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

const SWIPE_THRESHOLD = 80; // px

ticketLines.forEach(line => {
    let startX = 0;
    let deltaX = 0;

    const content = line.querySelector('.content');

    line.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        line.classList.add('swiping');
    });

    line.addEventListener('touchmove', e => {
        deltaX = e.touches[0].clientX - startX;
        // on ne déplace que vers la gauche
        const translateX = Math.min(0, deltaX);
        content.style.transform = `translateX(${translateX}px)`;
    });

    line.addEventListener('touchend', () => {
        line.classList.remove('swiping');

        if (deltaX < -SWIPE_THRESHOLD) {
            // suppression animée
            line.classList.add('removing');
            content.addEventListener('transitionend', () => {
                line.remove();
                updateTicketTotal();
            }, { once: true });

        } else {
            // on revient à la position initiale
            content.style.transform = '';
        }
    });
});


// ==== Initialisation ====
document.addEventListener('DOMContentLoaded', () => {
    // Au chargement : ticket vide, menu visible, bouton Nouveau ticket caché
    newTicket();
});
