import CreatorTaskChoice from "./creatorTaskChoice";
import CreatorTaskMatching from "./creatorTaskMatching";
import CreatorTaskOpenAnswer from "./creatorTaskOpenAnswer";
import { useImmer } from "use-immer";
import { useVariantContext } from "../tests/variantContext";

type TaskType = "choice" | "comparison" | "openAnswer";

const AddTask = (props: { selectedVariant: string; onSuccess: () => void }) => {
  const [task, updateTask] = useImmer<{
    numberTask: string | null;
    typeTask: TaskType | null;
    taskIsAdded: boolean;
  }>({
    numberTask: null,
    typeTask: null,
    taskIsAdded: false,
  });

  const { dataVariant } = useVariantContext();

  const handleSetNumberTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newNumber = formData.get("numberOfTask") as string;
    const newTypeOfTask = formData.get("typeOfTask") as string;
    updateTask(() => ({ numberTask: newNumber, typeTask: newTypeOfTask }));
    console.log(task);
  };

  console.log(props.selectedVariant);

  return (
    <div>
      <div className="container_for_data_task">
        <form className="form_for_data_task" onSubmit={handleSetNumberTask}>
          <label htmlFor="number_of_task">
            Введіть номер завдання:
            <input type="text" id="number_of_task" name="numberOfTask" />
          </label>

          <label htmlFor="type_of_task">
            Виберіть тип завдання:
            <input
              name={"typeOfTask"}
              list={"typeOfTask"}
              placeholder="type of task is..."
            />
            <datalist id={"typeOfTask"}>
              {["choice", "comparison", "openAnswer"].map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
          </label>

          <button className="custom_button" type="submit">
            Ok
          </button>
        </form>
      </div>

      {task.numberTask &&
        task.typeTask &&
        dataVariant.typeTest &&
        (() => {
          const commonProps = {
            typeTest: dataVariant.typeTest,
            numSelectedTask: task.numberTask,
            nameOfVariant: props.selectedVariant,
            updateTaskIsAdded: () => {},
            onSuccess: props.onSuccess,
          };

          switch (task.typeTask) {
            case "choice":
              return <CreatorTaskChoice {...commonProps}></CreatorTaskChoice>;

            case "comparison":
              return (
                <CreatorTaskMatching {...commonProps}></CreatorTaskMatching>
              );

            case "openAnswer":
              return (
                <CreatorTaskOpenAnswer {...commonProps}></CreatorTaskOpenAnswer>
              );

            default:
              return null;
          }
        })()}
    </div>
  );
};
export default AddTask;
