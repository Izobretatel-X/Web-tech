const CACHE_NAME = "student-portfolio-v1";

// Список файлов, которые кешируются при установке (оболочка приложения).
const STATIC_ASSETS = [
    "/",
    "/about",
    "/style.css",
    "/script.js",
    "/pwa.js",
    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-maskable-512.png",
    "/images/Student_photo.jpg",
    "/images/backrooms.jpg",
    "/images/kitchen-1.jpg",
    "/images/kitchen-2.jpg",
    "/images/radio-1.jpg"
];

// Событие install: срабатывает при первой установке service worker — наполняем кеш.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            // Добавляем файлы по одному: если какого-то файла нет,
            // установка не ломается, а остальные файлы всё равно кешируются.
            Promise.allSettled(STATIC_ASSETS.map((url) => cache.add(url)))
        )
    );

    self.skipWaiting(); // Новая версия активируется сразу, не дожидаясь закрытия вкладок.
});

// Событие activate: удаляем кеши старых версий.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );

    self.clients.claim(); // Сразу берём под контроль уже открытые страницы.
});

// Событие fetch: перехватываем каждый запрос страницы.
self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Обрабатываем только GET-запросы к нашему сайту.
    if (request.method !== "GET" || url.origin !== self.location.origin) {
        return;
    }

    // API-запросы всегда идут в сеть: приветствие содержит время и не должно устаревать.
    if (url.pathname.startsWith("/api/")) {
        return;
    }

    // Для статики: сначала ищем файл в кеше, если его нет — загружаем из сети.
    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(request).catch(() =>
                // Сети нет и файла нет в кеше: для переходов между страницами отдаём главную.
                request.mode === "navigate" ? caches.match("/") : Response.error()
            );
        })
    );
});
