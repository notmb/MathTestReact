import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/react";

interface Props {
  content: any;
}

const ViewerPresentation = (props: Props) => {
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
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default ViewerPresentation;
