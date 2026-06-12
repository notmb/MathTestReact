import type { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { uploadImage } from "../../../shared/images/firebaseImageStorage";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  editor: Editor;
  imageUploadFolder: string;
}

const ImageButton = ({ editor, imageUploadFolder }: Props) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploadingImage(true);

    try {
      const uploadedImage = await uploadImage(file, {
        folder: imageUploadFolder,
        metadata: {
          contentType: file.type,
        },
      });

      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: uploadedImage.downloadUrl,
            alt: file.name,
            title: file.name,
            storagePath: uploadedImage.path,
          },
        })
        .run();
    } catch (error) {
      console.error("Failed to upload theory image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      <ToolbarButton
        disabled={isUploadingImage}
        onRun={() => imageInputRef.current?.click()}
      >
        Image
      </ToolbarButton>
    </>
  );
};

export default ImageButton;
