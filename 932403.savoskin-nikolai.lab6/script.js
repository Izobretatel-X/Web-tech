// Запрашиваем имя студента через диалоговое окно prompt().
let studentName = prompt("Введите ваше имя:");

// Проверяем, что имя введено и не состоит только из пробелов.
// Если пользователь нажал Cancel или оставил поле пустым,
// используем имя по умолчанию.
if (studentName === null || studentName.trim() === "") {
    studentName = "Студент";
} else {
    studentName = studentName.trim();
}

// Массив из 6 баллов за лабораторные работы (от 0 до 100).
const scores = [85, 72, 94, 45, 88, 60];

// Функция findMax() находит максимальный балл в массиве.
function findMax(array) {
    let max = array[0]; // Сначала максимум — первый элемент.

    // Перебираем остальные элементы массива.
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i]; // Обновляем максимум.
        }
    }

    return max; // Возвращаем максимальный балл.
}

// Функция filterHighScores() оставляет баллы >= 80.
function filterHighScores(array) {
    const highScores = []; // Новый массив отличных результатов.

    // Перебираем исходный массив и проверяем каждый балл.
    for (let i = 0; i < array.length; i++) {
        if (array[i] >= 80) {
            highScores.push(array[i]); // Добавляем подходящий балл.
        }
    }

    return highScores; // Возвращаем отфильтрованный массив.
}

// Функция calculateSum() вычисляет сумму всех баллов.
function calculateSum(array) {
    let sum = 0; // Начальная сумма.

    for (let i = 0; i < array.length; i++) {
        sum += array[i]; // Прибавляем очередной балл к сумме.
    }

    return sum; // Возвращаем общую сумму.
}

// Получаем результаты работы функций.
const maxScore = findMax(scores);
const highScores = filterHighScores(scores);
const totalScore = calculateSum(scores);

// Рассчитываем средний балл.
// Делим сумму баллов на количество лабораторных работ.
const averageScore = totalScore / scores.length;

// С помощью цикла считаем количество неудовлетворительных работ.
// Неудовлетворительный балл — строго меньше 50.
let unsatisfactoryCount = 0;

for (let i = 0; i < scores.length; i++) {
    if (scores[i] < 50) {
        unsatisfactoryCount++;
    }
}

// Выводим приветствие и результаты через alert().
alert(
    `Здравствуйте, ${studentName}!\n` +
    `У вас ${highScores.length} отличных работ, ` +
    `максимальный балл – ${maxScore}`
);

// Выводим информацию в консоль браузера.
console.log("Баллы за лабораторные:", scores);
console.log("Сумма баллов:", totalScore);
console.log("Средний балл:", averageScore.toFixed(2));
console.log("Количество неудовлетворительных работ:", unsatisfactoryCount);

// Дополнительное условие из методички:
// если средний балл >= 85, выводим мотивационное сообщение.
if (averageScore >= 85) {
    console.log("Отличная работа! Продолжайте в том же духе!");
}


// ===== Лабораторная работа №5. DOM и взаимодействие с элементами страницы =====

// Ключи, под которыми данные хранятся в localStorage.
const THEME_KEY = "theme";
const PROJECTS_KEY = "projectsHTML";

// Ищем нужные элементы страницы разными методами DOM.
// querySelector() — контейнер со списком карточек проектов.
const projectsContainer = document.querySelector("#projects-list");
// getElementById() — кнопки управления и переключения темы.
const addButton = document.getElementById("add-project-btn");
const removeButton = document.getElementById("remove-last-btn");
const toggleButton = document.getElementById("toggle-projects-btn");
const themeButton = document.getElementById("theme-toggle-btn");

// Функция checkElements() проверяет, что все нужные элементы найдены.
// Если какого-то элемента нет, пишет ошибку в консоль и возвращает false.
function checkElements() {
    const required = {
        "#projects-list": projectsContainer,
        "#add-project-btn": addButton,
        "#remove-last-btn": removeButton,
        "#toggle-projects-btn": toggleButton,
        "#theme-toggle-btn": themeButton
    };

    for (const selector in required) {
        if (!required[selector]) {
            console.error(`Элемент не найден: ${selector}`);
            return false;
        }
    }

    return true;
}

// Функция saveProjects() сохраняет текущий список карточек в localStorage.
function saveProjects() {
    try {
        localStorage.setItem(PROJECTS_KEY, projectsContainer.innerHTML);
    } catch (error) {
        console.error("Не удалось сохранить проекты в localStorage:", error);
    }
}

// Функция loadProjects() восстанавливает список карточек из localStorage.
// Если сохранённых данных нет, остаются карточки из index.html.
function loadProjects() {
    try {
        const saved = localStorage.getItem(PROJECTS_KEY);

        if (saved !== null) {
            projectsContainer.innerHTML = saved;
        }
    } catch (error) {
        console.error("Не удалось загрузить проекты из localStorage:", error);
    }
}

