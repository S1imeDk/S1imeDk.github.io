// Supabase config — замени на свои данные
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Telegram WebApp init (для Mini App)
if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
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

// Сохранение цены в Supabase
document.querySelectorAll('.price-input').forEach(input => {
    input.addEventListener('change', async function() {
        const caseCard = this.closest('.case-card');
        const imageInput = caseCard.querySelector('.image-input').value;
        const newPrice = parseFloat(this.value) || 0;

        const { error } = await supabase
            .from('cases')
            .upsert({
                image_url: imageInput,
                price: newPrice
            }, {
                onConflict: 'id' // Предполагаем, что у тебя есть id, если нет — убери
            });
        if (error) console.error('Ошибка обновления:', error);
    });
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // TODO: Переключение секций
        });
    });
});
