// Конфигурация Supabase
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Текущий пользователь
let currentUser = null;

// Инициализация приложения
async function initApp() {
    // Проверяем авторизацию
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        showApp();
        loadUserData();
        loadCases();
        loadInventory();
    } else {
        showAuth();
    }
}

// Показать основное приложение
function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

// Показать секцию авторизации
function showAuth() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

// Загрузка данных пользователя
async function loadUserData() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('balance, username')
        .eq('id', currentUser.id)
        .single();
    
    if (profile) {
        document.getElementById('balance').textContent = profile.balance;
    }
}

// Загрузка кейсов
async function loadCases() {
    const { data: cases } = await supabase
        .from('cases')
        .select('*');
    
    const container = document.getElementById('cases-container');
    container.innerHTML = '';
    
    cases.forEach(caseItem => {
        const caseElement = document.createElement('div');
        caseElement.className = 'case';
        caseElement.innerHTML = `
            <img src="${caseItem.image_url}" width="100">
            <h3>${caseItem.name}</h3>
            <p>Цена: ${caseItem.price} руб.</p>
            <button onclick="openCase(${caseItem.id})">Открыть</button>
        `;
        container.appendChild(caseElement);
    });
}

// Открытие кейса
async function openCase(caseId) {
    // 1. Проверяем баланс
    const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', currentUser.id)
        .single();
    
    const { data: caseData } = await supabase
        .from('cases')
        .select('price')
        .eq('id', caseId)
        .single();
    
    if (profile.balance < caseData.price) {
        alert('Недостаточно средств!');
        return;
    }
    
    // 2. Списываем деньги
    await supabase
        .from('profiles')
        .update({ balance: profile.balance - caseData.price })
        .eq('id', currentUser.id);
    
    // 3. Выбираем случайный предмет
    const { data: items } = await supabase
        .from('case_items')
        .select('*')
        .eq('case_id', caseId);
    
    const randomItem = getRandomItem(items);
    
    // 4. Добавляем в инвентарь
    await supabase
        .from('user_inventory')
        .insert([{
            user_id: currentUser.id,
            item_id: randomItem.id
        }]);
    
    // 5. Записываем транзакцию
    await supabase
        .from('transactions')
        .insert([{
            user_id: currentUser.id,
            amount: -caseData.price,
            type: 'case_purchase',
            description: `Покупка кейса #${caseId}`
        }]);
    
    alert(`Поздравляем! Вы получили: ${randomItem.name} (${randomItem.rarity})`);
    
    // Обновляем интерфейс
    loadUserData();
    loadInventory();
}

// Алгоритм выбора предмета по вероятности
function getRandomItem(items) {
    const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (const item of items) {
        random -= item.probability;
        if (random <= 0) return item;
    }
    
    return items[items.length - 1];
}

// Пополнение баланса
async function processDeposit() {
    const amount = parseInt(document.getElementById('deposit-amount').value);
    
    if (amount < 10) {
        alert('Минимальная сумма пополнения 10 руб.');
        return;
    }
    
    // Здесь интеграция с платежной системой
    // Пока просто увеличиваем баланс
    const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', currentUser.id)
        .single();
    
    await supabase
        .from('profiles')
        .update({ balance: profile.balance + amount })
        .eq('id', currentUser.id);
    
    await supabase
        .from('transactions')
        .insert([{
            user_id: currentUser.id,
            amount: amount,
            type: 'deposit',
            description: 'Пополнение баланса'
        }]);
    
    hideDepositModal();
    loadUserData();
    alert('Баланс успешно пополнен!');
}

// Модальные окна
function showDepositModal() {
    document.getElementById('deposit-modal').classList.remove('hidden');
}

function hideDepositModal() {
    document.getElementById('deposit-modal').classList.add('hidden');
}

// Запуск приложения
initApp();