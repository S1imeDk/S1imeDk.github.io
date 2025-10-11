
const SUPABASE_URL = 'https://kyifgtvmfqpsdvxpacid.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5aWZndHZtZnFwc2R2eHBhY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzA4MTQsImV4cCI6MjA3NTcwNjgxNH0.EVGkBDeS0WpDUNvbZYIrErElXAyd7b7wz8OS0U3Mc5k';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

const casesData = [
    { id: 1, name: 'Золото', price: 1999, image: '1000094339.jpg' },
    { id: 2, name: 'Темно', price: 4999, image: 'case2.jpg' },
    { id: 3, name: 'Пальма', price: 13999, image: 'case3.jpg' },
    { id: 4, name: 'Бурж', price: 37999, image: 'case4.jpg' }
];

const bagsData = [
    { id: 1, name: 'Замороженное сердце', price: 4500 },
    { id: 2, name: 'Резинка с пузыриками', price: 12000 },
    { id: 3, name: 'Кошки', price: 40000 },
    { id: 4, name: 'Dream', price: 250000 }
];

async function initApp() {
    await checkAuth();
    renderCases();
    renderSpecialBags();
    loadRecentPrizes();
}

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        await loadUserProfile();
        document.getElementById('app').classList.remove('hidden');
    } else {
        createTestUser();
    }
}

function createTestUser() {
    currentUser = { id: 'test-user', email: 'test@example.com' };
    document.getElementById('username').textContent = 'Игрок_NFT';
    document.getElementById('balance').textContent = '5000';
    document.getElementById('user-avatar').src = 'https://via.placeholder.com/80/00d4ff/ffffff?text=NFT';
}

async function loadUserProfile() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

    if (profile) {
        document.getElementById('username').textContent = profile.username || 'Игрок';
        document.getElementById('balance').textContent = profile.balance || 0;
        if (profile.avatar_url) {
            document.getElementById('user-avatar').src = profile.avatar_url;
        }
    }
}

function renderCases() {
    const container = document.getElementById('cases-container');
    container.innerHTML = '';

    casesData.forEach(caseItem => {
        const caseElement = document.createElement('div');
        caseElement.className = 'case-card';
        caseElement.onclick = () => openCase(caseItem.id);
        
        caseElement.innerHTML = `
            <img src="${caseItem.image}" alt="${caseItem.name}" class="case-image">
            <div class="case-name">${caseItem.name}</div>
            <div class="case-price">${caseItem.price.toLocaleString()} ₽</div>
        `;
        
        container.appendChild(caseElement);
    });
}

function renderSpecialBags() {
    const container = document.getElementById('special-bags');
    container.innerHTML = '';

    bagsData.forEach(bag => {
        const bagElement = document.createElement('div');
        bagElement.className = 'bag-card';
        
        bagElement.innerHTML = `
            <div class="bag-name">${bag.name}</div>
            <div class="bag-price">${bag.price.toLocaleString()} ₽</div>
        `;
        
        container.appendChild(bagElement);
    });
}

function loadRecentPrizes() {
    const container = document.getElementById('recent-prizes');
    
    // Тестовые данные
    const recentPrizes = [
        { name: 'NFT Арт #1', image: 'prize1.jpg' },
        { name: 'Золотой стикер', image: 'prize2.jpg' },
        { name: 'Редкий скин', image: 'prize3.jpg' }
    ];

    container.innerHTML = '';
    
    recentPrizes.forEach(prize => {
        const prizeElement = document.createElement('div');
        prizeElement.className = 'prize-item';
        
        prizeElement.innerHTML = `
            <img src="${prize.image}" alt="${prize.name}">
            <div>${prize.name}</div>
        `;
        
        container.appendChild(prizeElement);
    });
}

async function openCase(caseId) {
    const caseItem = casesData.find(c => c.id === caseId);
    const balance = parseInt(document.getElementById('balance').textContent);
    
    if (balance < caseItem.price) {
        alert('Недостаточно средств!');
        return;
    }

    const newBalance = balance - caseItem.price;
    document.getElementById('balance').textContent = newBalance;

    const wonItems = [
        'NFT Арт "Космос"',
        'Золотой токен',
        'Редкий стикерпак',
        'Эксклюзивный скин'
    ];
    
    const wonItem = wonItems[Math.floor(Math.random() * wonItems.length)];
   
    document.getElementById('case-result-title').textContent = '🎉 Поздравляем!';
    document.getElementById('case-result-item').textContent = wonItem;
    document.getElementById('case-modal').classList.remove('hidden')
    loadRecentPrizes();
}

// Пополнение баланса
async function processDeposit() {
    const amount = parseInt(document.getElementById('deposit-amount').value);
    
    if (amount < 100) {
        alert('Минимальная сумма пополнения 100 ₽');
        return;
    }

    const currentBalance = parseInt(document.getElementById('balance').textContent);
    const newBalance = currentBalance + amount;
    
    document.getElementById('balance').textContent = newBalance;
    hideDepositModal();
    
    alert(`Баланс пополнен на ${amount} ₽!`);
}

// Управление модальными окнами
function showDepositModal() {
    document.getElementById('deposit-modal').classList.remove('hidden');
}

function hideDepositModal() {
    document.getElementById('deposit-modal').classList.add('hidden');
    document.getElementById('deposit-amount').value = '';
}

function hideCaseModal() {
    document.getElementById('case-modal').classList.add('hidden');
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);
