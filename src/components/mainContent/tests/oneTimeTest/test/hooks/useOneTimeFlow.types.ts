import type { Timestamp } from "firebase/firestore";
import type { Task1, Task2, Task3 } from "../oneTimeTest.types";

export type BaseParsed = { studentId: string; variantId: string; linkId: string };

export type Status =
  | { phase: "loading" }
  | { phase: "invalid"; reason: string }
  | ({ phase: "parsed" } & BaseParsed)
  | ({ phase: "loadingLink" } & BaseParsed)
  | ({ phase: "blocked"; reason: string } & BaseParsed)
  | ({ phase: "loadingVariant" } & BaseParsed & {
        endAtMs: number;
        variantCollection: "Mix" | "Retaking";
      })
  | ({ phase: "running" } & BaseParsed & {
        endAtMs: number;
        variantCollection: "Mix" | "Retaking";
      })
  | ({ phase: "finalizing"; finishReason: "timeOut" | "manual" } & BaseParsed)
  | ({ phase: "done" } & BaseParsed);

export type TestLinkDoc = {
  testLinkStatus: "notStarted" | "started" | "finished" | string;
  nameStudent: string;
  startedAt?: import("firebase/firestore").Timestamp;
  durationSec?: number;
  typeTest?: "main" | "retaking" | string;
  finishReason?: "timeOut" | "manual" | string;
  finishedAt?: Timestamp;
  used?: boolean;
  variantId?: string;
};

export type VariantDoc = {
  createdAt?: unknown;
  numberOfTask?: number;
  typeTest?: string;
  variantName?: string;
  variantSerialNumber?: number | string;
};

export type NormalizedTypeTest = "main" | "retaking";

export const normalizeTypeTest = (value: unknown): NormalizedTypeTest | null => {
  if (value === "main" || value === "retaking") return value;
  return null;
};

export const isTask1 = (task: unknown): task is Task1 =>
  !!task && typeof task === "object" && (task as Task1).typeOfTask === "choice";
export const isTask2 = (task: unknown): task is Task2 =>
  !!task &&
  typeof task === "object" &&
  (task as Task2).typeOfTask === "comparison";
export const isTask3 = (task: unknown): task is Task3 =>
  !!task &&
  typeof task === "object" &&
  (task as Task3).typeOfTask === "openAnswer";


