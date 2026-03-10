import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { db } from "../../../../../../firebaseConfig";
import type { UserAnswersState } from "../oneTimeTest.types";
import type { Tasks } from "../oneTimeTest.types";
import {
  isTask1,
  isTask2,
  isTask3,
  normalizeTypeTest,
  type NormalizedTypeTest,
  type Status,
  type TestLinkDoc,
  type VariantDoc,
} from "./useOneTimeFlow.types";

type UseOneTimeDataLoadParams = {
  status: Status;
  storageKey?: string;
  variantMeta: VariantDoc | null;
  localTasks: Tasks | null;
  setStatus: Dispatch<SetStateAction<Status>>;
  setUserName: Dispatch<SetStateAction<string | undefined>>;
  setLinkTypeTest: Dispatch<SetStateAction<NormalizedTypeTest | null>>;
  setVariantMeta: Dispatch<SetStateAction<VariantDoc | null>>;
  setLocalTasks: Dispatch<SetStateAction<Tasks | null>>;
  setUserAnswers: Dispatch<SetStateAction<UserAnswersState>>;
  toFinalizing: (
    finishReason: "timeOut" | "manual",
    base: { studentId: string; variantId: string; linkId: string },
  ) => void;
};

export const useOneTimeDataLoad = ({
  status,
  storageKey,
  variantMeta,
  localTasks,
  setStatus,
  setUserName,
  setLinkTypeTest,
  setVariantMeta,
  setLocalTasks,
  setUserAnswers,
  toFinalizing,
}: UseOneTimeDataLoadParams) => {
  useEffect(() => {
    if (status.phase !== "parsed") return;
    const { studentId, variantId, linkId } = status;

    const run = async () => {
      setStatus({
        phase: "loadingLink",
        studentId,
        variantId,
        linkId,
      });

      try {
        const ref = doc(db, "Subjects", "Math", "TestLinks", linkId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setStatus({
            phase: "blocked",
            reason: "linkNotFound",
            studentId,
            variantId,
            linkId,
          });
          return;
        }

        const data = snap.data() as TestLinkDoc;
        setUserName(data.nameStudent);
        setLinkTypeTest(normalizeTypeTest(data.typeTest));

        if (data.testLinkStatus !== "started") {
          setStatus({
            phase: "blocked",
            reason: `statusNotStarted:${String(data.testLinkStatus)}`,
            studentId,
            variantId,
            linkId,
          });
          return;
        }

        if (!data.startedAt || typeof data.durationSec !== "number") {
          setStatus({
            phase: "blocked",
            reason: "badLinkData",
            studentId,
            variantId,
            linkId,
          });
          return;
        }

        const variantCollection: "Mix" | "Retaking" =
          data.typeTest === "retaking" ? "Retaking" : "Mix";
        const endAtMs = data.startedAt.toMillis() + data.durationSec * 1000;

        if (Date.now() >= endAtMs) {
          toFinalizing("timeOut", { studentId, variantId, linkId });
          return;
        }

        setStatus({
          phase: "loadingVariant",
          endAtMs,
          variantCollection,
          studentId,
          variantId,
          linkId,
        });
      } catch {
        setStatus({
          phase: "blocked",
          reason: "linkLoadError",
          studentId,
          variantId,
          linkId,
        });
      }
    };

    run();
  }, [status, setLinkTypeTest, setStatus, setUserName, toFinalizing]);

  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    let cancelled = false;

    const { studentId, variantId, linkId, variantCollection } = status;
    const run = async () => {
      try {
        const variantRef = doc(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          variantCollection,
          variantId,
        );
        const variantSnap = await getDoc(variantRef);

        if (!variantSnap.exists()) {
          if (cancelled) return;
          setStatus({
            phase: "blocked",
            reason: "variantNotFound",
            studentId,
            variantId,
            linkId,
          });
          return;
        }

        if (cancelled) return;
        setVariantMeta(variantSnap.data() as VariantDoc);
      } catch {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "variantLoadError",
          studentId,
          variantId,
          linkId,
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [setStatus, setVariantMeta, status]);

  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    let cancelled = false;

    const { studentId, variantId, linkId, variantCollection } = status;
    const run = async () => {
      try {
        const taskCollectionRef = collection(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          variantCollection,
          variantId,
          "tasks",
        );
        const collSnap = await getDocs(taskCollectionRef);
        const loaded: Tasks = {};

        collSnap.forEach((d) => {
          const data = d.data();

          if (isTask1(data)) loaded[d.id] = data;
          else if (isTask2(data)) loaded[d.id] = data;
          else if (isTask3(data)) loaded[d.id] = data;
          else console.warn(`Unknown task type (ID: ${d.id})`, data);
        });

        if (cancelled) return;
        setLocalTasks(loaded);
      } catch {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "tasksLoadError",
          studentId,
          variantId,
          linkId,
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [setLocalTasks, setStatus, status]);

  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    if (!storageKey) return;

    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsedAnswers = JSON.parse(raw);
      if (parsedAnswers && typeof parsedAnswers === "object") {
        setUserAnswers(parsedAnswers);
      }
    } catch {
      // ignore broken JSON
    }
  }, [setUserAnswers, status.phase, storageKey]);

  useEffect(() => {
    if (status.phase !== "loadingVariant") return;
    if (!variantMeta || !localTasks) return;

    setStatus({
      phase: "running",
      endAtMs: status.endAtMs,
      variantCollection: status.variantCollection,
      studentId: status.studentId,
      variantId: status.variantId,
      linkId: status.linkId,
    });
  }, [localTasks, setStatus, status, variantMeta]);

  useEffect(() => {
    if (status.phase !== "running") return;

    const leftMs = status.endAtMs - Date.now();
    if (leftMs <= 0) {
      toFinalizing("timeOut", status);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      toFinalizing("timeOut", status);
    }, leftMs);

    return () => window.clearTimeout(timeoutId);
  }, [status, toFinalizing]);
};


