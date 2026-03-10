import "../styleOneTime.css";
import { useEffect, useMemo, useState } from "react";
import {
  fetchTestLinkData,
  TestLinkData,
  startTestTransaction,
} from "../shared/functions";
import { parseOneTimeParamsFromPathname } from "../shared/oneTime/parseOneTimeParamsFromPathname";

const statusLabel: Record<TestLinkData["testLinkStatus"], string> = {
  notStarted: "Тест готовий до старту",
  started: "Тест уже розпочато",
  finished: "Тест завершено",
};

const OneTimeLink = (props: { navigate: (path: string) => void }) => {
  const [status, setStatus] = useState<
    | { phase: "loading" }
    | { phase: "invalid"; reason: string }
    | { phase: "ok"; studentId: string; variantId: string; linkId: string }
  >({ phase: "loading" });

  const [data, setData] = useState<TestLinkData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const parsed = useMemo(
    () => parseOneTimeParamsFromPathname(window.location.pathname),
    [],
  );

  useEffect(() => {
    if (!parsed.ok) {
      setStatus({ phase: "invalid", reason: parsed.reason });
      return;
    }
    setStatus({
      phase: "ok",
      studentId: parsed.studentId,
      variantId: parsed.variantId,
      linkId: parsed.linkId,
    });
  }, [parsed]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    if (status.phase !== "ok") return;

    (async () => {
      try {
        const d = await fetchTestLinkData(status.linkId);
        if (!cancelled) setData(d);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status.phase, status.phase === "ok" && status.linkId]);

  const runningTheTest = (linkId: string) => {
    props.navigate(`/MathTestReact/${linkId}/one-time-link/one-time-test`);
  };

  const handleStartTest = async () => {
    if (status.phase !== "ok") return;
    try {
      setStarting(true);
      await startTestTransaction(status.linkId);
      runningTheTest(status.linkId);
    } catch (e: any) {
      alert(e?.message ?? "Не вдалося почати тест. Спробуйте ще раз.");
    } finally {
      setStarting(false);
    }
  };

  const handleContinueTest = () => {
    if (status.phase !== "ok") return;
    runningTheTest(status.linkId);
  };

  if (status.phase === "loading") {
    return (
      <div className="one-time-test-page one-time-link-page">
        <h4 className="one-time-test-title one-time-link-title">
          One-time link
        </h4>
        <div className="one-time-test-status one-time-test-status-progress">
          Перевіряю посилання...
        </div>
      </div>
    );
  }

  if (status.phase === "invalid") {
    return (
      <div className="one-time-test-page one-time-link-page">
        <h4 className="one-time-test-title one-time-link-title">
          One-time link
        </h4>
        <div className="one-time-test-status one-time-test-status-invalid">
          Посилання недійсне: {status.reason}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="one-time-test-page one-time-link-page">
        <h4 className="one-time-test-title one-time-link-title">
          One-time link
        </h4>
        <div className="one-time-test-status one-time-test-status-blocked">
          Помилка читання лінка: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="one-time-test-page one-time-link-page">
        <h4 className="one-time-test-title one-time-link-title">
          One-time link
        </h4>
        <div className="one-time-test-status one-time-test-status-progress">
          Завантажую дані тесту...
        </div>
      </div>
    );
  }

  return (
    <div className="one-time-test-page one-time-link-page">
      <div className="one-time-link-card">
        <div className="one-time-link-meta">
          <div>
            <span className="one-time-link-meta-label">Stusent:</span>{" "}
            {data.nameStudent}
          </div>
        </div>

        <div className="one-time-link-state">
          <span className="one-time-link-state-chip">
            {statusLabel[data.testLinkStatus]}
          </span>
        </div>

        {data.testLinkStatus === "notStarted" && (
          <div className="one-time-link-actions">
            <button
              type="button"
              className="custom-button one-time-test-finish"
              onClick={handleStartTest}
              disabled={starting}
            >
              {starting ? "Починаю..." : "Почати тест"}
            </button>
          </div>
        )}

        {data.testLinkStatus === "started" && (
          <div className="one-time-link-actions">
            <button
              type="button"
              className="custom-button one-time-test-finish"
              onClick={handleContinueTest}
            >
              Продовжити тест
            </button>
          </div>
        )}

        {data.testLinkStatus === "finished" && (
          <div className="one-time-test-status one-time-test-status-done">
            Тест вже завершено.
          </div>
        )}
      </div>
    </div>
  );
};

export default OneTimeLink;

