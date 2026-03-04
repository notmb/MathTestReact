import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export type TestLinkData = {
  used: boolean;
  testLinkStatus: "notStarted" | "started" | "finished";
  startedAt: Timestamp | null;
  durationSec: number;
};

function isValidStatus(x: any): x is TestLinkData["testLinkStatus"] {
  return x === "notStarted" || x === "started" || x === "finished";
}

function parseTestLinkData(raw: any): TestLinkData {
  // мінімальна перевірка, щоб не ловити "undefined" далі в логіці
  const used = !!raw?.used;

  const testLinkStatus = raw?.testLinkStatus;
  if (!isValidStatus(testLinkStatus)) {
    throw new Error(`Invalid testLinkStatus: ${String(testLinkStatus)}`);
  }

  const startedAtRaw = raw?.startedAt;
  const startedAt =
    startedAtRaw === null || startedAtRaw === undefined
      ? null
      : startedAtRaw instanceof Timestamp
        ? startedAtRaw
        : (() => {
            throw new Error("startedAt must be Timestamp or null");
          })();

  const durationSec = raw?.durationSec;
  if (
    typeof durationSec !== "number" ||
    !Number.isFinite(durationSec) ||
    durationSec <= 0
  ) {
    throw new Error(`Invalid durationSec: ${String(durationSec)}`);
  }

  return { used, testLinkStatus, startedAt, durationSec };
}

export async function fetchTestLinkData(linkId: string): Promise<TestLinkData> {
  if (!linkId) throw new Error("linkId is empty");

  const ref = doc(db, "Subjects", "Math", "TestLinks", linkId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Test link not found");
  }

  return parseTestLinkData(snap.data());
}

// handleStartTest() (тільки для notStarted): робить транзакцію старту
export async function startTestTransaction(linkId: string): Promise<void> {
  const ref = doc(db, "Subjects", "Math", "TestLinks", linkId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      throw new Error("Посилання не знайдено");
    }
    const data = snap.data() as any;
    const status = data?.testLinkStatus;

    if (status === "finished") {
      throw new Error("Тест уже завершено.");
    }

    if (status === "started") {
      // Вже стартували раніше — нічого не змінюємо
      return;
    }

    if (status !== "notStarted") {
      console.log(status);
      throw new Error("Некоректний стан посилання.");
    }

    // notStarted -> старт
    tx.update(ref, { testLinkStatus: "started", startedAt: serverTimestamp() });
  });
}
