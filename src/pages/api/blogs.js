import blogsData from "./blogs.json";
import blogsAz from "./blogs.az.json";
import blogsRu from "./blogs.ru.json";

const TRANSLATIONS = { az: blogsAz, ru: blogsRu };

// Newest first. Dates are "YYYY-MM-DD" or "YYYY-MM", so string order matches date order.
// Translated posts are matched by slug; anything missing falls back to English.
export const getBlogs = (locale = "en") => {
  const translated = Object.fromEntries((TRANSLATIONS[locale] || []).map((post) => [post.slug, post]));
  return blogsData
    .map((post) => translated[post.slug] || post)
    .sort((a, b) => b.date.localeCompare(a.date));
};

export default (req, res) => {
  res.json(getBlogs(req.query.locale));
};
