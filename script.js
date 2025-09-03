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
            ticket.push(`Saucisson ${i + 1} - ${p} - 4,50€`);
        });
        closeModal();
        updateTicket();
    }
}
