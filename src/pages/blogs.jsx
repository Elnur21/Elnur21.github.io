import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "@/styles/BlogsPage.module.css";
import { getBlogs } from "./api/blogs";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// "2024-05-16" -> "16 May 2024", "2024-05" -> "May 2024"
const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  const label = `${MONTHS[Number(month) - 1]} ${year}`;
  return day ? `${Number(day)} ${label}` : label;
};

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

const Tags = ({ tags }) => (
  <div className={styles.tags}>
    {tags.map((tag) => (
      <span key={tag} className={styles.tag}>
        {tag}
      </span>
    ))}
  </div>
);

const Meta = ({ blog }) => (
  <span className={styles.meta}>
    {formatDate(blog.date)} · {blog.readTime} min read
  </span>
);

const Card = ({ blog, featured = false, onOpen }) => (
  <button
    className={`${styles.card} ${featured ? styles.featured : ""}`}
    onClick={() => onOpen(blog.slug)}
  >
    <Cover blog={blog} large={featured} />
    <div className={styles.cardBody}>
      {featured && <span className={styles.latest}>Latest post</span>}
      <Meta blog={blog} />
      <h3 className={styles.title}>{blog.title}</h3>
      <p className={styles.summary}>{blog.summary}</p>
      <Tags tags={blog.tags} />
    </div>
  </button>
);

const Article = ({ post, prev, next, onOpen }) => (
  <article className={styles.article}>
    <button className={styles.back} onClick={() => onOpen(null)}>
      {"← cd .."}
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
        {"// source: "}
        {post.source.replace(/^https?:\/\//, "")}
      </a>
    )}
    <nav className={styles.pager}>
      {prev ? (
        <button className={styles.pagerLink} onClick={() => onOpen(prev.slug)}>
          <span>← Newer</span>
          {prev.title}
        </button>
      ) : (
        <span />
      )}
      {next && (
        <button
          className={`${styles.pagerLink} ${styles.pagerNext}`}
          onClick={() => onOpen(next.slug)}
        >
          <span>Older →</span>
          {next.title}
        </button>
      )}
    </nav>
  </article>
);

const BlogsPage = ({ blogs, tags }) => {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState(null);

  const openPost = (slug) => {
    router.push(slug ? `/blogs?post=${slug}` : "/blogs", undefined, {
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
          {"// Notes on what I've built, learned and researched"}
        </span>
      </div>

      <div className={styles.filters}>
        {[null, ...tags].map((tag) => (
          <button
            key={tag || "all"}
            className={`${styles.filter} ${activeTag === tag ? styles.filterActive : ""}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag || `All (${blogs.length})`}
          </button>
        ))}
      </div>

      {featured && <Card blog={featured} featured onOpen={openPost} />}
      <div className={styles.posts}>
        {rest.map((blog) => (
          <Card key={blog.slug} blog={blog} onOpen={openPost} />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const blogs = getBlogs();

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

export default BlogsPage;
