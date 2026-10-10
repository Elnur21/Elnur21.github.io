import Head from "next/head";
import { useRouter } from "next/router";
import { useT } from "@/i18n";
import {
  LOCALES,
  OG_LOCALES,
  DEFAULT_IMAGE,
  NOINDEX_PATHS,
  localeUrl,
  absoluteUrl,
} from "@/libs/seo";

// Rendered once in _app. A page can tailor it with a static getSeo(pageProps, router, t),
// see blogs.jsx. image is a path/URL or { src, width, height }.
const CustomHead = ({
  title,
  description,
  image,
  imageAlt,
  type = "website",
  noindex = false,
  publishedTime,
  tags = [],
  jsonLd = [],
}) => {
  const t = useT();
  const router = useRouter();

  // Blog posts live at /blogs?post=slug; every other query string is ignored
  const post = router.query.post;
  const path = router.pathname + (post ? `?post=${encodeURIComponent(post)}` : "");
  const url = localeUrl(path, t.locale);

  const pageTitle = title || t("meta.title");
  const pageDescription = description || t("meta.description");
  const img = !image ? DEFAULT_IMAGE : typeof image === "string" ? { src: image } : image;
  const imgAlt = imageAlt || t("home.photo");
  const robots =
    noindex || NOINDEX_PATHS.includes(router.pathname)
      ? "noindex, follow"
      : "index, follow, max-image-preview:large, max-snippet:-1";

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
      <meta key="description" name="description" content={pageDescription} />
      <meta key="keywords" name="keywords" content={t("meta.keywords")} />
      <meta key="author" name="author" content={t("meta.name")} />
      <meta key="robots" name="robots" content={robots} />
      <meta key="theme-color" name="theme-color" content="#1e1e1e" />
      <meta key="format-detection" name="format-detection" content="telephone=no" />
      <link key="icon" rel="icon" href="/favicon.ico" />
      <link key="apple-touch-icon" rel="apple-touch-icon" href={DEFAULT_IMAGE.src} />

      <link key="canonical" rel="canonical" href={url} />
      {LOCALES.map((locale) => (
        <link
          key={`alternate-${locale}`}
          rel="alternate"
          hrefLang={locale}
          href={localeUrl(path, locale)}
        />
      ))}
      <link key="alternate-default" rel="alternate" hrefLang="x-default" href={localeUrl(path)} />

      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:site_name" property="og:site_name" content={t("meta.title")} />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta key="og:description" property="og:description" content={pageDescription} />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:image" property="og:image" content={absoluteUrl(img.src)} />
      {img.width && <meta key="og:image:width" property="og:image:width" content={String(img.width)} />}
      {img.height && <meta key="og:image:height" property="og:image:height" content={String(img.height)} />}
      <meta key="og:image:alt" property="og:image:alt" content={imgAlt} />
      <meta key="og:locale" property="og:locale" content={OG_LOCALES[t.locale]} />
      {LOCALES.filter((locale) => locale !== t.locale).map((locale) => (
        <meta
          key={`og:locale:alternate-${locale}`}
          property="og:locale:alternate"
          content={OG_LOCALES[locale]}
        />
      ))}
      {type === "article" && publishedTime && (
        <meta key="article:published_time" property="article:published_time" content={publishedTime} />
      )}
      {type === "article" &&
        tags.map((tag) => (
          <meta key={`article:tag-${tag}`} property="article:tag" content={tag} />
        ))}

      <meta key="twitter:card" name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta key="twitter:title" name="twitter:title" content={pageTitle} />
      <meta key="twitter:description" name="twitter:description" content={pageDescription} />
      <meta key="twitter:image" name="twitter:image" content={absoluteUrl(img.src)} />
      <meta key="twitter:image:alt" name="twitter:image:alt" content={imgAlt} />

      {jsonLd.map((data) => (
        <script
          key={`ld-${data["@type"]}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      ))}
    </Head>
  );
};

export default CustomHead;
