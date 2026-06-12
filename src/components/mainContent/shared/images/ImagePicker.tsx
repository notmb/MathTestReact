import type { ChangeEvent } from "react";

type ImagePickerProps = {
  id: string;
  label?: string;
  accept?: string;
  disabled?: boolean;
  selectedFileName?: string;
  className?: string;
  inputClassName?: string;
  triggerClassName?: string;
  fileNameClassName?: string;
  onSelect: (file: File) => void;
};

const ImagePicker = ({
  id,
  label = "Choose image",
  accept = "image/*",
  disabled = false,
  selectedFileName,
  className,
  inputClassName,
  triggerClassName,
  fileNameClassName,
  onSelect,
}: ImagePickerProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      input.value = "";
      return;
    }

    onSelect(file);
    input.value = "";
  };

  return (
    <div className={className}>
      <input
        id={id}
        className={inputClassName}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
      />
      <label className={triggerClassName} htmlFor={id}>
        {label}
      </label>
      {selectedFileName && (
        <span className={fileNameClassName}>{selectedFileName}</span>
      )}
    </div>
  );
};

export default ImagePicker;
