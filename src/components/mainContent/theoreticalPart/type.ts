import { JSONContent } from "@tiptap/react";

export interface TheoryDocument {
  title: string;

  content: JSONContent;
}

export type PendingTheoryImages = Record<string, File>;
//Ключ: previewSrc типу data:image/...
//Значення: оригінальний File.
