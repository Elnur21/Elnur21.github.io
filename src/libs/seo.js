// Shared SEO settings: absolute URLs, locales and the structured data about me

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://elnur21-github-io.vercel.app"
).replace(/\/$/, "");

export const LOCALES = ["en", "az", "ru"];
export const DEFAULT_LOCALE = "en";

export const OG_LOCALES = { en: "en_US", az: "az_AZ", ru: "ru_RU" };

export const DEFAULT_IMAGE = { src: "/me.jpeg", width: 460, height: 460 };

export const PROFILES = {
  github: "https://github.com/Elnur21",
  linkedin: "https://www.linkedin.com/in/elnur-meherremov/",
};

// Pages kept out of search results and the sitemap
export const NOINDEX_PATHS = ["/settings"];

// "/blogs", "az" -> "https://.../az/blogs"; English has no prefix
export const localeUrl = (path = "/", locale = DEFAULT_LOCALE) => {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  if (path === "/") return `${SITE_URL}${prefix || "/"}`;
  return `${SITE_URL}${prefix}${path}`;
};

export const absoluteUrl = (src) =>
  /^https?:\/\//.test(src) ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;

export const personJsonLd = (t) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: t("meta.name"),
  alternateName: ["Elnur Maharramov", "Elnur Məhərrəmov", "Эльнур Магеррамов", "Elnur21"],
  url: localeUrl("/", t.locale),
  image: absoluteUrl(DEFAULT_IMAGE.src),
  jobTitle: t("home.role"),
  description: t("meta.description"),
  address: { "@type": "PostalAddress", addressLocality: "Baku", addressCountry: "AZ" },
  sameAs: Object.values(PROFILES),
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "Vue.js",
    "Python",
    "Machine Learning",
    "PostgreSQL",
    "MongoDB",
    "Docker",
  ],
});

export const websiteJsonLd = (t) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: localeUrl("/", t.locale),
  name: t("meta.title"),
  description: t("meta.description"),
  inLanguage: t.locale,
  author: { "@id": `${SITE_URL}/#person` },
});
