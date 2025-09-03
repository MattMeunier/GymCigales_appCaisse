const ticket = [];
const parfums = ["Nature", "Sanglier", "Basilic", "Beaufort", "Herbes", "Piment", "Noisette"];
let parfumCount = 1;
let formuleMode = false;

function showCategory(id) {
    document.getElementById('mainMenu').classList.add('hidden');
    document.querySelectorAll('.category').forEach(div => div.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goBack() {
    document.querySelectorAll('.category').forEach(div => div.classList.add('hidden'));
    document.getElementById('mainMenu').classList.remove('hidden');
}

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

function openModal(count, isFormule = false) {
    parfumCount = count;
    formuleMode = isFormule;
    document.getElementById("modal").classList.remove("hidden");
    const container = document.getElementById("parfumButtons");
    container.innerHTML = "";
    parfums.forEach(p => {
        const btn = document.createElement("button");
        btn.textContent = p;
        btn.onclick = () => selectParfum(p);
        container.appendChild(btn);
    });
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
    formuleMode = false;
}

function selectParfum(parfum) {
    if (formuleMode) {
        ticket.push("Pichet de bière - 10€");
        ticket.push(`Saucisson (formule) - ${parfum} - 2€`);
        closeModal();
        updateTicket();
        return;
    }

    ticket.push(`