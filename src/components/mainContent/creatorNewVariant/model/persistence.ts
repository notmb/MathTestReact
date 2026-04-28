import type { CreateVariantPayload, SaveTaskPayload } from "./types";
import { db, storage } from "../../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export type CreateVariantResult = {
  variantId: string;
};

const TASKS_COLLECTION_NAME = "tasks";

const VARIANTS_COLLECTION_PATH = [
  "Subjects",
  "Math",
  "Algebra",
  "Topics",
  "Garbage",
] as const;

const collectReferencedFileNames = (payload: SaveTaskPayload): Set<string> => {
  const fileNames = new Set<string>();
  const { taskData } = payload;
  const addFileName = (value?: string) => {
    if (!value) {
      return;
    }

    fileNames.add(value);
  };

  addFileName(taskData.task.picture);

  if (taskData.typeOfTask === "choice") {
    taskData.answers.pictures?.forEach(addFileName);
  }

  if (taskData.typeOfTask === "comparison") {
    taskData.comparisonTable.list1.pictures?.forEach(addFileName);
    taskData.comparisonTable.list2.pictures?.forEach(addFileName);
  }

  return fileNames;
};

const uploadTaskFiles = async (payload: SaveTaskPayload) => {
  const referencedFileNames = collectReferencedFileNames(payload);
  const filesToUpload =
    payload.files?.filter((file) => referencedFileNames.has(file.name)) ?? [];

  await Promise.all(
    filesToUpload.map((file) =>
      uploadBytes(ref(storage, `${payload.variantId}/${file.name}`), file),
    ),
  );
};

const normalizeCreateVariantPayload = (
  payload: CreateVariantPayload,
): CreateVariantPayload => ({
  variantName: payload.variantName.trim(),
  variantSerialNumber: payload.variantSerialNumber.trim(),
  numberOfTasks: payload.numberOfTasks.trim(),
  typeTest: payload.typeTest,
});

export const createVariant = async (
  payload: CreateVariantPayload,
): Promise<CreateVariantResult> => {
  const normalizedPayload = normalizeCreateVariantPayload(payload);
  const variantsCollection = collection(db, ...VARIANTS_COLLECTION_PATH);
  const createdVariant = await addDoc(variantsCollection, {
    variantName: normalizedPayload.variantName,
    variantSerialNumber: normalizedPayload.variantSerialNumber,
    numberOfTasks: normalizedPayload.numberOfTasks,
    typeTest: normalizedPayload.typeTest,
    createdAt: serverTimestamp(),
  });

  return {
    variantId: createdVariant.id,
  };
};

export const saveTask = async (payload: SaveTaskPayload): Promise<void> => {
  const taskDocument = doc(
    db,
    ...VARIANTS_COLLECTION_PATH,
    payload.variantId,
    TASKS_COLLECTION_NAME,
    payload.taskNumber,
  );

  await uploadTaskFiles(payload);

  await setDoc(
    taskDocument,
    {
      updatedAt: serverTimestamp(),
      ...payload.taskData,
    },
    { merge: true },
  );
};
