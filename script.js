// Пример простой симуляции
const dropItems = ["🔫 AWP", "🔪 Нож", "💣 Граната", "🔫 P90", "🔥 Огнемёт"];

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function () {
    const username = getQueryParam("username") || "unknown";
    document.getElementById("username").innerText = "@" + username;
    document.getElementById("balance").innerText = "Баланс: 500₽";

    // Можно загружать аватар с помощью Telegram API через user_id (если ты будешь хранить это на бэке)
};

function openCase(caseId) {
    document.getElementById("caseModal").style.display = "flex";
    document.getElementById("dropResult").innerText = "Возможный дроп...";
}

function spinCase() {
    const result = dropItems[Math.floor(Math.random() * dropItems.length)];
    document.getElementById("dropResult").innerText = "🎉 Тебе выпало: " + result;
}
