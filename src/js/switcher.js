const switchClass = (collection, className, action) => {
  if (!["add", "remove", "toggle"].includes(action)) return;

  collection.forEach((el) => {
    if (className) {
      el.classList[action](className);
    }
  });
};

export const toggle = () => {
  const toggleTriggers = document.querySelectorAll("[data-toggle]");

  toggleTriggers.forEach((trigger) => {
    const action = trigger.dataset.toggle;
    const targetBlockSelector = trigger.dataset.target;
    const targetBlockStateClass = trigger.dataset.stateClass;

    const targetBlocks = document.querySelectorAll(targetBlockSelector);

    if (!targetBlocks.length) {
      console.warn(
        `Не знайдено елементів за селектором "${targetBlockSelector}"`
      );
      return;
    }

    trigger.addEventListener("click", () => {
      switch (action) {
        case "open":
          switchClass(targetBlocks, targetBlockStateClass, "add");
          break;
        case "close":
          switchClass(targetBlocks, targetBlockStateClass, "remove");
          break;
        case "toggle":
          switchClass(targetBlocks, targetBlockStateClass, "toggle");
          break;
        default:
          console.warn(`Невідомий тип дії: ${action}`);
      }
    });
  });
};
