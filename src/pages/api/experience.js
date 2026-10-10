import experienceData from "./experience.json";
import { localize } from "@/i18n";

export const getExperience = (locale = "en") => {
  return experienceData.map((job) => localize(job, locale));
};

export default (req, res) => {
  res.json(getExperience(req.query.locale));
};
