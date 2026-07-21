import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  editor: Editor;
}

const InlineMathButton = ({ editor }: Props) => {
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
            type: "inlineMath",
            attrs: {
              latex,
            },
          })
          .run();
      }}
    >
      Inline
    </ToolbarButton>
  );
};

export default InlineMathButton;
