import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseOneTimeParamsFromPathname } from "../../shared/oneTime/parseOneTimeParamsFromPathname";
import type { UserAnswersState } from "../oneTimeTest.types";
import type { Tasks } from "../oneTimeTest.types";
import { buildTestResultString } from "../utils/oneTimeTestScoring";
import { useOneTimeDataLoad } from "./useOneTimeDataLoad";
import { useOneTimeFinalize } from "./useOneTimeFinalize";
import type { NormalizedTypeTest, Status, VariantDoc } from "./useOneTimeFlow.types";

export const useOneTimeTestFlow = () => {
  const [status, setStatus] = useState<Status>({ phase: "loading" });
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [linkTypeTest, setLinkTypeTest] = useState<NormalizedTypeTest | null>(
    null,
  );
  const [variantMeta, setVariantMeta] = useState<VariantDoc | null>(null);
  const [localTasks, setLocalTasks] = useState<Tasks | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswersState>({});
  const [preparedTestResult, setPreparedTestResult] = useState<string | null>(
    null,
  );
  const [finalResult, setFinalResult] = useState<string | null>(null);

  const didHydrateAnswers = useRef(false);

  const parsed = useMemo(
    () => parseOneTimeParamsFromPathname(window.location.pathname),
    [],
  );

  const storageKey =
    status.phase !== "loading" && status.phase !== "invalid"
      ? `oneTimeAnswers:${status.linkId}`
      : undefined;

  const isFinishDisabled =
    status.phase !== "running" || Date.now() >= status.endAtMs;

  const handleAnswersChange = useCallback((answers: UserAnswersState) => {
    setUserAnswers((prev) => (prev === answers ? prev : answers));
  }, []);

  const getAnswersForFinalize = useCallback((): Record<string, unknown> => {
    if (userAnswers && Object.keys(userAnswers).length > 0) return userAnswers;
    if (!storageKey) return {};

    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return {};

    try {
      const parsedAnswers = JSON.parse(raw);
      return parsedAnswers && typeof parsedAnswers === "object"
        ? parsedAnswers
        : {};
    } catch {
      return {};
    }
  }, [storageKey, userAnswers]);

  const toFinalizing = useCallback(
    (
      finishReason: "timeOut" | "manual",
      base: { studentId: string; variantId: string; linkId: string },
    ) => {
      setStatus({
        phase: "finalizing",
        finishReason,
        studentId: base.studentId,
        variantId: base.variantId,
        linkId: base.linkId,
      });
    },
    [],
  );

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

  useOneTimeDataLoad({
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
  });

  useEffect(() => {
    if (status.phase !== "running") return;
    if (!storageKey) return;

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

  const handleFinish = useCallback(() => {
    if (status.phase !== "running") return;

    if (Date.now() >= status.endAtMs) {
      toFinalizing("timeOut", status);
      return;
    }

    const answers = getAnswersForFinalize();
    setPreparedTestResult(buildTestResultString(localTasks, answers));
    toFinalizing("manual", status);
  }, [status, toFinalizing, getAnswersForFinalize, localTasks]);

  useOneTimeFinalize({
    status,
    storageKey,
    preparedTestResult,
    variantMeta,
    userName,
    linkTypeTest,
    localTasks,
    getAnswersForFinalize,
    setFinalResult,
    setPreparedTestResult,
    setStatus,
  });

  return {
    status,
    variantMeta,
    localTasks,
    userAnswers,
    finalResult,
    storageKey,
    isFinishDisabled,
    handleAnswersChange,
    handleFinish,
  };
};


