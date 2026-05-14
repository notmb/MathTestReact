import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/react";

interface Props {
  content: any;
  onChange: (editor: JSONContent) => void;
}

const TheoryEditor = (props: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "my-image",
        },
      }),
    ],

    content: props.content,
    onUpdate({ editor }) {
      props.onChange(editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default TheoryEditor;
