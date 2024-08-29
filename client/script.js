async function fetchTickerData() {

    const response = await fetch('http://localhost:5000/api/tickers');
    const tickers = await response.json();
    let currentSortColumn = '';
let currentSortOrder = 'asc';

function sortTable(column) {
    const tableBody = document.querySelector('#ticker-table tbody');
    let rows = Array.from(tableBody.rows);

    if (currentSortColumn === column) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortOrder = 'asc';
    }

    rows.sort((a, b) => {
        const aData = a.querySelector(`[data-column="${column}"]`).textContent;
        const bData = b.querySelector(`[data-column="${column}"]`).textContent;

        if (column === 'name') {
            return currentSortOrder === 'asc' ? aData.localeCompare(bData) : bData.localeCompare(aData);
        } else {
            const aNumber = parseFloat(aData.replace(/[^\d.-]/g, ''));
            const bNumber = parseFloat(bData.replace(/[^\d.-]/g, ''));
            return currentSortOrder === 'asc' ? aNumber - bNumber : bNumber - aNumber;
        }
    });

    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));

    currentSortColumn = column;
}

    
    console.log(tickers);
    
    const bestPriceElement = document.getElementById('best-price');
    const tableBody = document.querySelector('#ticker-table tbody');

    let bestPrice = 0;

    tickers.forEach((ticker, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td  data-column="index">${index + 1}</td>
            <td data-column="name">${ticker.name}</td>
            <td data-column="last">₹${ticker.last.toLocaleString('en-IN')}</td>
            <td data-column="buy">₹${ticker.buy.toLocaleString('en-IN')} / ₹${ticker.sell.toLocaleString('en-IN')}</td>
            <td data-column="difference">${calculateDifference(ticker.buy, ticker.sell)}%</td>
            <td data-column="savings">₹${calculateSavings(ticker.buy, ticker.sell).toLocaleString('en-IN')}</td>
        `;
        tableBody.appendChild(row);

        if (ticker.buy < bestPrice || bestPrice === 0) {
            bestPrice = ticker.buy;
        }
    });

    bestPriceElement.textContent = `₹${bestPrice.toLocaleString('en-IN')}`;
}

function calculateDifference(buy, sell) {
    return (((sell - buy) / buy) * 100).toFixed(2);
}

function calculateSavings(buy, sell) {
    return Math.abs(sell - buy);
}

fetchTickerData();

const themeToggleButton = document.getElementById('theme-toggle');

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

function filterTable() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#ticker-table tbody tr');

    rows.forEach(row => {
        const platform = row.querySelector('[data-column="name"]').textContent.toLowerCase();
        row.style.display = platform.includes(input) ? '' : 'none';
    });
}


// async function fetchTickerData() {
//     try {
//         const response = await fetch('http://localhost:5000/api/tickers');
//         const data = await response.json();
//         console.log(data);  // Check if data is fetched
//         updateUI(data);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }


// function updateUI(data) {
//     const tableBody = document.querySelector('tbody');
//     tableBody.innerHTML = '';  // Clear previous content
//     data.forEach((ticker, index) => {
//         const row = `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${ticker.platform}</td>
//                 <td>${ticker.last_traded_price}</td>
//                 <td>${ticker.buy_price} / ${ticker.sell_price}</td>
//                 <td>${ticker.difference}</td>
//                 <td>${ticker.savings}</td>
//             </tr>
//         `;
//         tableBody.insertAdjacentHTML('beforeend', row);
//     });


