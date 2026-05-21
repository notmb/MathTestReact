import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

export const theoryEditorExtensions = [
  StarterKit,
  Image.configure({
    HTMLAttributes: {
      class: "my-image",
    },
  }),
];
