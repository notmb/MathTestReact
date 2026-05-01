import { useEffect } from "react";
import TaskEditor from "./TaskEditor";
import "./taskEditor.css";

type ModalWindowForEditProps = {
  numTask: string;
  selectedVariant: string;
  onClose: () => void;
};

const ModalWindowForEdit = ({
  numTask,
  selectedVariant,
  onClose,
}: ModalWindowForEditProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="task-editor-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-editor-modal-title"
    >
      <div
        className="task-editor-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="task-editor-modal-header">
          <div>
            <h2
              id="task-editor-modal-title"
              className="task-editor-modal-title"
            >
              Edit task {numTask}
            </h2>
          </div>

          <button
            type="button"
            className="task-editor-modal-close"
            onClick={onClose}
            aria-label="Close task editor"
          >
            X
          </button>
        </div>

        <div className="task-editor-modal-body">
          <TaskEditor
            numTask={numTask}
            selectedVariant={selectedVariant}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalWindowForEdit;
