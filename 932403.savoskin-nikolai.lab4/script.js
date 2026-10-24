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
