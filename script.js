// Grab DOM elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Step 1: Read previous records from Local Storage, or default to empty array
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Step 2: Handle incoming form submissions 
function addTransaction(e) {
    e.preventDefault();

    // Create custom transaction object
    const transaction = {
        id: generateID(),
        text: text.value,
        amount: parseFloat(amount.value) // Convert string values into proper numbers
    };

    // Push new item to global array state, then update UI updates
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Reset input fields
    text.value = '';
    amount.value = '';
}

// Generate random numeric IDs for item identity reference
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Step 3: Inject transactions dynamically into the DOM layout
function addTransactionDOM(transaction) {
    // Determine sign state flag properties
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Apply color indicator hooks based on values
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Step 4: Recalculate balances, total income, and total expenses
function updateValues() {
    const amounts = transactions.map(t => t.amount);

    // Sum total overall balance
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // Filter, compile, and sum all positive cash inflow integers
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // Filter, compile, and sum all negative expense values
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    // Refresh display readings
    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

// Step 5: Remove entry by target item id property
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init(); // Rerun setup initialization to clean view states
}

// Synchronize global arrays with system storage string tokens
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialization routine loop
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Run application setup rules
init();
form.addEventListener('submit', addTransaction);