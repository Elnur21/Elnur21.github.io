import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "@/styles/BlogsPage.module.css";
import { getBlogs } from "./api/blogs";
import { useT, formatDate } from "@/i18n";
import { SITE_URL, localeUrl, absoluteUrl, personJsonLd } from "@/libs/seo";

const postPath = (slug) => `/blogs?post=${encodeURIComponent(slug)}`;

// A real link, so crawlers can reach every post; a plain click still opens it in place
const PostLink = ({ slug, onOpen, className, children }) => (
  <Link
    href={postPath(slug)}
    className={className}
    onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      onOpen(slug);
    }}
  >
    {children}
  </Link>
);



// Either a real image, or a generated "code" cover for posts without one
const Cover = ({ blog, large = false }) => {
  const { cover } = blog;

  if (cover?.src) {
    return (
      <div className={`${styles.cover} ${cover.light ? styles.coverLight : ""}`}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={large ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 600px) 100vw, 400px"}
          style={{ objectFit: cover.fit || "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.cover} ${styles.coverCode}`}
      style={{ "--cover-color": cover?.color || "var(--accent-color)" }}
    >
      <span className={styles.coverFile}>{blog.slug}.md</span>
      <span className={styles.coverLabel}>{cover?.label || blog.title}</span>
    </div>
  );
};

const Block = ({ block }) => {
  if (typeof block === "string") return <p className={styles.paragraph}>{block}</p>;
  if (block.h) return <h2 className={styles.heading}>{block.h}</h2>;
  if (block.list)
    return (
      <ul className={styles.list}>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  if (block.code) return <pre className={styles.code}>{block.code}</pre>;
  if (block.img)
    return (
      <figure className={styles.figure}>
        <div className={block.light ? styles.figureLight : undefined}>
          <Image
            src={block.img}
            alt={block.alt}
            width={block.width}
            height={block.height}
            sizes="(max-width: 900px) 100vw, 760px"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  return null;
};

const Tags = ({ tags }) => {
  const t = useT();
  return (
    <div className={styles.tags}>
      {tags.map((tag) => (
        <span key={tag} className={styles.tag}>
          {t.tag(tag)}
        </span>
      ))}
    </div>
  );
};

const Meta = ({ blog }) => {
  const t = useT();
  return (
    <span className={styles.meta}>
      {formatDate(blog.date, t.locale)} · {t("blogs.minRead", { n: blog.readTime })}
    </span>
  );
};

const Card = ({ blog, featured = false, onOpen, t }) => (
  <PostLink
    slug={blog.slug}
    onOpen={onOpen}
    className={`${styles.card} ${featured ? styles.featured : ""}`}
  >
    <Cover blog={blog} large={featured} />
    <div className={styles.cardBody}>
      {featured && <span className={styles.latest}>{t("blogs.latest")}</span>}
      <Meta blog={blog} />
      <h3 className={styles.title}>{blog.title}</h3>
      <p className={styles.summary}>{blog.summary}</p>
      <Tags tags={blog.tags} />
    </div>
  </PostLink>
);

const Article = ({ post, prev, next, onOpen, t }) => (
  <article className={styles.article}>
    <button className={styles.back} onClick={() => onOpen(null)}>
      {t("blogs.back")}
    </button>
    <h1 className={styles.articleTitle}>{post.title}</h1>
    <Meta blog={post} />
    <Tags tags={post.tags} />
    {/* Skip the hero when the cover image is already shown as a figure */}
    {!post.body.some((block) => block.img && block.img === post.cover?.src) && (
      <div className={styles.hero}>
        <Cover blog={post} large />
      </div>
    )}
    <div className={styles.body}>
      {post.body.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
    {post.source && (
      <a
        className={styles.source}
        href={post.source}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("blogs.source")}
        {post.source.replace(/^https?:\/\//, "")}
      </a>
    )}
    <nav className={styles.pager}>
      {prev ? (
        <PostLink slug={prev.slug} onOpen={onOpen} className={styles.pagerLink}>
          <span>{t("blogs.newer")}</span>
          {prev.title}
        </PostLink>
      ) : (
        <span />
      )}
      {next && (
        <PostLink
          slug={next.slug}
          onOpen={onOpen}
          className={`${styles.pagerLink} ${styles.pagerNext}`}
        >
          <span>{t("blogs.older")}</span>
          {next.title}
        </PostLink>
      )}
    </nav>
  </article>
);

const BlogsPage = ({ blogs, tags }) => {
  const t = useT();
  const router = useRouter();
  const [activeTag, setActiveTag] = useState(null);

  const openPost = (slug) => {
    router.push(slug ? postPath(slug) : "/blogs", undefined, {
      shallow: true,
    });
    document.querySelector("main")?.scrollTo({ top: 0 });
  };

  const index = blogs.findIndex((blog) => blog.slug === router.query.post);
  if (index !== -1) {
    return (
      <Article
        post={blogs[index]}
        prev={blogs[index - 1]}
        next={blogs[index + 1]}
        onOpen={openPost}
        t={t}
      />
    );
  }

  const filtered = activeTag
    ? blogs.filter((blog) => blog.tags.includes(activeTag))
    : blogs;
  const [featured, ...rest] = filtered;

  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"// blogs.md"}</span>
        <span className={styles.comment}>
          {t("blogs.comment")}
        </span>
      </div>

      <div className={styles.filters}>
        {[null, ...tags].map((tag) => (
          <button
            key={tag || "all"}
            className={`${styles.filter} ${activeTag === tag ? styles.filterActive : ""}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag ? t.tag(tag) : t("blogs.all", { n: blogs.length })}
          </button>
        ))}
      </div>

      {featured && <Card blog={featured} featured onOpen={openPost} t={t} />}
      <div className={styles.posts}>
        {rest.map((blog) => (
          <Card key={blog.slug} blog={blog} onOpen={openPost} t={t} />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const blogs = getBlogs(locale);

  // The 10 most common tags shared by more than one post
  const counts = {};
  blogs.forEach((blog) =>
    blog.tags.forEach((tag) => (counts[tag] = (counts[tag] || 0) + 1))
  );
  const tags = Object.keys(counts)
    .filter((tag) => counts[tag] > 1)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 10);

  return {
    props: { title: "Blogs", blogs, tags },
  };
}

// Title, description, cover and BlogPosting data for /blogs?post=slug (used by _app)
BlogsPage.getSeo = ({ blogs }, router, t) => {
  const post = blogs?.find((blog) => blog.slug === router.query.post);
  if (!post) return {};

  const url = localeUrl(postPath(post.slug), t.locale);
  return {
    title: `${post.title} | ${t("meta.name")}`,
    description: post.summary,
    image: post.cover?.src,
    imageAlt: post.cover?.alt || post.title,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
    jsonLd: [
      personJsonLd(t),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.summary,
        datePublished: post.date,
        inLanguage: t.locale,
        url,
        mainEntityOfPage: url,
        keywords: post.tags.join(", "),
        ...(post.cover?.src && { image: absoluteUrl(post.cover.src) }),
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
};

export default BlogsPage;
