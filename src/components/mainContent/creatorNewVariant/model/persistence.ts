import type { CreateVariantPayload, SaveTaskPayload } from "./types";
import { db } from "../../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

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

  await setDoc(
    taskDocument,
    {
      taskNumber: payload.taskNumber,
      typeOfTask: payload.typeOfTask,
      typeTest: payload.typeTest,
      taskData: payload.taskData,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
