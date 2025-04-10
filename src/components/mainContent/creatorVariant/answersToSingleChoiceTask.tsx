import { useImmer } from "use-immer";

const AnswersToSinglChoiceTask = (props: {
  numTask: string;
  updateAnswerText: (index: number, text: string) => void;
  updateAnswerPictures: (index: number, picture: File) => void;
}) => {
  const [nameFileAnswers, updateNameFileAnswers] = useImmer<string[]>([]);
  const letterToIndex: Record<string, number> = {
    А: 0,
    Б: 1,
    В: 2,
    Г: 3,
    Д: 4,
  };
  const handleTextOfAnswersChange = (
    letter: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const index = letterToIndex[letter];

    if (index !== undefined) {
      props.updateAnswerText(index, e.currentTarget.value);
    }
  };

  const handleFileAnswersChange = (
    letter: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = letterToIndex[letter];
    const file = e.target.files?.[0];

    if (file) {
      console.log("Файл вибрано:", file.name);

      updateNameFileAnswers((draft) => {
        draft[index] = file.name; // Записуємо в масив назву файлу за індексом
      });
      console.log([]);
      props.updateAnswerPictures(index, file);
    } else {
      console.warn("Файл не вибрано!");
    }
  };

  return (
    <fieldset className="data_answers">
      <legend>Дані для варіантів відповіді</legend>
      {["А", "Б", "В", "Г", "Д"].map((item, index) => (
        <div key={index}>
          <div className="box_for_answer">
            <label
              className=""
              htmlFor={`task-${props.numTask}-answer-${item}`}
            >
              Вкажіть відповідь {item}
            </label>
            <textarea
              id={`task-${props.numTask}-answer-${item}`}
              name={`task-${props.numTask}-answer-${item}`}
              onChange={(e) => handleTextOfAnswersChange(item, e)}
            ></textarea>
          </div>
          <div className="more_conditions">
            <input
              type="file"
              accept="image/*"
              id={`task-${props.numTask}-answer-${item}-picture`}
              name={`task-${props.numTask}-answer-${item}-picture`}
              onChange={(e) => handleFileAnswersChange(item, e)}
              className="hidden"
            />

            <label
              htmlFor={`task-${props.numTask}-answer-${item}-picture`}
              className="upload_picture"
            >
              {nameFileAnswers?.[index]
                ? `Файл: ${nameFileAnswers[index]}`
                : "Додати зображення"}
            </label>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
export default AnswersToSinglChoiceTask;
