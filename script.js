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
            document.querySelector('.avatar').textContent = user.username ? user.username[0] : 'А';
        }
    } else {
        document.querySelector('.username').textContent = 'Гость';
    }
}

// Обновление предпросмотра изображения
document.querySelectorAll('.image-input').forEach(input => {
    input.addEventListener('input', function() {
        const preview = this.nextElementSibling;
        const img = preview.querySelector('img') || document.createElement('img');
        img.src = this.value || 'https://via.placeholder.com/150?text=No+Image';
        if (!preview.querySelector('img')) preview.appendChild(img);
    });
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
});