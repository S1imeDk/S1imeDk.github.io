// Supabase config — замени на свои данные
const supabaseUrl = 'https://qxdgipwmfmzhzabplypc.supabase.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZGdpcHdtZm16aHphYnBseXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDE4MTksImV4cCI6MjA3MDE3NzgxOX0.awTKjqPUPuZwm6Tb6_jQKMLzICb_ir-5bvXNXHVnhsw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

// Загрузка кейсов из Supabase
async function loadCases() {
    const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .limit(2);

    if (error) {
        console.error('Ошибка загрузки:', error);
        return;
    }

    const container = document.querySelector('.cases-container');
    container.innerHTML = cases.map(caseItem => `
        <div class="case-card" data-id="${caseItem.id}">
            <img src="${caseItem.image_url || 'https://via.placeholder.com/150?text=No+Image'}" alt="Case Image" onerror="this.src='https://via.placeholder.com/150?text=Error'">
            <div class="price">${caseItem.price || 0} TON</div>
        </div>
    `).join('');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    loadCases();
});