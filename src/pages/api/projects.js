import mlData from "./ml-projects.json";
import bots from "./bots-projects.json";
import jsData from "./js-projects.json";
import { localize } from "@/i18n";

export const getMLProjects = (locale = "en") => {
  return mlData.map((project) => localize(project, locale));
};

export const getJSProjects = (locale = "en") => {
  return jsData.map((project) => localize(project, locale));
};

export const getPyBotsProjects = (locale = "en") => {
  return bots.map((project) => localize(project, locale));
};

export default (req, res) => {
  const locale = req?.query?.locale;
  if (req?.query?.project === "ml") {
    const projects = getMLProjects(locale);
    res.json(projects);
  } else if (req?.query?.project === "js") {
    const projects = getJSProjects(locale);
    res.json(projects);
  } else if (req?.query?.project === "py-bots") {
    const projects = getPyBotsProjects(locale);
    res.json(projects);
  } else if (req?.query?.project === "all") {
    const projects = {
      ml: getMLProjects(locale),
      js: getJSProjects(locale),
      py_bots: getPyBotsProjects(locale),
    };
    res.json(projects);
  }
};
