import type { MouseEvent, ReactNode } from "react";

interface Props {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onRun: () => void;
}

const ToolbarButton = ({
  active = false,
  children,
  disabled = false,
  onRun,
}: Props) => {
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onRun();
  };

  return (
    <button
      type="button"
      className={active ? "toolbar_button active" : "toolbar_button"}
      disabled={disabled}
      onMouseDown={handleMouseDown}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
