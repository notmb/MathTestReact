import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  editor: Editor;
}

const MathBlockButton = ({ editor }: Props) => {
  return (
    <ToolbarButton
      onRun={() => {
        const latex = prompt("LaTeX");

        if (!latex) {
          return;
        }

        editor
          .chain()
          .focus()
          .insertContent({
            type: "mathBlock",
            attrs: {
              latex,
            },
          })
          .run();
      }}
    >
      Formula
    </ToolbarButton>
  );
};

export default MathBlockButton;
