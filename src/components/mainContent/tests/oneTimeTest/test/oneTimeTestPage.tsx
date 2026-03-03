import { useEffect, useMemo, useRef, useState } from "react";
import {
  doc,
  runTransaction,
  serverTimestamp,
  getDoc,
  Timestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import { parseOneTimeParamsFromPathname } from "../functions";
import type { Task1, Task2, Task3, Tasks } from "../../../types";
import MathTest from "../../mathTests";
import React from "react";

type BaseParsed = { studentId: string; variantId: string; linkId: string };

type Status =
  | { phase: "loading" }
  | { phase: "invalid"; reason: string }
  | ({ phase: "parsed" } & BaseParsed)
  | ({ phase: "loadingLink" } & BaseParsed)
  | ({ phase: "blocked"; reason: string } & BaseParsed)
  | ({ phase: "loadingVariant" } & BaseParsed & {
        endAtMs: number;
        variantCollection: "Mix" | "Retaking";
      })
  | ({ phase: "running" } & BaseParsed & {
        endAtMs: number;
        variantCollection: "Mix" | "Retaking";
      })
  | ({ phase: "finalizing"; finishReason: "timeOut" | "manual" } & BaseParsed)
  | ({ phase: "done" } & BaseParsed);

type TestLinkDoc = {
  testLinkStatus: "notStarted" | "started" | "finished" | string;
  startedAt?: import("firebase/firestore").Timestamp;
  durationSec?: number;
  typeTest?: "main" | "retaking" | string; // <-

  // необов'язково, але є у тебе:
  finishReason?: "timeOut" | "manual" | string;
  finishedAt?: Timestamp;
  used?: boolean;
  variantId?: string;
};

type VariantDoc = {
  createdAt?: any;
  numberOfTask?: number;
  typeTest?: string;
  variantName?: string;
  variantSerialNumber?: number | string;
};

const OneTimeTest = (props: { navigate: (path: string) => void }) => {
  //State / “фази” (щоб не було хаосу)-->
  const [status, setStatus] = useState<Status>({ phase: "loading" });
  //<--State / “фази” (щоб не було хаосу)

  const [variantMeta, setVariantMeta] = useState<VariantDoc | null>(null);
  const [localTasks, setLocalTasks] = useState<Tasks | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  // const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const EMPTY_TASKS = {};

  const parsed = useMemo(
    () => parseOneTimeParamsFromPathname(window.location.pathname),
    [],
  );

  const storageKey =
    status.phase !== "loading" && status.phase !== "invalid"
      ? `oneTimeAnswers:${status.linkId}`
      : undefined;

  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";

  //Вхід і базові константи-->
  useEffect(() => {
    if (!parsed.ok) {
      setStatus({ phase: "invalid", reason: parsed.reason });
      return;
    }
    setStatus({
      phase: "parsed",
      studentId: parsed.studentId,
      variantId: parsed.variantId,
      linkId: parsed.linkId,
    });
  }, [parsed]);
  //<--Вхід і базові константи

  //завантаження TestLink + guard -->
  useEffect(() => {
    if (status.phase !== "parsed") return;

    const run = async () => {
      // переходимо у loadingLink (але зберігаємо BaseParsed)
      setStatus({ ...status, phase: "loadingLink" });
      console.log("2");
      try {
        const ref = doc(db, "Subjects", "Math", "TestLinks", status.linkId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setStatus({ ...status, phase: "blocked", reason: "linkNotFound" });
          return;
        }

        const data = snap.data() as TestLinkDoc;
        console.log(data.testLinkStatus);
        if (data.testLinkStatus !== "started") {
          setStatus({
            ...status,
            phase: "blocked",
            reason: `statusNotStarted:${String(data.testLinkStatus)}`,
          });
          return;
        }
        console.log("2");

        if (!data.startedAt || typeof data.durationSec !== "number") {
          setStatus({ ...status, phase: "blocked", reason: "badLinkData" });
          return;
        }

        // визначаємо джерело варіанту/тасків
        // Логіка: main => Mix, все інше => Retaking
        const variantCollection: "Mix" | "Retaking" =
          data.typeTest === "retaking" ? "Retaking" : "Mix";

        const endAtMs = data.startedAt.toMillis() + data.durationSec * 1000;

        // якщо час вже вийшов — одразу на finalize (далі ми напишемо finalize effect)
        if (Date.now() >= endAtMs) {
          setStatus({
            ...status,
            phase: "finalizing",
            finishReason: "timeOut",
          });
          return;
        }
        // все ок — можемо тягнути variant/tasks

        setStatus({
          ...status,
          phase: "loadingVariant",
          endAtMs,
          variantCollection,
        });
      } catch (e) {
        setStatus({ ...status, phase: "blocked", reason: "linkLoadError" });
      }
    };
    run();
  }, [status.phase]);
  //<--завантаження TestLink + guard

  //завантаження variant doc -->
  useEffect(() => {
    if (status.phase !== "loadingVariant") return;

    const run = async () => {
      try {
        const variantRef = doc(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          status.variantCollection, // "Mix" | "Retaking"
          status.variantId,
        );

        const variantSnap = await getDoc(variantRef);

        if (!variantSnap.exists()) {
          setStatus({ ...status, phase: "blocked", reason: "variantNotFound" });
          return;
        }

        setVariantMeta(variantSnap.data() as VariantDoc);

        // ✅ Тут ми поки НЕ переходимо в running — tasks ще не завантажені
      } catch (e) {
        setStatus({ ...status, phase: "blocked", reason: "variantLoadError" });
      }
    };

    run();
  }, [status.phase]);
  //<--завантаження variant doc

  //loader задач -->
  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    const run = async () => {
      try {
        const taskCollectionRef = collection(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          status.variantCollection,
          status.variantId,
          "tasks",
        );

        const collSnap = await getDocs(taskCollectionRef);
        const loaded: Tasks = {};

        collSnap.forEach((d) => {
          const data = d.data();

          if (isTask1(data)) loaded[d.id] = data as Task1;
          else if (isTask2(data)) loaded[d.id] = data as Task2;
          else if (isTask3(data)) loaded[d.id] = data as Task3;
          else console.warn(`Невідомий тип завдання (ID: ${d.id})`, data);
        });

        setLocalTasks(loaded);
        console.log("2");
        console.log(localTasks);
      } catch (e) {
        setStatus({ ...status, phase: "blocked", reason: "tasksLoadError" });
      }
    };

    run();
  }, [status.phase]);
  //<--loader задач

  // ПОТРЕБУЄ УТОЧНЕННЯ -->

  //ініціалізація answers із sessionStorage-->
  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    if (!storageKey) return;

    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setUserAnswers(parsed);
      }
    } catch {
      // битий JSON — ігноруємо
    }
  }, [status.phase, storageKey]);
  //<--ініціалізація answers із sessionStorage

  //<-- ПОТРЕБУЄ УТОЧНЕННЯ

  useEffect(() => {
    console.log(localTasks);
  }, [localTasks]);

  //перехід у running фазу-->
  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    if (!variantMeta) return;
    if (!localTasks) return;

    setStatus({
      ...status,
      phase: "running",
      endAtMs: status.endAtMs,
      variantCollection: status.variantCollection,
    });
  }, [status.phase, variantMeta, localTasks]);
  //<--перехід у running фазу

  //таймер->>
  // useEffect(() => {
  //   if (status.phase !== "running") return;

  //   let cancelled = false;

  //   const compute = () => {
  //     const s = Math.max(0, Math.floor((status.endAtMs - Date.now()) / 1000));
  //     return s;
  //   };

  //   // одразу поставимо початкове значення
  //   // setSecondsLeft(compute());

  //   const id = window.setInterval(() => {
  //     if (cancelled) return;

  //     // const s = compute();
  //     // setSecondsLeft(s);

  //     if (s <= 0) {
  //       window.clearInterval(id);

  //       // ⚠️ перехід фази: робимо новий об’єкт (без ...status)
  //       setStatus({
  //         phase: "finalizing",
  //         finishReason: "timeOut",
  //         studentId: status.studentId,
  //         variantId: status.variantId,
  //         linkId: status.linkId,
  //       });
  //     }
  //   }, 1000);

  //   return () => {
  //     cancelled = true;
  //     window.clearInterval(id);
  //   };
  // }, [status.phase]);
  //<--таймер

  //автозбереження відповідей у sessionStorage-->
  const didHydrateAnswers = useRef(false);

  useEffect(() => {
    if (status.phase !== "running") return;
    if (!storageKey) return;

    // пропускаємо перший прохід після входу в running
    if (!didHydrateAnswers.current) {
      didHydrateAnswers.current = true;
      return;
    }

    try {
      sessionStorage.setItem(storageKey, JSON.stringify(userAnswers));
    } catch (e) {
      console.warn("sessionStorage save failed", e);
    }
  }, [status.phase, storageKey, userAnswers]);
  //<--автозбереження відповідей у sessionStorage

  useEffect(() => {
    console.log(userAnswers);
  }, [userAnswers]);

  //кнопка “Завершити”-->
  const handleFinish = () => {
    if (status.phase !== "running") return;

    setStatus({
      phase: "finalizing",
      finishReason: "manual",
      studentId: status.studentId,
      variantId: status.variantId,
      linkId: status.linkId,
    });
  };
  //<--кнопка “Завершити”

  //запис у Firestore + очистка sessionStorage + перехід у done-->
  const getAnswersForFinalize = (): Record<string, any> => {
    // 1) якщо в state щось є — беремо його
    if (userAnswers && Object.keys(userAnswers).length > 0) return userAnswers;

    // 2) fallback з sessionStorage
    if (!storageKey) return {};
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return {};

    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const buildTestResultString = (answers: Record<string, any>) => {
    // TODO: тут буде реальний підрахунок балів
    const answeredCount = Object.keys(answers).length;
    return `${answeredCount}/?`;
  };

  //effect finalize (транзакція)-->
  useEffect(() => {
    if (status.phase !== "finalizing") return;

    const run = async () => {
      const answers = getAnswersForFinalize();
      const testResult = buildTestResultString(answers);

      const linkRef = doc(db, "Subjects", "Math", "TestLinks", status.linkId);

      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(linkRef);

          if (!snap.exists()) {
            throw new Error("linkNotFound");
          }

          const data = snap.data() as { testLinkStatus?: string };

          // якщо вже finished — не перезаписуємо
          if (data.testLinkStatus === "finished") return;

          tx.update(linkRef, {
            testLinkStatus: "finished",
            finishedAt: serverTimestamp(),
            finishReason: status.finishReason, // "manual" | "timeOut"
            testResult,
          });
        });

        // очистка sessionStorage
        if (storageKey) sessionStorage.removeItem(storageKey);

        // ✅ перехід у done (без ...status)
        setStatus({
          phase: "done",
          studentId: status.studentId,
          variantId: status.variantId,
          linkId: status.linkId,
        });
      } catch (e) {
        // якщо треба — можна зробити phase "blocked"/"invalid"/"error"
        setStatus({
          phase: "blocked",
          reason: "finalizeError",
          studentId: status.studentId,
          variantId: status.variantId,
          linkId: status.linkId,
        });
      }
    };

    run();
  }, [status.phase, storageKey, userAnswers]);
  //<--effect finalize (транзакція)
  console.log("2");
  //<--запис у Firestore + очистка sessionStorage + перехід у done
  return (
    <div>
      <h4>OneTimeTest</h4>
      <p>{status.phase}</p>

      {status.phase === "running" && (
        <div>
          <Countdown endAtMs={status.endAtMs} />
          <MathTest
            tasks={localTasks || EMPTY_TASKS}
            selectedVariant={variantMeta?.variantName || ""}
          ></MathTest>
        </div>
      )}
      {status.phase === "running" && storageKey && (
        <pre>{sessionStorage.getItem(storageKey) ?? "нічого нема"}</pre>
      )}
      {status.phase === "running" && (
        <button
          type="button"
          className="custom_button"
          onClick={handleFinish}
          // disabled={secondsLeft !== null && secondsLeft <= 0}
        >
          Завершити
        </button>
      )}
      {status.phase === "finalizing" && <div>Зберігаємо результат...</div>}
      {status.phase === "done" && <div>Готово ✅</div>}
    </div>
  );
};
export default OneTimeTest;

const Countdown = React.memo(function Countdown(props: { endAtMs: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.ceil((props.endAtMs - Date.now()) / 1000));
      setSecondsLeft(left);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [props.endAtMs]);

  return <div>Залишилось: {secondsLeft ?? "..."}</div>;
});
