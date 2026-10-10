import { getBlogs } from "./api/blogs";
import { LOCALES, DEFAULT_LOCALE, localeUrl } from "@/libs/seo";

// Every indexable page; /settings is left out on purpose (noindex)
const PAGES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/resume", priority: "0.9", changefreq: "monthly" },
  { path: "/projects-js", priority: "0.9", changefreq: "monthly" },
  { path: "/projects-py", priority: "0.9", changefreq: "monthly" },
  { path: "/experience", priority: "0.8", changefreq: "monthly" },
  { path: "/blogs", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/github", priority: "0.6", changefreq: "weekly" },
  { path: "/repositories", priority: "0.6", changefreq: "weekly" },
  { path: "/languages", priority: "0.5", changefreq: "weekly" },
  { path: "/insights", priority: "0.5", changefreq: "weekly" },
  { path: "/blog-insights", priority: "0.4", changefreq: "monthly" },
  { path: "/hobbies", priority: "0.4", changefreq: "yearly" },
];

const escape = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// One <url> per locale, each listing all language versions as alternates
const entries = ({ path, lastmod, changefreq, priority }) =>
  LOCALES.map(
    (locale) => `  <url>
    <loc>${escape(localeUrl(path, locale))}</loc>
${LOCALES.map(
  (alt) =>
    `    <xhtml:link rel="alternate" hreflang="${alt}" href="${escape(localeUrl(path, alt))}"/>`
).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(localeUrl(path, DEFAULT_LOCALE))}"/>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("\n");

export const buildSitemap = () => {
  const posts = getBlogs().map((post) => ({
    path: `/blogs?post=${encodeURIComponent(post.slug)}`,
    // "YYYY-MM" dates are valid W3C dates too
    lastmod: post.date,
    changefreq: "yearly",
    priority: "0.7",
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...PAGES, ...posts].map(entries).join("\n")}
</urlset>
`;
};

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.write(buildSitemap());
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
