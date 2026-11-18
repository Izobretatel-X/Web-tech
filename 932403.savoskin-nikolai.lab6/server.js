// Подключаем Express и встроенный модуль path для работы с путями к файлам.
const express = require("express");
const path = require("path");

// Создаём приложение Express.
const app = express();

// Порт берём из переменной окружения PORT, если её нет — используем 3000.
const PORT = process.env.PORT || 3000;

// Папка со статическими файлами (HTML, CSS, JS, манифест, service worker, иконки).
const PUBLIC_DIR = path.join(__dirname, "public");

// Тексты приветствий для поддерживаемых языков (по умолчанию — английский).
const GREETINGS = {
    en: (name) => `Hello, ${name}!`,
    ru: (name) => `Привет, ${name}!`
};

// Функция isValidName() проверяет имя: оно не пустое, не длиннее 50 символов
// и состоит только из букв (любых алфавитов), цифр и дефиса — без спецсимволов.
function isValidName(name) {
    return typeof name === "string" &&
        name.trim().length > 0 &&
        name.length <= 50 &&
        /^[\p{L}\p{N}-]+$/u.test(name);
}

// Функция resolveLang() выбирает язык: "ru" включает русский,
// любое другое значение (или его отсутствие) — английский по умолчанию.
function resolveLang(value) {
    return value === "ru" ? "ru" : "en";
}

// Middleware логирования: выводит в консоль каждый запрос (время, метод, адрес)
// и после отправки ответа — код ответа.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    res.on("finish", () => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
    });

    next(); // Передаём управление дальше, иначе запрос «зависнет».
});

// Middleware раздачи статики из папки public (CSS, JS, картинки, манифест, service worker).
// index: false — главную страницу отдаёт явный маршрут GET / ниже.
app.use(express.static(PUBLIC_DIR, { index: false }));

// Маршрут GET / — главная страница (страница из лабораторной работы №5).
app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Маршрут GET /about — страница «О себе».
app.get("/about", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "about.html"));
});

// Маршрут GET /api/greet без имени (Express считает его тем же, что и /api/greet/):
// имя пустое, поэтому отвечаем ошибкой 400.
app.get("/api/greet", (req, res) => {
    res.status(400).json({ error: "Invalid name" });
});

// Маршрут GET /api/greet/:name — JSON-приветствие.
// :name — параметр пути, ?lang=ru — query-параметр выбора языка.
app.get("/api/greet/:name", (req, res) => {
    const name = req.params.name;           // Параметр пути, например /api/greet/Nikolay.
    const lang = resolveLang(req.query.lang); // Параметр запроса ?lang=...

    // Неверное имя — код 400 и JSON с ошибкой.
    if (!isValidName(name)) {
        return res.status(400).json({ error: "Invalid name" });
    }

    // Успешный ответ: сообщение, время в формате ISO и использованный язык.
    res.json({
        message: GREETINGS[lang](name.trim()),
        timestamp: new Date().toISOString(),
        lang: lang
    });
});

// Middleware 404: срабатывает, если ни один маршрут выше не подошёл.
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Обработчик ошибок (4 аргумента): например, некорректная запись %E0%A4%A в адресе.
// Ошибки клиента возвращаем как 400, остальные — как 500, всегда в формате JSON.
app.use((err, req, res, next) => {
    console.error("Ошибка:", err.message);

    if (err.status === 400) {
        return res.status(400).json({ error: "Bad request" });
    }

    res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера и сообщение в консоль о том, на каком порту он работает.
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
