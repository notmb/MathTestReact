import { useState } from "react";
import "./addTask.css";
import { db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const AddTask = () => {
  const [question, setQuestion] = useState<string>("");
  const [pictureForTask, setPictureForTask] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [pictureForAnswers, setpictureForAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value); // Оновлюємо стан 'question' на введене значення
  };

  const handlePictureForQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPictureForTask(e.target.value); // Оновлюємо стан 'imgForTask' на введене значення
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers(e.target.value.split(",")); // Оновлюємо стан 'imgForTask' на введене значення
  };

  const handlepictureForAnswersChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setpictureForAnswers(e.target.value.split(",")); // Оновлюємо стан 'imgForTask' на введене значення
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCorrectAnswer(e.target.value); // Оновлюємо стан 'question' на введене значення
  };

  // Функція, яка викликається при натисканні на кнопку "Надіслати"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Зупиняємо стандартну поведінку форми (перезавантаження сторінки)

    try {
      // Додаємо новий документ до колекції "users" в Firebase Firestore
      const docRef = doc(db, "tasks", "4");

      await setDoc(docRef, {
        question: question,
        pictureForTask: pictureForTask,
        answers: answers,
        pictureForAnswers: pictureForAnswers,
        correctAnswer: correctAnswer,
      });
      console.log("Документ збережено з ID:", docRef.id); // Виводимо ідентифікатор документа у консоль
    } catch (error) {
      console.error("Помилка при збереженні документа:", error); // Виводимо помилку, якщо щось пішло не так
    }

    // Очищаємо поля форми після відправки
    setQuestion(""); // Скидаємо значення
    setPictureForTask("");
    setAnswers([]); // Скидаємо значення
    setpictureForAnswers([]);
    setCorrectAnswer("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Завдання:
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
            />
          </label>
        </div>
        <div>
          <label>
            Назва фото до завдання
            <input
              type="text"
              value={pictureForTask}
              onChange={handlePictureForQuestionChange}
            />
          </label>
        </div>
        <div>
          <label>
            Відповіді:
            <input type="text" value={answers} onChange={handleAnswerChange} />
          </label>
        </div>
        <div>
          <label>
            Фото до відповідей:
            <input
              type="text"
              value={pictureForAnswers}
              onChange={handlepictureForAnswersChange}
            />
          </label>
        </div>
        <div>
          <label>
            Правильна відповідь:
            <input
              type="text"
              value={correctAnswer}
              onChange={handleCorrectAnswerChange}
            />
          </label>
        </div>
        <button type="submit">Надіслати</button>{" "}
        {/* Кнопка для відправки форми */}
      </form>
    </div>
  );
};
export default AddTask;
