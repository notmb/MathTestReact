import type { VariantMetaDraft } from "./types";

export const validateVariantMeta = (
  meta: VariantMetaDraft,
): string | null => {
  if (!meta.variantName.trim()) {
    return "Р’РєР°Р¶Рё РЅР°Р·РІСѓ РІР°СЂС–Р°РЅС‚Сѓ.";
  }

  if (!meta.variantSerialNumber.trim()) {
    return "Р’РєР°Р¶Рё РЅРѕРјРµСЂ РІР°СЂС–Р°РЅС‚Сѓ.";
  }

  const taskCount = Number(meta.numberOfTasks);
  const isValidTaskCount = Number.isInteger(taskCount) && taskCount > 0;

  if (!isValidTaskCount) {
    return "РљС–Р»СЊРєС–СЃС‚СЊ Р·Р°РІРґР°РЅСЊ РјР°С” Р±СѓС‚Рё С†С–Р»РёРј С‡РёСЃР»РѕРј Р±С–Р»СЊС€Рµ РЅСѓР»СЏ.";
  }

  return null;
};
