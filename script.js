// 初始化資料
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM 元素
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transactionList');
const totalIncomeElement = document.getElementById('totalIncome');
const totalExpenseElement = document.getElementById('totalExpense');
const balanceElement = document.getElementById('balance');
const transactionChart = document.getElementById('transactionChart');

// 圖表初始化
let chart;
function initializeChart() {
    const ctx = transactionChart.getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['收入', '支出'],
            datasets: [{
                label: '金額統計',
                data: [0, 0],
                backgroundColor: ['#198754', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 更新圖表
function updateChart() {
    const totalIncome = transactions.reduce((sum, transaction) => 
        transaction.type === 'income' ? sum + transaction.amount : sum, 0);
    const totalExpense = transactions.reduce((sum, transaction) => 
        transaction.type === 'expense' ? sum + transaction.amount : sum, 0);

    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update();
}

// 更新統計數據
function updateStatistics() {
    const totalIncome = transactions.reduce((sum, transaction) => 
        transaction.type === 'income' ? sum + transaction.amount : sum, 0);
    const totalExpense = transactions.reduce((sum, transaction) => 
        transaction.type === 'expense' ? sum + transaction.amount : sum, 0);
    const balance = totalIncome - totalExpense;

    totalIncomeElement.textContent = `NT$ ${totalIncome}`;
    totalExpenseElement.textContent = `NT$ ${totalExpense}`;
    balanceElement.textContent = `NT$ ${balance}`;
}

// 顯示交易記錄
function displayTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.type === 'income' ? '收入' : '支出'}</td>
            <td class="${transaction.type}-amount">NT$ ${transaction.amount}</td>
            <td>
                <span class="delete-btn" onclick="deleteTransaction(${index})">🗑️</span>
            </td>
        `;
        transactionList.appendChild(row);
    });
}

// 新增交易
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        date: new Date().toLocaleDateString('zh-TW'),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // 更新顯示
    displayTransactions();
    updateStatistics();
    updateChart();

    // 清空表單
    transactionForm.reset();
}

// 刪除交易
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // 更新顯示
    displayTransactions();
    updateStatistics();
    updateChart();
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    displayTransactions();
    updateStatistics();
    updateChart();
});

// 事件監聽
transactionForm.addEventListener('submit', addTransaction);