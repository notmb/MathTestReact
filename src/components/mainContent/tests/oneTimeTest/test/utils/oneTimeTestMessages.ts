const reasonMessageMap: Record<string, string> = {
  linkNotFound: "Посилання на тест не знайдено.",
  badLinkData: "Дані посилання пошкоджені. Зверніться до викладача.",
  linkLoadError: "Не вдалося завантажити посилання. Спробуйте пізніше.",
  variantNotFound: "Варіант тесту не знайдено.",
  variantLoadError: "Не вдалося завантажити варіант тесту.",
  tasksLoadError: "Не вдалося завантажити завдання.",
  finalizeError: "Не вдалося зберегти результат. Спробуйте ще раз.",
  finalizeMissingData:
    "Не вистачає даних для збереження результату. Зверніться до викладача.",
  finalizeBadTypeTest: "Некоректний тип тесту. Зверніться до викладача.",
};

export const getReasonMessage = (reason: string) => {
  if (reason.startsWith("statusNotStarted:")) {
    const value = reason.split(":")[1];

    if (value === "notStarted") return "Тест ще не розпочато.";
    if (value === "finished") return "Це посилання вже завершене.";

    return `Тест недоступний (status: ${value}).`;
  }

  return reasonMessageMap[reason] ?? `Невідома помилка: ${reason}`;
};
