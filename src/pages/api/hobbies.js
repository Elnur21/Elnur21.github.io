import hobbiesData from "./hobbies.json";

export const getHobbies = () => {
  return hobbiesData;
};

export default (req, res) => {
  res.json(getHobbies());
};
