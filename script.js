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
function addToTicket(label, price) {
    ticket.push(`${label} – ${price.toFixed(2)}€`);
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

// === Modale générique ===
function openCategoryModal(catId) {
    const data = categoriesData[catId];
    const modal = document.getElementById("modal");
    document.getElementById("modalTitle").textContent = `Choisissez un article (${capitalize(catId)})`;
    const body = document.getElementById("modalBody");
    body.innerHTML = "";

    data.items.forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = `${item.name} – ${item.price.toFixed(2)}€`;
        btn.onclick = () => {
            if (item.options) {
                openOptionsModal(item);
            } else {
                addToTicket(item.name, item.price);
                closeModal();
            }
        };
        body.appendChild(btn);
    });

    modal.classList.remove("hidden");
}

function openOptionsModal(item) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modalBody");
    const title = document.getElementById("modalTitle");

    // ✅ Ferme toute modale ouverte (si nécessaire)
    closeModal(); // optionnel si tu veux forcer le reset

    // ✅ Affiche la modale
    modal.classList.remove("hidden");

    // 🧹 Réinitialise le contenu
    body.innerHTML = "";
    title.textContent = item.name;

    // 🧠 Injecte les options
    item.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => {
            addToTicket(`${item.name} (${opt})`, item.price);
            closeModal();
        };
        body.appendChild(btn);
    });
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function selectOption(item, opt) {
    const label = opt ? `${item.name} (${opt})` : item.name;
    ticket.push(`${label} – ${item.price.toFixed(2)}€`);
    updateTicket();
    closeModal();
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

function updateTotal() {
    const total = ticket
        .map(l => parseFloat(l.match(/([\d.]+)€$/)[1]))
        .reduce((a, b) => a + b, 0);
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
        updateTotal();
    });
});

// Paiement espèce
payInput.addEventListener('input', () => {
    updateTotal();
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    ticketLines.forEach(updateLine);
    updateTotal();
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
                updateTotal();
            }, { once: true });

        } else {
            // on revient à la position initiale
            content.style.transform = '';
        }
    });
});


// ==== Initialisation ====
document.addEventListener("DOMContentLoaded", () => {
    newTicket();
});

// Vide l’état du ticket et revient au menu
function newTicket() {
    ticket.length = 0;
    updateTicket();
    closeModal();
}


// État global
const categoriesData = {
    biere: {
        items: [
            { name: "Pint", price: 5.00 },
            { name: "Demi", price: 3.00 },
            { name: "Pichet", price: 10.00 }
        ],
        options: null
    },
    vins: {
        items: [
            { name: "Rouge", price: 6.00 },
            { name: "Blanc", price: 6.00 },
            { name: "Rosé", price: 6.00 }
        ],
        options: ["Verre", "Bouteille"]
    },
    saucissons: {
        items: [
            { name: "Saucisson", price: 4.50 }
        ],
        options: ["Nature", "Sanglier", "Basilic", "Beaufort", "Herbes", "Piment", "Noisette"]
    },
    sansAlcool: {
        items: [
            { name: "Jus de fruit", price: 3.00 },
            { name: "Soda", price: 2.50 }
        ],
        options: ["Orange", "Pomme", "Cassis", "Citron"]
    },
    confiseries: {
        items: [
            { name: "Bonbons", price: 2.00 },
            { name: "Chocolat", price: 2.50 }
        ],
        options: null
    }
};

// Initialisation des listes d’items
function initCategories() {
    Object.keys(categoriesData).forEach(catId => {
        const container = document.getElementById(catId + "Items");
        categoriesData[catId].items.forEach(item => {
            const btn = document.createElement("button");
            btn.textContent = `${item.name} – ${item.price.toFixed(2)}€`;
            btn.onclick = () => openModal(catId, item);
            container.appendChild(btn);
        });
    });
}

// Affichage / navigation
function showCategory(id) {
    document.getElementById("newTicketBtn").classList.add("hidden");
    document.getElementById("mainMenu").classList.add("hidden");
    document.querySelectorAll(".category").forEach(div => div.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function goBack() {
    document.querySelectorAll(".category").forEach(div => div.classList.add("hidden"));
    document.getElementById("mainMenu").classList.remove("hidden");
    document.getElementById("newTicketBtn").classList.remove("hidden");
}


// ==== UTILS ====
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}