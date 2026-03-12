export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "marathi", label: "Marathi" },
  { value: "english_hindi", label: "English + Hindi" },
  { value: "english_marathi", label: "English + Marathi" },
] as const;

export type ContentLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];

export const languageLabel = (value?: string | null) =>
  LANGUAGE_OPTIONS.find((o) => o.value === value)?.label || "English";

