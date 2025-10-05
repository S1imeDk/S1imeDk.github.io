// Инициализация Telegram WebApp
function initTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        if (user) {
            document.querySelector('.username').textContent = user.username || 'Гость';
            const avatarUrl = user.photo_url || 'https://via.placeholder.com/24?text=' + (user.username ? user.username[0] : 'A');
            document.querySelector('.avatar').style.backgroundImage = `url(${avatarUrl})`;
        } else {
            document.querySelector('.username').textContent = 'Гость';
            document.querySelector('.avatar').style.backgroundImage = 'ur[](https://via.placeholder.com/24?text=A)';
        }
    }
}

// Загрузка кейсов из JSON
async function loadCases() {
    try {
        const response = await fetch('/cases.json');
        const cases = await response.json();

        const container = document.querySelector('.cases-container');
        container.innerHTML = cases.map((caseItem, index) => `
            <div class="case-card" data-id="${index + 1}">
                <img src="${caseItem.image_url || 'https://via.placeholder.com/150?text=No+Image'}" alt="Case Image" onerror="this.src='https://via.placeholder.com/150?text=Error'">
                <div class="price">${caseItem.price || 0} TON</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const container = document.querySelector('.cases-container');
        container.innerHTML = `
            <div class="case-card" data-id="1">
                <img src="https://via.placeholder.com/150?text=Error" alt="Case Image">
                <div class="price">0 TON</div>
            </div>
            <div class="case-card" data-id="2">
                <img src="https://via.placeholder.com/150?text=Error" alt="Case Image">
                <div class="price">0 TON</div>
            </div>
        `;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    loadCases();
});