type OneTimeParams =
  | { ok: true; studentId: string; variantId: string; linkId: string }
  | { ok: false; reason: string };

export function parseOneTimeParamsFromPathname(
  pathname: string,
): OneTimeParams {
  const parts = pathname.split("/").filter(Boolean);

  const oneTimeIndex = parts.lastIndexOf("one-time-link");
  if (oneTimeIndex === -1)
    return { ok: false, reason: "Не знайдено one-time-test у URL" };
  if (oneTimeIndex === 0)
    return { ok: false, reason: "Немає сегмента з studentId_variantId" };

  const combined = parts[oneTimeIndex - 1]; // "studentId_variantId"
  if (!combined || !combined.includes("_")) {
    return { ok: false, reason: "Очікувався формат studentId_variantId" };
  }

  // важливо: split тільки на перший підкреслювач, щоб не зламатися якщо десь зʼявиться "_"
  const underscorePos = combined.indexOf("_");
  const studentId = combined.slice(0, underscorePos).trim();
  const variantId = combined.slice(underscorePos + 1).trim();

  if (!studentId || !variantId) {
    return { ok: false, reason: "studentId або variantId порожні" };
  }

  const linkId = `${studentId}_${variantId}`;
  return { ok: true, studentId, variantId, linkId };
}
