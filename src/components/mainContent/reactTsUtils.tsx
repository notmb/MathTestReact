import "./utils.css";
import { useEffect } from "react";
//компонент обгортка для модального вікна
export const WrapperForModalWindow = (props: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // При демонтажі компонента — відписуємось
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.onClose]);
  return (
    <div className="wrapper_for_modal_window">
      <div className="modal_content">
        <button className="close_button" onClick={props.onClose}>
          X
        </button>
        {props.children}
      </div>
    </div>
  );
};
