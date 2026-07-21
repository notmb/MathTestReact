import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import InlineMath from "./extensions/inlineMath/InlineMath";
import MathBlock from "./extensions/mathBlock/MathBlock";

const TheoryImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      storagePath: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-storage-path"),
        renderHTML: (attributes) => {
          if (!attributes.storagePath) {
            return {};
          }

          return {
            "data-storage-path": attributes.storagePath,
          };
        },
      },
    };
  },
});

export const theoryEditorExtensions = [
  StarterKit,
  InlineMath,
  MathBlock,
  TheoryImage.configure({
    HTMLAttributes: {
      class: "my-image",
    },
  }),
];
