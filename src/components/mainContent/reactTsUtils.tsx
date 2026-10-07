import "./utils.css";
import { useEffect } from "react";
//компонент ОБГОРТКА ДЛЯ МОДАЛЬНОГО ВІКНА
export const WrapperForModalWindow = (props: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const { onClose } = props;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // При демонтажі компонента — відписуємось
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  return (
    <div className="wrapper_for_modal_window">
      <div className="modal_content">
        <div className="container_for_close_button">
          <button
            type="button"
            className="close_button"
            onClick={props.onClose}
            aria-label="Close modal window"
          >
            X
          </button>
        </div>
        <div className="container_for_children"> {props.children}</div>
      </div>
    </div>
  );
};
