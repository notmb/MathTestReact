import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../../firebaseConfig";
import type { Task1, Task2, Task3 } from "../../types";

type EditableTask = Task1 | Task2 | Task3;

type SaveEditedTaskParams<TTask extends EditableTask> = {
  draft: TTask;
  numTask: string;
  selectedVariant: string;
  typeTest: string;
  files: File[];
  updateTask: (numTask: string, updatedTask: TTask) => void;
  onSuccess: () => void;
};

const normalizeStringArray = (values?: (string | undefined)[]) => {
  if (!values) {
    return undefined;
  }

  const normalized = values.map((value) => value ?? "");
  return normalized.some((value) => value !== "") ? normalized : undefined;
};

const compactObject = <T extends Record<string, unknown>>(value: T): T => {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
};

const normalizeQuestion = (task: EditableTask["task"]) =>
  compactObject({
    text: task.text ?? "",
    picture: task.picture || undefined,
    list: normalizeStringArray(task.list),
    table: task.table
      ? {
          value1: task.table.value1.map((value) => value ?? ""),
          value2: task.table.value2.map((value) => value ?? ""),
        }
      : undefined,
  });

const normalizeChoiceTask = (task: Task1): Task1 => ({
  task: normalizeQuestion(task.task),
  answers: compactObject({
    values: task.answers.values.map((value) => value ?? ""),
    pictures: normalizeStringArray(task.answers.pictures),
  }),
  correctAnswer: task.correctAnswer ?? "",
  typeOfTask: "choice",
});

const normalizeComparisonTask = (task: Task2): Task2 => ({
  task: normalizeQuestion(task.task),
  comparisonTable: {
    list1: compactObject({
      texts: normalizeStringArray(task.comparisonTable.list1.texts),
      pictures: normalizeStringArray(task.comparisonTable.list1.pictures),
    }),
    list2: compactObject({
      texts: normalizeStringArray(task.comparisonTable.list2.texts),
      pictures: normalizeStringArray(task.comparisonTable.list2.pictures),
    }),
  },
  correctComparison: Object.fromEntries(
    Object.entries(task.correctComparison).map(([key, value]) => [key, value ?? ""]),
  ),
  typeOfTask: "comparison",
});

const normalizeOpenAnswerTask = (task: Task3): Task3 => ({
  task: normalizeQuestion(task.task),
  correctAnswer: task.correctAnswer ?? "",
  typeOfTask: "openAnswer",
});

const normalizeEditableTask = <TTask extends EditableTask>(draft: TTask): TTask => {
  if (draft.typeOfTask === "choice") {
    return normalizeChoiceTask(draft) as TTask;
  }

  if (draft.typeOfTask === "comparison") {
    return normalizeComparisonTask(draft) as TTask;
  }

  return normalizeOpenAnswerTask(draft) as TTask;
};

const collectReferencedFileNames = (task: EditableTask): Set<string> => {
  const fileNames = new Set<string>();
  const addFileName = (value?: string) => {
    if (value) {
      fileNames.add(value);
    }
  };

  addFileName(task.task.picture);

  if (task.typeOfTask === "choice") {
    task.answers.pictures?.forEach(addFileName);
  }

  if (task.typeOfTask === "comparison") {
    task.comparisonTable.list1.pictures?.forEach(addFileName);
    task.comparisonTable.list2.pictures?.forEach(addFileName);
  }

  return fileNames;
};

export const getTopicPath = (typeTest: string) => {
  return typeTest === "main"
    ? "Mix"
    : typeTest === "retaking"
      ? "Retaking"
      : "Garbage";
};

export const uploadVariantFiles = async (
  variantName: string,
  files: File[],
  task: EditableTask,
) => {
  const referencedFileNames = collectReferencedFileNames(task);
  const filesToUpload = files.filter((file) => referencedFileNames.has(file.name));

  if (filesToUpload.length === 0) {
    return;
  }

  await Promise.all(
    filesToUpload.map(async (file) => {
      const fileRef = ref(storage, `${variantName}/${file.name}`);
      await uploadBytes(fileRef, file);
    }),
  );
};

export const saveEditedTask = async <TTask extends EditableTask>({
  draft,
  numTask,
  selectedVariant,
  typeTest,
  files,
  updateTask,
  onSuccess,
}: SaveEditedTaskParams<TTask>) => {
  const normalizedDraft = normalizeEditableTask(draft);

  await uploadVariantFiles(selectedVariant, files, normalizedDraft);

  const taskRef = doc(
    db,
    "Subjects",
    "Math",
    "Algebra",
    "Topics",
    getTopicPath(typeTest),
    selectedVariant,
    "tasks",
    numTask,
  );

  await setDoc(taskRef, normalizedDraft, { merge: true });
  updateTask(numTask, normalizedDraft);
  onSuccess();
};
