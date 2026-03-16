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

export const getTopicPath = (typeTest: string) => {
  return typeTest === "main" ? "Mix" : typeTest === "retaking" ? "Retaking" : "Garbage";
};

export const uploadVariantFiles = async (
  variantName: string,
  files: File[],
) => {
  if (files.length === 0) {
    return;
  }

  await Promise.all(
    files.map(async (file) => {
      const fileRef = ref(storage, `${variantName}/${file.name}`);
      await uploadBytes(fileRef, file);
    }),
  );
};

export const removeUndefinedFields = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedFields(item)) as T;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);

    return Object.fromEntries(
      entries.map(([key, item]) => [key, removeUndefinedFields(item)]),
    ) as T;
  }

  return value;
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
  await uploadVariantFiles(selectedVariant, files);

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

  const normalizedDraft = removeUndefinedFields(draft);

  await setDoc(taskRef, normalizedDraft);
  updateTask(numTask, normalizedDraft);
  onSuccess();
};
