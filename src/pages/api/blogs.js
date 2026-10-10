import blogsData from "./blogs.json";

// Newest first. Dates are "YYYY-MM-DD" or "YYYY-MM", so string order matches date order.
export const getBlogs = () => {
  return [...blogsData].sort((a, b) => b.date.localeCompare(a.date));
};

export default (req, res) => {
  res.json(getBlogs());
};
