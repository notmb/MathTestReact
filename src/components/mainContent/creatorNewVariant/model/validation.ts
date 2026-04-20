import type {
  ChoiceTaskDraft,
  ComparisonTaskDraft,
  OpenAnswerTaskDraft,
  VariantMetaDraft,
} from "./types";

const VARIANT_SERIAL_PATTERN = /^topic\d+$/;

export const validateVariantMeta = (
  meta: VariantMetaDraft,
): string | null => {
  if (!meta.variantName.trim()) {
    return "Вкажи назву варіанту.";
  }

  if (!meta.variantSerialNumber.trim()) {
    return "Вкажи номер варіанту.";
  }

  if (!VARIANT_SERIAL_PATTERN.test(meta.variantSerialNumber.trim())) {
    return "Номер варіанту має відповідати формату topicN, де N - число.";
  }

  const taskCount = Number(meta.numberOfTasks.trim());
  const isValidTaskCount = Number.isInteger(taskCount) && taskCount > 0;

  if (!isValidTaskCount) {
    return "Кількість завдань має бути цілим числом більше нуля.";
  }

  if (meta.typeTest !== "main" && meta.typeTest !== "retaking") {
    return "Тип тесту має бути main або retaking.";
  }

  return null;
};

const hasFilledValue = (value: string | undefined): boolean =>
  Boolean(value?.trim());

const validateComparisonColumn = (
  texts: string[] | undefined,
  pictures: string[] | undefined,
  columnLabel: "ліва" | "права",
): string | null => {
  const maxLength = Math.max(texts?.length ?? 0, pictures?.length ?? 0);

  for (let index = 0; index < maxLength; index += 1) {
    const hasText = hasFilledValue(texts?.[index]);
    const hasPicture = hasFilledValue(pictures?.[index]);

    if (!hasText && !hasPicture) {
      return `Кожен елемент у ${columnLabel}й колонці має містити текст або картинку.`;
    }
  }

  return null;
};

export const validateComparisonTask = (
  taskDraft: ComparisonTaskDraft,
): string | null => {
  if (!taskDraft.data.task.text.trim()) {
    return "Для задачі на співставлення обов'язково заповни текст умови.";
  }

  const leftColumnError = validateComparisonColumn(
    taskDraft.data.comparisonTable.list1.texts,
    taskDraft.data.comparisonTable.list1.pictures,
    "ліва",
  );

  if (leftColumnError) {
    return leftColumnError;
  }

  const rightColumnError = validateComparisonColumn(
    taskDraft.data.comparisonTable.list2.texts,
    taskDraft.data.comparisonTable.list2.pictures,
    "права",
  );

  if (rightColumnError) {
    return rightColumnError;
  }

  const comparisonKeys = Object.keys(taskDraft.data.correctComparison);

  if (
    comparisonKeys.length === 0 ||
    comparisonKeys.some(
      (key) => !hasFilledValue(taskDraft.data.correctComparison[key]),
    )
  ) {
    return "Заповни всі поля правильних відповідностей.";
  }

  return null;
};

export const validateChoiceTask = (
  taskDraft: ChoiceTaskDraft,
): string | null => {
  if (!taskDraft.data.task.text.trim()) {
    return "Для задачі з вибором відповіді обов'язково заповни текст умови.";
  }

  const answersCount = Math.max(
    taskDraft.data.answers.values.length,
    taskDraft.data.answers.pictures?.length ?? 0,
  );

  for (let index = 0; index < answersCount; index += 1) {
    const hasText = hasFilledValue(taskDraft.data.answers.values[index]);
    const hasPicture = hasFilledValue(taskDraft.data.answers.pictures?.[index]);

    if (!hasText && !hasPicture) {
      return "Кожна відповідь має містити текст або картинку.";
    }
  }

  if (!taskDraft.data.correctAnswer.trim()) {
    return "Заповни поле правильної відповіді.";
  }

  return null;
};

export const validateOpenAnswerTask = (
  taskDraft: OpenAnswerTaskDraft,
): string | null => {
  if (!taskDraft.data.task.text.trim()) {
    return "Для задачі з відкритою відповіддю обов'язково заповни текст умови.";
  }

  if (!taskDraft.data.correctAnswer.trim()) {
    return "Заповни поле правильної відповіді.";
  }

  return null;
};
