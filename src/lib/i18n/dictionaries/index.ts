import type { Dictionary, Locale } from "../types";
import { en } from "./en";
import { ja } from "./ja";
import { zh } from "./zh";

export const dictionaries: Record<Locale, Dictionary> = { ja, en, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
