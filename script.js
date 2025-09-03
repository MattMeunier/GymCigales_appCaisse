// === Données et état global ===
const ticket = [];
let formuleMode = false;
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
            {
                name: "Blanc", price: null, options: [
                    { name: "Verre", price: 2.5 },
                    { name: "Bouteille", price: 6.5 }]
            },
            {
                name: "Rouge", price: null, options: [
                    { name: "Verre", price: 2.5 },
                    { name: "Bouteille", price: 6.5 }]
            },
            {
                name: "Rosé", price: null, options: [
                    { name: "Verre", price: 2.5 },
                    { name: "Bouteille", price: 6.5 }]
            }
        ],
    },
    saucissons: {
        items: [
            { name: "Sauc. nature", price: 4.50 },
            { name: "Sauc. sanglier", price: 4.50 },
            { name: "Sauc. basilic", price: 4.50 },
            { name: "Sauc. Beaufort", price: 4.50 },
            { name: "Sauc. herbes", price: 4.50 },
            { name: "Sauc. piment espelette", price: 4.50 },
            { name: "Sauc. noisette", price: 4.50 }
        ]
    },
    sansAlcool: {
        items: [
            { name: "Jus de fruit", price: 3.00 },
            { name: "Soda", price: 2.50 },
            {
                name: "Sirop", price: 1.5, options: [
                    { name: "Grenadine", price: null },
                    { name: "Citron", price: null },
                    { name: "Menthe", price: null },
                    { name: "Pêche", price: null },]
            }
        ]
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

// === Modale générique ===
function openCategoryModal(catId) {
    const data = categoriesData[catId];
    const modal = document.getElementById("modal");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");

    title.textContent = `Choisissez un article (${capitalize(catId)})`;
    body.innerHTML = "";

    data.items.forEach(item => {
        const btn = document.createElement("button");

        // Affiche le prix si défini
        const label = item.price !== null
            ? `${item.name} – ${item.price.toFixed(2)}€`
            : `${item.name}`;

        btn.textContent = label;
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
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");

    title.textContent = `Options pour ${item.name}`;
    body.innerHTML = "";

    item.options.forEach(opt => {
        const btn = document.createElement("button");

        // Affiche le prix si défini
        const label = opt.price !== undefined
            ? `${opt.label} – ${opt.price.toFixed(2)}€`
            : opt.label;

        btn.textContent = label;
        btn.onclick = () => {
            const finalPrice = opt.price !== undefined ? opt.price : item.price;
            addToTicket(`${item.name} (${opt.label})`, finalPrice);
            closeModal();
        };
        body.appendChild(btn);
    });

    modal.classList.remove("hidden");
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


// === Gestion du ticket ===
function addToTicket(label, price) {
    ticket.push(`${label} – ${price.toFixed(2)}€`);
    updateTicket();
}

function removeLine(index) {
    ticket.splice(index, 1);
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

    // ✅ Réajuste les prix si nécessaire
    adjustSaucissonPrices();

    updateTotal();
}

// Optionnel : vider le ticket en un clic
function clearTicket() {
    ticket.length = 0;
    updateTicket();
}

// gestion qtt saucisson
if (saucissonCount >= 3) {
    ticket.push("💡 Prix réduit appliqué : 4,00 € par saucisson");
}

function adjustSaucissonPrices() {
    let saucissonCount = 0;

    // 1. Compter les saucissons
    ticket.forEach(line => {
        if (line.startsWith("Sauc.")) {
            saucissonCount++;
        }
    });

    // 2. Déterminer le bon prix
    const newPrice = saucissonCount >= 3 ? 4.00 : 4.50;

    // 3. Mettre à jour les lignes
    ticket.forEach((line, index) => {
        if (line.startsWith("Sauc.")) {
            const label = line.split("–")[0].trim(); // "Saucisson (Beaufort)"
            ticket[index] = `${label} – ${newPrice.toFixed(2)}€`;
        }
    });
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




// ==== UTILS ====
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}