import { uz } from "./uz";
import { en } from "./en";
import { ru } from "./ru";

export const translations = {
  uz,
  en,
  ru,
};

export type Locale = keyof typeof translations;

export const locales: { code: Locale; name: string; flag: string }[] = [
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];
