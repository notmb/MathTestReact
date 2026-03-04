import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type { Task1, Task2, Task3, Tasks } from "./taskTypes/typeTasks";
import { parseOneTimeParamsFromPathname } from "../shared/oneTime/parseOneTimeParamsFromPathname";
import type { UserAnswersState } from "./oneTimeTest.types";
import TaskList from "./components/tasksList";

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
  const [userAnswers, setUserAnswers] = useState<UserAnswersState>({});
  const [preparedTestResult, setPreparedTestResult] = useState<string | null>(
    null,
  );
  const handleAnswersChange = useCallback((answers: Record<string, any>) => {
    setUserAnswers((prev) => (prev === answers ? prev : answers));
  }, []);
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
      setStatus({
        phase: "loadingLink",
        studentId: status.studentId,
        variantId: status.variantId,
        linkId: status.linkId,
      });

      try {
        const ref = doc(db, "Subjects", "Math", "TestLinks", status.linkId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setStatus({
            phase: "blocked",
            reason: "linkNotFound",
            studentId: status.studentId,
            variantId: status.variantId,
            linkId: status.linkId,
          });
          return;
        }

        const data = snap.data() as TestLinkDoc;
        console.log(data.testLinkStatus);
        if (data.testLinkStatus !== "started") {
          setStatus({
            phase: "blocked",
            reason: `statusNotStarted:${String(data.testLinkStatus)}`,
            studentId: status.studentId,
            variantId: status.variantId,
            linkId: status.linkId,
          });
          return;
        }

        if (!data.startedAt || typeof data.durationSec !== "number") {
          setStatus({
            phase: "blocked",
            reason: "badLinkData",
            studentId: status.studentId,
            variantId: status.variantId,
            linkId: status.linkId,
          });
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
            phase: "finalizing",
            finishReason: "timeOut",
            studentId: status.studentId,
            variantId: status.variantId,
            linkId: status.linkId,
          });
          return;
        }
        // все ок — можемо тягнути variant/tasks

        setStatus({
          phase: "loadingVariant",
          endAtMs,
          variantCollection,
          studentId: status.studentId,
          variantId: status.variantId,
          linkId: status.linkId,
        });
      } catch (e) {
        setStatus({
          phase: "blocked",
          reason: "linkLoadError",
          studentId: status.studentId,
          variantId: status.variantId,
          linkId: status.linkId,
        });
      }
    };
    run();
  }, [status.phase]);
  //<--завантаження TestLink + guard

  //завантаження variant doc -->
  useEffect(() => {
    if (status.phase !== "loadingVariant") return;

    let cancelled = false;

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
          if (cancelled) return;
          setStatus({
            phase: "blocked",
            reason: "variantNotFound",
            studentId: status.studentId,
            variantId: status.variantId,
            linkId: status.linkId,
          });
          return;
        }

        if (cancelled) return;
        setVariantMeta(variantSnap.data() as VariantDoc);

        // ✅ Тут ми поки НЕ переходимо в running — tasks ще не завантажені
      } catch (e) {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "variantLoadError",
          studentId: status.studentId,
          variantId: status.variantId,
          linkId: status.linkId,
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [status.phase]);
  //<--завантаження variant doc

  //loader задач -->
  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    let cancelled = false;
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

        if (cancelled) return;
        setLocalTasks(loaded);
        console.log(localTasks);
      } catch (e) {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "tasksLoadError",
          studentId: status.studentId,
          variantId: status.variantId,
          linkId: status.linkId,
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
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
    const answers = getAnswersForFinalize();
    const testResult = buildTestResultString(answers);
    setPreparedTestResult(testResult);

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

  const getNmtMark = (sum: number): number | string => {
    const map: Record<number, number> = {
      5: 100,
      6: 108,
      7: 115,
      8: 123,
      9: 131,
      10: 134,
      11: 137,
      12: 140,
      13: 143,
      14: 145,
      15: 147,
      16: 148,
      17: 149,
      18: 150,
      19: 151,
      20: 152,
      21: 155,
      22: 159,
      23: 163,
      24: 167,
      25: 170,
      26: 173,
      27: 176,
      28: 180,
      29: 184,
      30: 189,
      31: 194,
      32: 200,
    };
    if (sum < 5) return "point<5, не пройдено";
    return map[sum] ?? "помилка результату";
  };

  const normalizeNumberAnswer = (value: unknown): number | null => {
    if (typeof value !== "string" && typeof value !== "number") return null;
    const num = Number(String(value).replace(",", ".").trim());
    return Number.isFinite(num) ? num : null;
  };

  const scoreComparisonAnswer = (
    correct: Record<string, string>,
    userAnswer: unknown,
  ) => {
    if (!userAnswer || typeof userAnswer !== "object") return 0;

    let score = 0;
    Object.entries(correct).forEach(([key, correctValue]) => {
      const userValue = (userAnswer as Record<string, unknown>)[key];
      if (typeof userValue === "string" && userValue === correctValue) {
        score += 1;
      }
    });

    return score;
  };

  const buildTestResultString = (answers: Record<string, any>) => {
    if (!localTasks) {
      const answeredCount = Object.keys(answers).length;
      return `${answeredCount}/?`;
    }

    let sum = 0;

    Object.entries(localTasks).forEach(([taskId, task]) => {
      const userAnswer = answers[taskId];

      if (isTask1(task)) {
        if (
          typeof userAnswer === "string" &&
          userAnswer === task.correctAnswer
        ) {
          sum += 1;
        }
        return;
      }

      if (isTask2(task)) {
        sum += scoreComparisonAnswer(task.correctComparison, userAnswer);
        return;
      }

      if (isTask3(task)) {
        const correct = normalizeNumberAnswer(task.correctAnswer);
        const user = normalizeNumberAnswer(userAnswer);
        if (correct !== null && user !== null && correct === user) {
          sum += 2;
        }
      }
    });
    console.log(`${sum}/${getNmtMark(sum)}`);
    return `${sum}/${getNmtMark(sum)}`;
  };
  const reasonMessageMap: Record<string, string> = {
    linkNotFound: "Посилання на тест не знайдено.",
    badLinkData: "Дані посилання пошкоджені. Зверніться до викладача.",
    linkLoadError: "Не вдалося завантажити посилання. Спробуйте пізніше.",
    variantNotFound: "Варіант тесту не знайдено.",
    variantLoadError: "Не вдалося завантажити варіант тесту.",
    tasksLoadError: "Не вдалося завантажити завдання.",
    finalizeError: "Не вдалося зберегти результат. Спробуйте ще раз.",
  };

  const getReasonMessage = (reason: string) => {
    if (reason.startsWith("statusNotStarted:")) {
      const value = reason.split(":")[1];

      if (value === "notStarted") return "Тест ще не розпочато.";
      if (value === "finished") return "Це посилання вже завершене.";

      return `Тест недоступний (status: ${value}).`;
    }

    return reasonMessageMap[reason] ?? `Невідома помилка: ${reason}`;
  };

  //effect finalize (транзакція)-->
  useEffect(() => {
    if (status.phase !== "finalizing") return;

    const run = async () => {
      const answers = getAnswersForFinalize();
      const testResult = preparedTestResult ?? buildTestResultString(answers);

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
        setPreparedTestResult(null);

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
  }, [status.phase, storageKey, userAnswers, preparedTestResult]);
  //<--effect finalize (транзакція)

  //<--запис у Firestore + очистка sessionStorage + перехід у done
  return (
    <div>
      <h4>OneTimeTest</h4>
      <p>{status.phase}</p>

      {status.phase === "invalid" && (
        <div>Некоректне посилання: {status.reason}</div>
      )}
      {status.phase === "blocked" && (
        <div>{getReasonMessage(status.reason)}</div>
      )}

      {status.phase === "running" && (
        <div>
          <Countdown endAtMs={status.endAtMs} />
          <TaskList
            tasks={localTasks || EMPTY_TASKS}
            selectedVariant={variantMeta?.variantName || ""}
            initialAnswers={userAnswers}
            onAnswersChange={handleAnswersChange}
          ></TaskList>
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
