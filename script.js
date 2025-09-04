
// Nettoyage des cookies
document.cookie.split(";").forEach(cookie => {
    document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Nettoyage du stockage local
localStorage.clear();
sessionStorage.clear();

// Evite le chargement en cache
const script = document.createElement("script");
script.src = "/script.js?v=" + Date.now(); // empêche le cache
document.head.appendChild(script);


// === Données et état global ===
const ticket = [];
let formuleMode = false;


// Sélecteurs
const ticketLines = document.querySelectorAll('.ticket-line');
const totalDisplay = document.getElementById('ticket-total');
const payInput = document.getElementById('payment-amount');
const changeDisplay = document.getElementById('change-amount');


// État global
const categoriesData = {
    biere: {
        items: [
            { logo: "", category: "🍺 Bière", name: "Verre", price: 3.00 },
            { logo: "", category: "🍻🍻 Bière", name: "Pichet", price: 10.00 },
            {
                logo: "", category: "🍻🍖 Bière", name: "Pichet + Saucisson", price: 12.00, options: [
                    { logo: "", category: "Pichet + Saucisson", name: "Nature", price: null },
                    { logo: "", category: "Pichet + Saucisson", name: "Sanglier", price: null },
                    { logo: "", category: "Pichet + Saucisson", name: "Basilic", price: null },
                    { logo: "", category: "Pichet + Saucisson", name: "Beaufort", price: null },
                    { logo: "", category: "Pichet + Saucisson", name: "Herbes", price: null },
                    { logo: "", category: "Pichet + Saucisson", name: "Piment espelette", price: null },
                    { logo: "", category: "Pichet + Saucisson", name: "Noisette", price: null }
                ]
            },
            { logo: "🍺", category: "", name: "Panaché", price: 3.00 },
            { logo: "🍺", category: "", name: "Demi-Pêche", price: 3.00 },
            { logo: "🍺", category: "", name: "Monaco", price: 3.00 }
        ],
        options: null
    },
    vins: {
        items: [
            {
                logo: "", category: "Vin", name: "Blanc", price: null, options: [
                    { logo: "🍷", category: "Vin blanc", name: "Verre", price: 2.5 },
                    { logo: "🍾", category: "Vin blanc", name: "Bouteille", price: 6.5 }]
            },
            {
                logo: "", category: "Vin", name: "Rouge", price: null, options: [
                    { logo: "🍷", category: "Vin rouge", name: "Verre", price: 2.5 },
                    { logo: "🍾", category: "Vin rouge", name: "Bouteille", price: 6.5 }]
            },
            {
                logo: "", category: "Vin", name: "Rosé", price: null, options: [
                    { logo: "🍷", category: "Vin rosé", name: "Verre", price: 2.5 },
                    { logo: "🍾", category: "Vin rosé", name: "Bouteille", price: 6.5 }]
            }
        ],
    },
    saucissons: {
        items: [
            { logo: "🍖", category: "Saucisson", name: "Nature", price: 4.50 },
            { logo: "🍖", category: "Saucisson", name: "Sanglier", price: 4.50 },
            { logo: "🍖", category: "Saucisson", name: "Basilic", price: 4.50 },
            { logo: "🍖", category: "Saucisson", name: "Beaufort", price: 4.50 },
            { logo: "🍖", category: "Saucisson", name: "Herbes", price: 4.50 },
            { logo: "🍖", category: "Saucisson", name: "Piment espelette", price: 4.50 },
            { logo: "🍖", category: "Saucisson", name: "Noisette", price: 4.50 }
        ]
    },
    softs: {
        items: [
            { logo: "", category: "", name: "☕ Café", price: 1.00 },
            { logo: "", category: "", name: "🍵 Thé", price: 1.00 },
            { logo: "", category: "", name: "🍹 Jus de fruit", price: 2.00 },
            {
                logo: "", category: "", name: "🥤 Soda", price: 2.50, options: [
                    { logo: "", category: "", name: "Coca Cola", price: null },
                    { logo: "", category: "", name: "Fanta", price: null },
                    { logo: "", category: "", name: "Thé glacé", price: null }]
            },
            {
                logo: "", category: "", name: "🍸 Sirop", price: 1.5, options: [
                    { logo: "", category: "", name: "Grenadine", price: null },
                    { logo: "", category: "", name: "Citron", price: null },
                    { logo: "", category: "", name: "Menthe", price: null },
                    { logo: "", category: "", name: "Pêche", price: null }]
            },
            {
                logo: "", category: "", name: "🧉 Diabolo", price: 2, options: [
                    { logo: "", category: "", name: "Grenadine", price: null },
                    { logo: "", category: "", name: "Citron", price: null },
                    { logo: "", category: "", name: "Menthe", price: null },
                    { logo: "", category: "", name: "Pêche", price: null }]
            }
        ]
    },
    confiseries: {
        items: [
            { logo: "", category: "", name: "🍬 Bonbons", price: 1.00 },
            {
                logo: "", category: "", name: "🥞 Crêpes", price: null, options: [
                    { logo: "", category: "Crêpe", name: "Nature", price: 1.00 },
                    { logo: "", category: "Crêpe", name: "Sucre", price: 1.50 },
                    { logo: "", category: "Crêpe", name: "Chocolat", price: 2 }]
            }
        ],
        options: null
    }
};


init(); // Appel direct

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
            ? `${item.category} ${item.name} – ${item.price}€`
            : `${item.category} ${item.name}`;

        btn.textContent = label;
        btn.onclick = () => {
            if (item.options) {
                openOptionsModal(item);
            } else {
                addToTicket(`${item.logo} ${item.category} ${item.name}`, item.price);
                closeModal();
            }
        };
        btn.classList.add("big-button");
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
        const label = opt.price !== null
            ? `${opt.name} – ${opt.price.toFixed(2)}€`
            : `${opt.name} – ${item.price.toFixed(2)}€`;

        btn.textContent = label;
        btn.onclick = () => {
            const finalPrice = opt.price !== null ? opt.price : item.price;
            addToTicket(`${opt.logo} ${item.category} ${item.name} (${opt.name})`, finalPrice);
            closeModal();
        };
        btn.classList.add("big-button");
        body.appendChild(btn);
    });

    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// function selectOption(item, opt) {
