import { useImmer } from "use-immer";
import { Task2 } from "./types";
const ComparisonToMatchingTask = (props: {
  numTask: string;
  updateList1Text: (index: number, text: string) => void;
  updateList2Text: (index: number, text: string) => void;
  updateList1Pictures: (index: number, picture: File) => void;
  updateList2Pictures: (index: number, picture: File) => void;
}) => {
  const [listFileName, updataListFileName] = useImmer<{
    [key: string]: string;
  }>({});

  const handleFilesOfList1 = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputId = e.target.id;
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      updataListFileName((draft) => {
        draft[inputId] = file.name;
      });
      props.updateList1Pictures(index, file);
    } else {
      console.warn("Файл не вибрано!");
    }
    console.log(listFileName);
  };
  const handleFilesOfList2 = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputId = e.target.id;
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      props.updateList2Pictures(index, file);
      updataListFileName((draft) => {
        draft[inputId] = file.name;
      });
    } else {
      console.warn("Файл не вибрано!");
    }
  };
  const handleList1Change = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    console.log(index);
    props.updateList1Text(index, e.currentTarget.value);
  };
  const handleList2Change = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    console.log(index);
    props.updateList2Text(index, e.currentTarget.value);
  };
  return (
    <fieldset className="data_for_comparison">
      <legend>Дані для співставлення</legend>
      {["1", "2", "3"].map((item, index) => (
        <div key={index} className="box_for_list1">
          <div className="box_for_answer">
            <label className="" htmlFor={`task-${props.numTask}-list1-${item}`}>
              Вкажіть відповідь {item}
            </label>
            <textarea
              id={`task-${props.numTask}-list1-${item}`}
              name={`task-${props.numTask}-list1-${item}`}
              onChange={(e) => {
                handleList1Change(e, index);
              }}
            ></textarea>
          </div>
          <div className="more_conditions">
            <input
              type="file"
              accept="image/*"
              id={`task-${props.numTask}-list1-${item}-picture`}
              name={`task-${props.numTask}-list1-${item}-picture`}
              onChange={(e) => handleFilesOfList1(e, index)}
              className="hidden"
            />

            <label
              htmlFor={`task-${props.numTask}-list1-${item}-picture`}
              className="upload_picture"
            >
              {listFileName?.[`task-${props.numTask}-list1-${item}-picture`]
                ? `Файл: ${
                    listFileName[`task-${props.numTask}-list1-${item}-picture`]
                  }`
                : "Додати зображення"}
            </label>
          </div>
        </div>
      ))}
      {["А", "Б", "В", "Г", "Д"].map((item, index) => (
        <div key={index} className="box_for_list2">
          <div className="box_for_answer">
            <label className="" htmlFor={`task-${props.numTask}-list2-${item}`}>
              Вкажіть відповідь {item}
            </label>
            <textarea
              id={`task-${props.numTask}-list2-${item}`}
              name={`task-${props.numTask}-list2-${item}`}
              onChange={(e) => {
                handleList2Change(e, index);
              }}
            ></textarea>
          </div>
          <div className="more_conditions">
            <input
              type="file"
              accept="image/*"
              id={`task-${props.numTask}-list2-${item}-picture`}
              name={`task-${props.numTask}-list2-${item}-picture`}
              onChange={(e) => handleFilesOfList2(e, index)}
              className="hidden"
            />

            <label
              htmlFor={`task-${props.numTask}-list2-${item}-picture`}
              className="upload_picture"
            >
              {listFileName?.[`task-${props.numTask}-list2-${item}-picture`]
                ? `Файл: ${
                    listFileName[`task-${props.numTask}-list2-${item}-picture`]
                  }`
                : "Додати зображення"}
            </label>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
export default ComparisonToMatchingTask;
