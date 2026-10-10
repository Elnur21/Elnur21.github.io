// Feeds the site's data to the chat engine in all three languages. Imported
// lazily by ChatPanel, so this is only downloaded when someone opens the chat.
import { getExperience } from "@/pages/api/experience";
import { getBlogs } from "@/pages/api/blogs";
import { getJSProjects, getMLProjects, getPyBotsProjects } from "@/pages/api/projects";
import { getHobbies } from "@/pages/api/hobbies";
import { contactItems } from "@/components/ContactCode";
import { explorerItems } from "@/libs/constants";
import { getT } from "@/i18n";
import { createBot, LANGS } from "./engine";

// Every page in the explorer, e.g. { name: "blogs.md", path: "/blogs", icon: "/markdown_icon.svg" }
export const pages = explorerItems.flatMap((group) =>
  group.items.map((item) => ({ ...item, icon: `/${item.icon}` }))
);

const dataFor = (locale) => ({
  experience: getExperience(locale),
  blogs: getBlogs(locale),
  jsProjects: getJSProjects(locale),
  mlProjects: getMLProjects(locale),
  botProjects: getPyBotsProjects(locale),
  hobbies: getHobbies(locale),
});

export const bot = createBot({
  ...Object.fromEntries(LANGS.map((locale) => [locale, dataFor(locale)])),
  contacts: contactItems,
  pages,
  tagLabel: (tag, locale) => getT(locale).tag(tag),
});