//     const label = opt ? `${item.name} (${opt})` : item.name;
//     ticket.push(`${label} – ${item.price.toFixed(2)}€`);
//     updateTicket();
//     closeModal();
// }


// === Gestion du ticket ===
function addToTicket(label, price) {
    // Cherche si l'item existe déjà dans le ticket
    const existingItem = ticket.find(item => item[0] === label);

    if (existingItem) {
        // Incrémente la quantité
        existingItem[1] += 1;
    } else {
        ticket.push([label, 1, price.toFixed(2)]);
    }
    // ✅ Réajuste les prix des saucissons si nécessaire
    adjustSaucissonPrices();
    updateTicket();
}

function removeLine(index) {
    if (confirm("Supprimer cette ligne ?")) {
        ticket.splice(index, 1);
        // ✅ Réajuste les prix si nécessaire
        adjustSaucissonPrices();
        updateTicket();
    }
}

function updateTicket() {
    // const list = document.getElementById("ticketList");
    // list.innerHTML = "";
    // ticket.forEach(item => {
    //     const li = document.createElement("li");
    //     li.textContent = item;
    //     li.onclick = () => removeLine(index);
    //     list.appendChild(li);
    // });
    // updateTotal();

    const ticketBody = document.getElementById("ticket-body");
    ticketBody.innerHTML = "";

    ticket.forEach((item, index) => {
        const row = document.createElement("tr");
        row.dataset.index = index;

        // Libellé
        const libelleCell = document.createElement("td");
        libelleCell.textContent = item[0];
        row.appendChild(libelleCell);

        // Quantité modifiable
        const quantiteCell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.max = "99";
        input.value = item[1];
        input.classList.add("qty-input");
        input.addEventListener("input", (e) => {
            const newQty = parseInt(e.target.value);
            if (newQty > 0) {
                item[1] = newQty;
                adjustSaucissonPrices(); // gestion promo
                updateTicket();
            }
        });
        quantiteCell.appendChild(input);
        row.appendChild(quantiteCell);

        // Prix
        const prixCell = document.createElement("td");
        prixCell.classList.add("price-cell");
        prixCell.textContent = (item[2] * item[1]).toFixed(2) + " €";
        row.appendChild(prixCell);

        // Supprimer
        const deleteCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.classList.add("btn-supprimer");
        deleteBtn.addEventListener("click", () => {
            ticket.splice(index, 1);
            adjustSaucissonPrices();
            updateTicket();
        });
        deleteCell.appendChild(deleteBtn);
        row.appendChild(deleteCell);

        ticketBody.appendChild(row);
    });
    updateTotal();
    updateChange();
}

// Optionnel : vider le ticket en un clic
function clearTicket() {
    ticket.length = 0;
    updateTicket();
}


function adjustSaucissonPrices() {
    const totalSaucissons = ticket
        .filter(item => item[0].toLowerCase().startsWith("saucisson"))
        .reduce((sum, item) => sum + item[1], 0);

    ticket.forEach(item => {
        if (item[0].toLowerCase().startsWith("saucisson")) {
            item[2] = totalSaucissons >= 3 ? 4.00 : 4.50;
        }
    });
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

function updateChange() {
    const total = ticket.reduce((sum, item) => sum + item[2] * item[1], 0);
    const paidInput = document.getElementById("cash-amount");
    const changeDisplay = document.getElementById("change-amount");

    const paid = parseFloat(paidInput.value) || 0;
    const change = Math.max(0, paid - total);

    changeDisplay.textContent = change.toFixed(2) + " €";
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
    let total = 0;
    ticket.forEach(item => {
        total += item[2] * item[1];
    });

    document.getElementById("ticket-total").textContent = total.toFixed(2) + " €";
}

// select la quantité quand focus
document.addEventListener('focusin', event => {
    if (event.target.classList.contains('qty-input')) {
        event.target.select();
    }
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    const paidInput = document.getElementById("cash-amount");
    if (paidInput) {
        paidInput.addEventListener("input", updateChange);
    }

    newTicket(); // initialise le ticket au démarrage
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

function init() {
    const paidInput = document.getElementById("cash-amount");
    if (paidInput) {
        paidInput.addEventListener("input", updateChange);
    }

    newTicket();
}


// Vide l’état du ticket et revient au menu
function newTicket() {
    ticket.length = 0;
    document.getElementById("cash-amount").value = "";
    document.getElementById("change-amount").textContent = "0.00 €";
    updateTicket();
    closeModal();
}


// ==== UTILS ====
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}