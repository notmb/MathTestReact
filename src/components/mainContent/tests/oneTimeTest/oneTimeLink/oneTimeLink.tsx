import { useEffect, useMemo, useState } from "react";
import {
  parseOneTimeParamsFromPathname,
  fetchTestLinkData,
  TestLinkData,
  startTestTransaction,
} from "../functions";

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

  // Далі (наступний крок) тут буде:
  // 1) read TestLinks/{linkId}

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

  // 2) показати "посилання недійсне" / "вже завершено" / "продовжити"
  // 3) транзакція на старт (якщо notStarted)
  const runningTheTest = (linkId: string) => {
    props.navigate(`/MathTestReact/${linkId}/one-time-link/one-time-test`);
  };

  const handleStartTest = async () => {
    if (status.phase !== "ok") return;
    try {
      setStarting(true);
      await startTestTransaction(status.linkId);
      // після успішного старту — переходимо
      runningTheTest(status.linkId);
    } catch (e: any) {
      console.log(e);
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
    return <div>Перевіряю посилання…</div>;
  }
  if (status.phase === "invalid") {
    return (
      <div>
        <div>Посилання недійсне.</div>
        <div style={{ opacity: 0.7 }}>{status.reason}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <div>Помилка при читанні лінка.</div>
        <div style={{ opacity: 0.7 }}>{error}</div>
      </div>
    );
  }
  if (!data) {
    return <div>Завантажую дані тесту…</div>;
  }

  // тимчасово показуємо, що саме спарсилось
  return (
    <div>
      <div>OK ✅</div>
      <div>studentId: {status.studentId}</div>
      <div>variantId: {status.variantId}</div>
      <div>linkId: {status.linkId}</div>

      <hr />

      <div>TestLinkData:</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data.testLinkStatus === "notStarted" && (
        <>
          <p>Тест готовий до старту.</p>
          <button
            type="button"
            className="custom_button"
            onClick={handleStartTest}
            disabled={starting}
          >
            {starting ? "Починаю…" : "Почати тест"}
          </button>
        </>
      )}

      {data.testLinkStatus === "started" && (
        <>
          <p>Тест уже розпочато.</p>
          <button
            type="button"
            className="custom_button"
            onClick={handleContinueTest}
          >
            Продовжити тест
          </button>
        </>
      )}
      {data.testLinkStatus === "finished" && (
        <>
          <p>Тест завершено.</p>
        </>
      )}
    </div>
  );
};
export default OneTimeLink;
