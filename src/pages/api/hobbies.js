import hobbiesData from "./hobbies.json";
import { localize } from "@/i18n";

export const getHobbies = (locale = "en") => {
  return hobbiesData.map((hobby) => localize(hobby, locale));
};

export default (req, res) => {
  res.json(getHobbies(req.query.locale));
};
