import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  active: boolean;
  editor: Editor;
}

const BulletList = ({ active, editor }: Props) => {
  return (
    <ToolbarButton
      active={active}
      onRun={() => editor.chain().focus().toggleBulletList().run()}
    >
      {"\u2022 List"}
    </ToolbarButton>
  );
};

export default BulletList;
