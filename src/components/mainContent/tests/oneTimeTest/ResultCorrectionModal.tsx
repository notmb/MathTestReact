import { useEffect, useState } from "react";
import "./styleOneTime.css";

type ResultCorrectionModalProps = {
  currentResult?: string | null;
  initialComment?: string;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (payload: { nextResult: string; comment: string }) => void;
};

const ResultCorrectionModal = ({
  currentResult,
  initialComment = "",
  isSaving = false,
  onClose,
  onSubmit,
}: ResultCorrectionModalProps) => {
  const [nextResult, setNextResult] = useState(currentResult ?? "");
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedResult = nextResult.trim();

    if (!trimmedResult) {
      return;
    }

    onSubmit({
      nextResult: trimmedResult,
      comment: comment.trim(),
    });
  };

  return (
    <div
      className="result-correction-modal"
      onClick={() => {
        if (!isSaving) {
          onClose();
        }
      }}
    >
      <div
        className="result-correction-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="result-correction-modal-header">
          <div>
            <h2 className="result-correction-modal-title">
              Скоригувати результат
            </h2>
            <p className="result-correction-modal-subtitle">
              Зафіксуй новий результат і, за потреби, додай короткий коментар.
            </p>
          </div>
          <button
            type="button"
            className="result-correction-modal-close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Закрити модалку"
          >
            ×
          </button>
        </div>

        <form className="result-correction-modal-form" onSubmit={handleSubmit}>
          <label className="result-correction-modal-field">
            <span className="result-correction-modal-label">
              Поточний результат
            </span>
            <div className="result-correction-modal-current">
              {currentResult?.trim() ? currentResult : "не задано"}
            </div>
          </label>

          <label className="result-correction-modal-field">
            <span className="result-correction-modal-label">Новий результат</span>
            <input
              className="result-correction-modal-input"
              type="text"
              value={nextResult}
              onChange={(event) => setNextResult(event.target.value)}
              placeholder="Наприклад: 8/12 або 167"
              disabled={isSaving}
            />
          </label>

          <label className="result-correction-modal-field">
            <span className="result-correction-modal-label">
              Коментар вчителя
            </span>
            <textarea
              className="result-correction-modal-textarea"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Чому результат скориговано"
              rows={4}
              disabled={isSaving}
            />
          </label>

          <div className="result-correction-modal-actions">
            <button
              type="button"
              className="result-correction-modal-btn result-correction-modal-btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="result-correction-modal-btn result-correction-modal-btn-primary"
              disabled={isSaving || !nextResult.trim()}
            >
              {isSaving ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultCorrectionModal;
