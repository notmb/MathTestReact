import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import {
  updateDoc,
  serverTimestamp,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import CleatTimer from "./clearTimer";
// typeTest: string; //-
//variantId: string; //-
type TestLinkData = {
  used: boolean; //+
  testLinkStatus: "notStarted" | "started" | "finished"; //+
  startedAt: Timestamp | null; //+
  durationSec: number; //+
};

const OneTimeLink = (props: {
  selectedLink: string;
  navigate: (path: string) => void;
}) => {
  const [testLinkData, updateTestLinkData] = useImmer<TestLinkData | null>(
    null,
  ); //дані лінка

  const [status, setStatus] = useState<"started" | "end" | null>(null);

  //ОТРИМУЄМО ДАНІ ЛІНКА
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
      );
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const raw = docSnap.data();
          //робимо конкретну типізацію
          const data: TestLinkData = {
            used: raw.used ?? false,
            testLinkStatus: raw.testLinkStatus ?? "notStarted",
            startedAt: raw.startedAt ?? null, // ⭐️ головне
            durationSec: raw.durationSec ?? 3600,
          };

          updateTestLinkData(data);
          //робимо конкретну типізацію
        } else {
          console.warn("Документ не знайдено");
        }
      } catch (error) {
        console.error("Помилка створення:", error);
      }
    };

    fetchData();
  }, []);
  //ОТРИМУЄМО ДАНІ ЛІНКА
  console.log(testLinkData);
  const runningTheTest = (idTest: string) => {
    props.navigate(`/MathTestReact/${idTest}/one-time-link/one-time-test`);
  };
  const updateFirebaseData = async () => {
    try {
      const linkDataRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
      );

      await updateDoc(linkDataRef, {
        testLinkStatus: "started",
        startedAt: serverTimestamp(),
      });

      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  const handleStartTest = async () => {
    try {
      await updateFirebaseData();

      setStatus("started"); // Локальний стейт -> тест розпочато -> запустити таймер

      runningTheTest(props.selectedLink);
    } catch (e) {
      console.error(e);
      alert("Не вдалося почати тест. Спробуйте ще раз.");
    }
  };

  const handleContinueTest = () => {
    setStatus("started");
    runningTheTest(props.selectedLink);
  };

  return (
    <div>
      {testLinkData?.used === false && (
        <div>
          {testLinkData.testLinkStatus === "notStarted" && (
            <div className="container_for_start_continue_test">
              <h2>У вас є 60 хвилин для проходження тесту</h2>
              <button
                type="button"
                className="custom_button"
                onClick={() => handleStartTest()}
              >
                Почати тест
              </button>
            </div>
          )}

          {testLinkData.testLinkStatus === "started" &&
            testLinkData.startedAt && (
              <div className="container_for_start_continue_test">
                <div className="containr_for_time_infirmation">
                  <h2 className="m-0">У вас залишилось</h2>
                  <CleatTimer
                    startedAt={testLinkData.startedAt}
                    durationSec={testLinkData.durationSec}
                  ></CleatTimer>
                  <h2 className="m-0">часу до завершення тесту</h2>
                </div>
                <button
                  type="button"
                  className="custom_button"
                  onClick={() => handleContinueTest()}
                >
                  Продовжити Тест
                </button>
              </div>
            )}

          {testLinkData.testLinkStatus === "finished" && (
            <p>Ваш тест неактивний</p>
          )}
        </div>
      )}

      {testLinkData?.used === true && (
        <div className="">
          <h2>Тест пройдений</h2>
        </div>
      )}
    </div>
  );
};
export default OneTimeLink;
