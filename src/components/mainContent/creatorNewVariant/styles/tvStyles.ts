import { tv } from "tailwind-variants";

export const buttonStyles = tv({
  base: "rounded-full py-[10px] px-[18px] min-h-[44px] border border-solid [font-family:inherit] text-lg font-medium shadow-[0_12px_24px_rgba(184,92,56,0.2)] enabled:hover:-translate-y-[1px] enabled:hover:shadow-[0_16px_28px_rgba(184,92,56,0.28)] cursor-pointer transition-[background-color,translate,box-shadow,opacity] duration-[180ms] ease-[ease]",
  variants: {
    kind: {
      create:
        "border-[var(--creator-border-strong)] bg-[var(--creator-accent)] text-[#fffaf4] disabled:opacity-70 disabled:cursor-not-allowed ",
      edit: "border-[var(--creator-border-strong)] bg-white text-[var(--creator-accent-dark)]",
    },
  },
});

export const createVariantSectionStyles = tv({
  base: "w-full p-[20px] border border-solid border-[var(--creator-border)] rounded-[20px] bg-[rgba(255,251,243,0.96)] shadow-[0_10px_24px_rgba(92,62,18,0.08)]",

  variants: {
    kind: {
      meta: "",
      summary: "",
      tasks: "",
    },
  },
});
