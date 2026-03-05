import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { db } from "../../../../../../firebaseConfig";
import type { Tasks } from "../taskTypes/typeTasks";
import { buildResultDetails } from "../utils/oneTimeTestScoring";
import type { PointsForTasks } from "../utils/oneTimeTestScoring";
import {
  normalizeTypeTest,
  type NormalizedTypeTest,
  type Status,
  type VariantDoc,
} from "./useOneTimeFlow.types";

type FinalizePayload = {
  finishReason: "timeOut" | "manual";
  result: string;
  userAnswers: Record<string, unknown>;
  pointsForTasks: PointsForTasks;
  variantId: string;
  variantName: string;
};

type UseOneTimeFinalizeParams = {
  status: Status;
  storageKey?: string;
  preparedTestResult: string | null;
  variantMeta: VariantDoc | null;
  userName?: string;
  linkTypeTest: NormalizedTypeTest | null;
  localTasks: Tasks | null;
  getAnswersForFinalize: () => Record<string, unknown>;
  setPreparedTestResult: Dispatch<SetStateAction<string | null>>;
  setStatus: Dispatch<SetStateAction<Status>>;
};

export const useOneTimeFinalize = ({
  status,
  storageKey,
  preparedTestResult,
  variantMeta,
  userName,
  linkTypeTest,
  localTasks,
  getAnswersForFinalize,
  setPreparedTestResult,
  setStatus,
}: UseOneTimeFinalizeParams) => {
  useEffect(() => {
    if (status.phase !== "finalizing") return;

    let cancelled = false;
    const { studentId, variantId, linkId } = status;

    const run = async () => {
      const answers = getAnswersForFinalize();
      const serialRaw = variantMeta?.variantSerialNumber;
      const serialText =
        serialRaw === undefined || serialRaw === null
          ? ""
          : String(serialRaw).trim();

      if (!variantMeta?.variantName || !serialText || !userName) {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "finalizeMissingData",
          studentId,
          variantId,
          linkId,
        });
        return;
      }

      const normalizedTypeTest =
        normalizeTypeTest(variantMeta.typeTest) ?? linkTypeTest;
      if (!normalizedTypeTest) {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "finalizeBadTypeTest",
          studentId,
          variantId,
          linkId,
        });
        return;
      }

      const resultDetails = buildResultDetails(localTasks, answers);
      const payload: FinalizePayload = {
        finishReason: status.finishReason,
        result: preparedTestResult ?? resultDetails.result,
        userAnswers: answers,
        pointsForTasks: resultDetails.pointsForTasks,
        variantId,
        variantName: variantMeta.variantName,
      };

      const linkRef = doc(db, "Subjects", "Math", "TestLinks", linkId);
      const testResultRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        linkId,
        "testResults",
        userName,
      );
      const studentRef = doc(db, "Subjects", "Math", "MyStudents", studentId);
      const studentResultRef = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        studentId,
        "ResultsTest",
        variantId,
      );

      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(linkRef);
          if (!snap.exists()) throw new Error("linkNotFound");

          const data = snap.data() as { testLinkStatus?: string };
          if (data.testLinkStatus === "finished") return;

          tx.update(linkRef, {
            testLinkStatus: "finished",
            finishedAt: serverTimestamp(),
            finishReason: payload.finishReason,
            testResult: payload.result,
            used: true,
          });

          tx.set(
            testResultRef,
            {
              pointsForTasks: payload.pointsForTasks,
              result: payload.result,
              userAnswers: payload.userAnswers,
              variantId: payload.variantId,
              variantName: payload.variantName,
            },
            { merge: true },
          );
        });

        const topicKey = serialText;
        const summaryUpdate =
          normalizedTypeTest === "retaking"
            ? { testScoresRetaking: { [topicKey]: payload.result } }
            : { testScores: { [topicKey]: payload.result } };

        try {
          await setDoc(studentRef, summaryUpdate, { merge: true });

          const existingStudentResult = await getDoc(studentResultRef);
          const existingVariantName = existingStudentResult.exists()
            ? existingStudentResult.data().variantName
            : undefined;
          const studentResultVariantName =
            typeof existingVariantName === "string" &&
            existingVariantName.trim()
              ? existingVariantName
              : payload.variantName;

          await setDoc(studentResultRef, {
            pointsForTasks: payload.pointsForTasks,
            result: payload.result,
            userAnswers: payload.userAnswers,
            variantId: payload.variantId,
            variantName: studentResultVariantName,
          });
        } catch (studentWriteError) {
          console.warn("Student profile sync skipped:", studentWriteError);
        }

        if (cancelled) return;
        if (storageKey) sessionStorage.removeItem(storageKey);
        setPreparedTestResult(null);
        setStatus({
          phase: "done",
          studentId,
          variantId,
          linkId,
        });
      } catch {
        if (cancelled) return;
        setStatus({
          phase: "blocked",
          reason: "finalizeError",
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
  }, [
    getAnswersForFinalize,
    linkTypeTest,
    localTasks,
    preparedTestResult,
    setPreparedTestResult,
    setStatus,
    status,
    storageKey,
    userName,
    variantMeta,
  ]);
};
