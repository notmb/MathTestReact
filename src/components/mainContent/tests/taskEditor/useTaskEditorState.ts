import { useCallback, useState } from "react";

const defaultSaveErrorMessage =
  "Не вдалося зберегти зміни. Спробуйте ще раз.";

export const useTaskEditorState = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const runWithSaving = async (
    action: () => Promise<void>,
    errorMessage = defaultSaveErrorMessage,
  ) => {
    setIsSaving(true);
    setError(null);

    try {
      await action();
    } catch (error) {
      console.error("Не вдалося зберегти зміни завдання:", error);
      if (error instanceof Error && error.message) {
        setError(error.message);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    error,
    setError,
    clearError,
    runWithSaving,
  };
};
