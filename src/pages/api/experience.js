import experienceData from "./experience.json";

export const getExperience = () => {
  return experienceData;
};

export default (req, res) => {
  res.json(getExperience());
};
