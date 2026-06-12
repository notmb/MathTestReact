import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  active: boolean;
  editor: Editor;
}

const Bold = ({ active, editor }: Props) => {
  return (
    <ToolbarButton
      active={active}
      onRun={() => editor.chain().focus().toggleBold().run()}
    >
      B
    </ToolbarButton>
  );
};

export default Bold;
