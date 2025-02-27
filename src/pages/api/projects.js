import mlData from "./ml-projects.json";
import bots from "./bots-projects.json";
import jsData from "./js-projects.json";

export const getMLProjects = () => {
  return mlData;
};

export const getJSProjects = () => {
  return jsData;
};

export const getPyBotsProjects = () => {
  return bots;
};

export default (req, res) => {
  if (req?.query?.project === "ml") {
    const projects = getMLProjects();
    res.json(projects);
  } else if (req?.query?.project === "js") {
    const projects = getJSProjects();
    res.json(projects);
  } else if (req?.query?.project === "py-bots") {
    const projects = getPyBotsProjects();
    res.json(projects);
  } else if (req?.query?.project === "all") {
    const projects = {
      ml: getMLProjects(),
      js: getJSProjects(),
      py_bots: getPyBotsProjects(),
    };
    res.json(projects);
  }
};
