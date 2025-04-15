/**
 * Додає, видаляє або перемикає CSS клас для колекції елементів.
 * @param {NodeListOf<Element>|Array<Element>} elements - Колекція елементів.
 * @param {string} className - Ім'я CSS класу для маніпуляції.
 * @param {'add'|'remove'|'toggle'} action - Дія ('add', 'remove', 'toggle').
 */
const switchClass = (elements, className, action) => {
  // Перевірка на валідність дії
  if (!["add", "remove", "toggle"].includes(action)) {
    console.warn(`Невідомий тип дії для switchClass: ${action}`);
    return;
  }
  // Перевірка на наявність класу
  if (!className) {
    console.warn(`Не вказано ім'я класу для switchClass.`);
    return;
  }

  elements.forEach((el) => {
    el.classList[action](className);
  });
};

/**
 * Анімує висоту блоку (ефект акордеону).
 * Потребує налаштування CSS transition для властивості height.
 * @param {string} selector - CSS селектор елемента.
 */
function animateBlockHeight(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    console.warn(
      `Елемент не знайдено за селектором для анімації: "${selector}"`
    );
    return;
  }

  // Встановлюємо плавний перехід, якщо ще не встановлено (краще робити це в CSS)
  // if (!element.style.transition) {
  //   element.style.transition = 'height 0.3s ease';
  // }

  const isCollapsed =
    element.style.height === "0px" || element.style.height === "";

  if (isCollapsed) {
    // Відкриваємо: встановлюємо висоту на основі вмісту
    element.style.height = `${element.scrollHeight}px`;
  } else {
    // Закриваємо: встановлюємо висоту в 0
    // Спочатку встановлюємо поточну висоту, щоб уникнути "стрибка" перед анімацією закриття
    element.style.height = `${element.scrollHeight}px`;
    // Невелика затримка перед встановленням висоти в 0 для коректної анімації
    requestAnimationFrame(() => {
      element.style.height = "0px";
    });
  }
}

/**
 * Ініціалізує функціонал перемикачів на основі data-атрибутів.
 *
 * Очікувані data-атрибути на елементі-тригері:
 * - `data-toggle`: Дія з класом ('open', 'close', 'toggle').
 * - `data-target`: CSS селектор цільових елементів, на яких змінюється клас.
 * - `data-state-class`: CSS клас, який додається/видаляється/перемикається.
 * - `data-action-name` (опціонально): Ім'я функції для додаткової дії (напр., 'animateBlockHeight').
 * - `data-action-target` (опціонально): CSS селектор цільового елемента для додаткової дії.
 */
export const initializeToggles = () => {
  const toggleTriggers = document.querySelectorAll("[data-toggle]");

  toggleTriggers.forEach((trigger) => {
    const classAction = trigger.dataset.toggle; // 'open', 'close', 'toggle'
    const targetSelector = trigger.dataset.target;
    const stateClass = trigger.dataset.stateClass;

    // Атрибути для додаткової дії
    const actionName = trigger.dataset.actionName; // напр., 'animateBlockHeight'
    const actionTargetSelector = trigger.dataset.actionTarget; // напр., '#myAccordionContent'

    // Перевірка наявності обов'язкових атрибутів для зміни класу
    if (!classAction || !targetSelector || !stateClass) {
      console.warn(
        "Тригер не має всіх необхідних атрибутів: data-toggle, data-target, data-state-class",
        trigger
      );
      // Можна пропустити цей тригер, якщо основна дія (зміна класу) неможлива
      // return; // Розкоментуйте, якщо критично, щоб були всі атрибути для зміни класу
    }

    // Знаходимо цільові елементи для зміни класу *один раз*
    const targetElements = targetSelector
      ? document.querySelectorAll(targetSelector)
      : [];

    if (targetSelector && !targetElements.length) {
      console.warn(
        `Не знайдено цільових елементів для зміни класу за селектором "${targetSelector}" для тригера:`,
        trigger
      );
      // Якщо цільових елементів немає, немає сенсу додавати слухача для зміни класу
      // return; // Розкоментуйте, якщо зміна класу є основною і обов'язковою дією
    }

    trigger.addEventListener("click", () => {
      // 1. Виконання дії з класом (якщо атрибути задані)
      if (classAction && stateClass && targetElements.length > 0) {
        let effectiveClassAction;
        switch (classAction) {
          case "open":
            effectiveClassAction = "add";
            break;
          case "close":
            effectiveClassAction = "remove";
            break;
          case "toggle":
            effectiveClassAction = "toggle";
            break;
          default:
            console.warn(`Невідомий тип дії для data-toggle: ${classAction}`);
            effectiveClassAction = null; // Не виконувати дію, якщо тип невідомий
        }

        if (effectiveClassAction) {
          switchClass(targetElements, stateClass, effectiveClassAction);
        }
      }

      // 2. Виконання додаткової дії (якщо атрибути задані)
      if (actionName) {
        // Перевірка наявності цільового селектора для дії, якщо він потрібен
        if (actionName === "animateBlockHeight" && !actionTargetSelector) {
          console.warn(
            `Для дії "animateBlockHeight" потрібен атрибут data-action-target`,
            trigger
          );
          return; // Не виконувати дію без цілі
        }

        // Виклик відповідної функції
        switch (actionName) {
          case "animateBlockHeight":
            animateBlockHeight(actionTargetSelector);
            break;
          // Можна додати інші дії тут
          // case 'anotherAction':
          //   anotherFunction(actionTargetSelector); // або без селектора, якщо не потрібен
          //   break;
          default:
            console.warn(`Невідома додаткова дія: ${actionName}`);
        }
      }
    });
  });
};

// Приклад виклику ініціалізації
// document.addEventListener('DOMContentLoaded', initializeToggles);
// або просто викликати initializeToggles(), якщо скрипт підключається в кінці body
// initializeToggles();
