// Регистрация service worker. Файл подключается на каждой странице сайта.
// Проверяем, что браузер поддерживает service worker.
if ("serviceWorker" in navigator) {
    // Ждём полной загрузки страницы, чтобы регистрация не тормозила отрисовку.
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js") // Файл лежит в корне, поэтому scope — весь сайт.
            .then((registration) => {
                console.log("Service worker зарегистрирован, scope:", registration.scope);
            })
            .catch((error) => {
                console.error("Не удалось зарегистрировать service worker:", error);
            });
    });
}
