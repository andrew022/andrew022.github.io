window.onload = function () {
    storedWebData();
    spendingLimitBar();
};

let totalIncome = 0;
let totalSpending = 0;
let entries = []; 
const maxSpending = 2000;

function storedWebData() {
    const storedIncome = localStorage.getItem('totalIncome');
    const storedExpenses = localStorage.getItem('totalSpending');
    const storedEntries = localStorage.getItem('entries'); 
    const lastUpdated = localStorage.getItem('lastUpdated');

    if (storedIncome !== null) {
        totalIncome = parseFloat(storedIncome);
        document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    }

    if (storedExpenses !== null) {
        totalSpending = parseFloat(storedExpenses);
        document.getElementById('totalSpending').innerText = totalSpending.toFixed(2);
    }

    if (storedEntries !== null) {
        entries = JSON.parse(storedEntries); 
        updateEntriesList(); 
    }

    if (lastUpdated) {
        const now = new Date();
        const lastDate = new Date(lastUpdated);

        if (now.getFullYear() !== lastDate.getFullYear() || now.getMonth() !== lastDate.getMonth()) {
            resetInputs();
        } else {
            saveMoney();
        }
    }
}

let ignoreLimits = {
    videoGames: false,
    gifts: false,
    misc: false,
};

function addSpending() {
    const amount = parseFloat(document.getElementById('spendAmount').value);
    const category = document.getElementById('billSelect').value;

    if (!isNaN(amount) && category) {
        
        const currentSpending = entries
            .filter(entry => entry.type === 'spending' && entry.category === category)
            .reduce((sum, entry) => sum + entry.amount, 0);

        if ((category === 'Video Games' && currentSpending + amount > 80) ||
            (category === 'Gifts' && currentSpending + amount > 100) ||
            (category === 'Misc' && currentSpending + amount > 100)) {
            if (!ignoreLimits[category.toLowerCase()]) {
                if (confirm(`Spending on ${category} cannot exceed the limit. Do you want to ignore this limit once?`)) {
                    ignoreLimits[category.toLowerCase()] = true;
                } else {
                    return;
                }
            }
        }

        totalSpending += amount;
        entries.push({ amount: amount, category: category, type: 'spending' }); 
        document.getElementById('totalSpending').innerText = totalSpending.toFixed(2);
        saveMoney();
        saveData();
        updateEntriesList(); 
        spendingLimitBar(); 
    } else {
        alert("Please enter a valid amount and select a category.");
    }

    document.getElementById('spendAmount').value = '';
    document.getElementById('billSelect').value = ''; 
}

function addIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeSelect').value;
    if (!isNaN(amount) && category) {
        totalIncome += amount;
        entries.push({ amount: amount, category: category, type: 'income' });
        document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
        saveMoney();
        saveData();
        updateEntriesList();
        spendingLimitBar();
    } else {
        alert("Please enter a valid income amount and select a category.");
    }

    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeSelect').value = ''; 
}

function resetInputs() {
    totalIncome = 0;
    totalSpending = 0;
    entries = [];

    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('totalSpending').innerText = totalSpending.toFixed(2);
    document.getElementById('savings').innerText = '0.00'; 
    document.getElementById('houseSavings').innerText = '0.00'; 
    document.getElementById('carSavings').innerText = '0.00'; 
    document.getElementById('gunSavings').innerText = '0.00'; 
    document.getElementById('spendingEntriesList').innerHTML = ''; 
    document.getElementById('progressBar').style.width = '0%'; 

    localStorage.clear();
}

function saveMoney() {
    const savings = totalIncome - totalSpending;
    document.getElementById('savings').innerText = savings.toFixed(2);
    
    document.getElementById('houseSavings').innerText = (savings * 0.6).toFixed(2);
    document.getElementById('carSavings').innerText = (savings * 0.2).toFixed(2);
    document.getElementById('gunSavings').innerText = (savings * 0.2).toFixed(2);
}

function saveData() {
    localStorage.setItem('totalIncome', totalIncome);
    localStorage.setItem('totalSpending', totalSpending);
    localStorage.setItem('entries', JSON.stringify(entries)); 
    localStorage.setItem('lastUpdated', new Date());
}

function updateEntriesList() {
    const spendingEntriesList = document.getElementById('spendingEntriesList');
    spendingEntriesList.innerHTML = '';

    entries.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} - ${entry.category}: $${entry.amount.toFixed(2)}`;
        
       
        if (entry.type === 'spending') {
            listItem.style.color = 'red'; 
        } else if (entry.type === 'income') {
            listItem.style.color = 'green'; 
        }

        spendingEntriesList.appendChild(listItem);
    });
}

function spendingLimitBar() {
    const progress = Math.min((totalSpending / maxSpending) * 100, 100);
    document.getElementById('progressBar').style.width = `${progress}%`;

    
    const progressBar = document.getElementById('progressBar');
    if (progress < 50) {
        progressBar.style.backgroundColor = 'green';
    } else if (progress < 75) {
        progressBar.style.backgroundColor = 'yellow'; 
    } else {
        progressBar.style.backgroundColor = 'red';
        alert("Warning: You are close or over your spending limit!");
    }
}
