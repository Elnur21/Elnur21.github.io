import { useRouter } from "next/router";

import en from "./en";
import az from "./az";
import ru from "./ru";

export const LANGUAGES = [
  { code: "en", short: "EN", name: "English" },
  { code: "az", short: "AZ", name: "Azərbaycanca" },
  { code: "ru", short: "RU", name: "Русский" },
];

const DICTIONARIES = { en, az, ru };

const lookup = (dict, key) => key.split(".").reduce((node, part) => node?.[part], dict);

// "one" | "few" | "many" | "other", e.g. 1 репозиторий / 3 репозитория / 5 репозиториев
const pluralForm = (locale, count) => new Intl.PluralRules(locale).select(count);

// t("contact.name"), t("github.repos", { count: 5 }), t("blogs.minRead", { n: 4 })
// Missing keys fall back to English, then to the key itself.
export const getT = (locale = "en") => {
  const dict = DICTIONARIES[locale] || en;
  const t = (key, vars = {}) => {
    let value = lookup(dict, key) ?? lookup(en, key) ?? key;
    if (value && typeof value === "object" && typeof vars.count === "number") {
      value = value[pluralForm(locale, vars.count)] ?? value.other;
    }
    if (typeof value !== "string") return value;
    return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  };
  t.locale = DICTIONARIES[locale] ? locale : "en";
  // Topic tags keep their English value for filtering; only the label is translated
  t.tag = (tag) => lookup(dict, `tags.${tag}`) ?? tag;
  return t;
};

export const useT = () => getT(useRouter().locale);

// "2024-05-16" -> "16 May 2024" / "16 may 2024" / "16 мая 2024"
// "2024-05"    -> "May 2024"    / "May 2024"    / "Май 2024"
// Also accepts full ISO timestamps. Built by hand so server and client match.
export const formatDate = (date, locale = "en", { short = false } = {}) => {
  const dict = DICTIONARIES[locale] || en;
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  const m = month - 1;
  if (short) return `${day ? `${day} ` : ""}${dict.months.short[m]} ${year}`;
  if (day) return `${day} ${(dict.months.withDay || dict.months.long)[m]} ${year}`;
  const name = dict.months.long[m];
  return `${name[0].toUpperCase()}${name.slice(1)} ${year}`;
};

// Merges a data item's translation, stored next to the English fields:
// { "title": "Walking", "az": { "title": "Gəzinti" }, "ru": { ... } }
export const localize = (item, locale) => {
  const { az: azFields, ru: ruFields, ...base } = item;
  const fields = { az: azFields, ru: ruFields }[locale];
  return fields ? { ...base, ...fields } : base;
};