// Функция applyTheme() ставит у <body> класс theme-light или theme-dark
// и обновляет текст кнопки переключения темы.
function applyTheme(theme) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme);

    themeButton.textContent = theme === "theme-dark" ? "Светлая тема" : "Тёмная тема";
}

// Функция toggleTheme() переключает тему и сохраняет выбор в localStorage.
function toggleTheme() {
    const newTheme = document.body.classList.contains("theme-dark")
        ? "theme-light"
        : "theme-dark";

    applyTheme(newTheme);

    try {
        localStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
        console.error("Не удалось сохранить тему в localStorage:", error);
    }
}

// Функция loadTheme() восстанавливает сохранённую тему при загрузке страницы.
function loadTheme() {
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(THEME_KEY);
    } catch (error) {
        console.error("Не удалось загрузить тему из localStorage:", error);
    }

    // Применяем только корректное значение, иначе — светлая тема по умолчанию.
    if (savedTheme === "theme-dark" || savedTheme === "theme-light") {
        applyTheme(savedTheme);
    } else {
        applyTheme("theme-light");
    }
}

// Функция createProjectCard() создаёт карточку проекта через createElement().
function createProjectCard(title, description) {
    const card = document.createElement("article"); // Карточка проекта.
    card.classList.add("project-card");

    const icon = document.createElement("div"); // Иконка проекта.
    icon.classList.add("project-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "📁";

    const info = document.createElement("div"); // Блок с текстом карточки.
    info.classList.add("project-info");

    const heading = document.createElement("h3"); // Заголовок проекта.
    heading.textContent = title;

    const text = document.createElement("p"); // Описание проекта.
    text.textContent = description;

    const button = document.createElement("button"); // Кнопка «Подробнее».
    button.type = "button";
    button.classList.add("project-button");
    button.textContent = "Подробнее";

    // Собираем карточку из частей.
    info.appendChild(heading);
    info.appendChild(text);
    info.appendChild(button);
    card.appendChild(icon);
    card.appendChild(info);

    return card;
}

// Функция addProject() запрашивает данные через prompt() и добавляет карточку.
function addProject() {
    const title = prompt("Введите название проекта:");

    // Если пользователь нажал Cancel или оставил поле пустым, проект не добавляем.
    if (title === null || title.trim() === "") {
        console.log("Добавление проекта отменено: не введено название");
        return;
    }

    const description = prompt("Введите краткое описание проекта:");

    if (description === null) {
        console.log("Добавление проекта отменено");
        return;
    }

    const card = createProjectCard(
        title.trim(),
        description.trim() === "" ? "Описание отсутствует" : description.trim()
    );

    projectsContainer.appendChild(card); // Добавляем карточку в контейнер.
    saveProjects(); // Сохраняем обновлённый список.
}

// Функция removeLastProject() удаляет последнюю карточку проекта.
function removeLastProject() {
    // querySelectorAll() возвращает все карточки проектов в контейнере.
    const cards = projectsContainer.querySelectorAll(".project-card");

    if (cards.length > 0) {
        cards[cards.length - 1].remove(); // Удаляем последний элемент.
        saveProjects(); // Сохраняем обновлённый список.
    } else {
        console.log("Нет проектов для удаления");
        alert("Список пуст");
    }
}

// Функция toggleProjects() сворачивает и разворачивает список проектов.
function toggleProjects() {
    // toggle() добавляет класс hidden, если его нет, и убирает, если он есть.
    const isHidden = projectsContainer.classList.toggle("hidden");

    toggleButton.textContent = isHidden ? "Развернуть проекты" : "Свернуть проекты";
}

// Функция showProjectDetails() показывает подробности карточки по кнопке «Подробнее».
// Обработчик навешен на контейнер, поэтому работает и для восстановленных карточек.
function showProjectDetails(event) {
    const button = event.target.closest("button.project-button");

    if (!button) {
        return; // Клик был не по кнопке «Подробнее».
    }

    const card = button.closest(".project-card");
    const title = card.querySelector("h3");
    const description = card.querySelector("p");

    if (title && description) {
        alert(`${title.textContent}\n\n${description.textContent}`);
    }
}

// Функция initProjectManager() запускает лабораторную работу №5.
// Если какой-то элемент не найден, скрипт дальше не выполняется.
function initProjectManager() {
    if (!checkElements()) {
        console.error("Скрипт лабораторной работы №5 не запущен");
        return;
    }

    loadTheme();    // Восстанавливаем тему.
    loadProjects(); // Восстанавливаем список проектов.

    // Подключаем обработчики событий.
    themeButton.addEventListener("click", toggleTheme);
    addButton.addEventListener("click", addProject);
    removeButton.addEventListener("click", removeLastProject);
    toggleButton.addEventListener("click", toggleProjects);
    projectsContainer.addEventListener("click", showProjectDetails);
}

initProjectManager();
