// Soo qaadashada walxaha HTML-ka
const itemInput = document.getElementById('item');
const priceInput = document.getElementById('price');
const listContainer = document.getElementById('list');
const expDisplay = document.getElementById('exp');
const balDisplay = document.getElementById('bal');

// Xogta bilowga ah (Haddii LocalStorage wax ku jiraan soo qaado)
let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
let income = 2000;

// Shaqada marka bogga la furo (Initial Render)
window.onload = () => {
    renderUI();
};

// Shaqada lagu darayo kharash cusub
function add() {
    const name = itemInput.value;
    const amount = parseFloat(priceInput.value);

    if (name.trim() === "" || isNaN(amount) || amount <= 0) {
        showStatus("Fadlan geli xog sax ah!", "error");
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        price: amount,
        date: new Date().toLocaleDateString()
    };

    expenses.push(expense);
    saveAndSync();
    
    // Nadiifi meelaha wax laga qoro
    itemInput.value = "";
    priceInput.value = "";
    showStatus("Waa lagu daray!", "success");
}

// Shaqada tirtirista (Delete)
function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveAndSync();
}

// Shaqada xogta lagu kaydinayo LocalStorage laguna cusboonaysiinayo UI-ga
function saveAndSync() {
    localStorage.setItem('myExpenses', JSON.stringify(expenses));
    renderUI();
}

// Shaqada soo bandhigista xogta (Render)
function renderUI() {
    listContainer.innerHTML = "";
    let totalSpent = 0;

    expenses.forEach(e => {
        totalSpent += e.price;
        const li = document.createElement('li');
        li.className = "animate";
        li.innerHTML = `
            <div class="card" style="padding: 15px; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid var(--neon);">
                <div>
                    <strong style="display:block;">${e.name}</strong>
                    <small style="color: #666;">${e.date}</small>
                </div>
                <div>
                    <span style="color: #ff4d4d; font-weight:bold; margin-right: 15px;">-$${e.price.toFixed(2)}</span>
                    <button onclick="deleteExpense(${e.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:18px;">&times;</button>
                </div>
            </div>
        `;
        listContainer.appendChild(li);
    });

    // Cusboonaysii Dashboard-ka
    expDisplay.innerText = `$${totalSpent.toFixed(2)}`;
    const currentBalance = income - totalSpent;
    balDisplay.innerText = `$${currentBalance.toFixed(2)}`;

    // Haddii lacagtu dhamaato casaan ka dhig balance-ka
    balDisplay.style.color = currentBalance < 0 ? "#ff4d4d" : "var(--neon)";
}

// Fariin yar oo ku tuseysa in wax lagu daray (Toast Notification)
function showStatus(msg, type) {
    const statusDiv = document.createElement('div');
    statusDiv.innerText = msg;
    statusDiv.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; padding: 10px 20px;
        background: ${type === 'success' ? 'var(--neon)' : '#ff4d4d'};
        color: black; border-radius: 5px; font-weight: bold; z-index: 2000;
        animation: nuxNux 0.5s ease;
    `;
    document.body.appendChild(statusDiv);
    setTimeout(() => statusDiv.remove(), 3000);
}