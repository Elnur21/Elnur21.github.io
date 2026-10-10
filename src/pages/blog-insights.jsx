import { useState } from "react";
import Link from "next/link";

import { useAppStore } from "@/libs/store";
import styles from "@/styles/InsightsPage.module.css";
import blogStyles from "@/styles/BlogInsightsPage.module.css";
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

const countWords = (text) => (text.match(/\S+/g) || []).length;

const Section = ({ title, comment, children }) => (
  <section className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {comment && <span className={styles.comment}>{comment}</span>}
    {children}
  </section>
);

// Opening a post from here should also open the blogs.md tab, like the explorer does
const PostLink = ({ slug, className, children }) => {
  const addTab = useAppStore((state) => state.addTab);
  return (
    <Link
      href={`/blogs?post=${slug}`}
      className={className}
      onClick={() =>
        addTab({ icon: "/markdown_icon.svg", fileName: "blogs.md", path: "/blogs" })
      }
    >
      {children}
    </Link>
  );
};

// Year x month grid, shaded by how many posts were published that month
const Heatmap = ({ calendar, max }) => {
  const [active, setActive] = useState(null);

  return (
    <div className={blogStyles.heatmap}>
      <div className={blogStyles.heatRow}>
        <span />
        {MONTHS.map((month) => (
          <span key={month} className={blogStyles.heatMonth}>
            {month[0]}
          </span>
        ))}
        <span />
      </div>
      {calendar.map(({ year, months, total }) => (
        <div key={year} className={blogStyles.heatRow}>
          <span className={blogStyles.heatYear}>{year}</span>
          {months.map((posts, m) => {
            const key = `${year}-${m}`;
            return (
              <div
                key={key}
                className={blogStyles.heatCell}
                style={{
                  background: posts.length
                    ? `color-mix(in srgb, var(--accent-color) ${30 + (posts.length / max) * 70}%, transparent)`
                    : undefined,
                }}
                tabIndex={posts.length ? 0 : -1}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(key)}
                onBlur={() => setActive(null)}
              >
                {active === key && (
                  <div className={`${styles.tooltip} ${blogStyles.heatTooltip}`}>
                    <strong>
                      {MONTHS[m]} {year}: {posts.length} post{posts.length === 1 ? "" : "s"}
                    </strong>
                    {posts.map((title) => (
                      <span key={title}>{title}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <span className={blogStyles.heatTotal}>{total}</span>
        </div>
      ))}
      <div className={blogStyles.heatLegend}>
        less
        {[0, 1, 2, 3].map((level) => (
          <span
            key={level}
            className={blogStyles.heatCell}
            style={{
              background: level
                ? `color-mix(in srgb, var(--accent-color) ${30 + (level / 3) * 70}%, transparent)`
                : undefined,
            }}
          />
        ))}
        more
      </div>
    </div>
  );
};

const TagBars = ({ tags }) => (
  <div className={styles.languages}>
    {tags.map(({ tag, count }) => (
      <div key={tag} className={styles.languageRow}>
        <span className={styles.languageName}>{tag}</span>
        <div className={styles.languageTrack}>
          <div
            className={styles.languageBar}
            style={{
              width: `${(count / tags[0].count) * 100}%`,
              background: "var(--accent-color)",
            }}
          />
        </div>
        <span className={styles.languageValue}>
          {count} post{count === 1 ? "" : "s"}
        </span>
      </div>
    ))}
  </div>
);

const InsightsPage = ({ stats, calendar, maxPerMonth, tags, pairs, eras, highlights }) => (
  <>
    <div className={styles.header}>
      <span className={styles.comment}>{"# blog-insights.py"}</span>
      <span className={styles.comment}>
        {"# What I write about, how often, and how much"}
      </span>
    </div>

    <div className={`${styles.stats} ${blogStyles.stats}`}>
      {stats.map(({ label, value }) => (
        <div key={label} className={styles.stat}>
          <span className={styles.statValue}>{value}</span>
          <span className={styles.statLabel}>{label}</span>
        </div>
      ))}
    </div>

    <div className={styles.grid}>
      <Section title="Publishing calendar" comment="# hover a month to see its posts">
        <Heatmap calendar={calendar} max={maxPerMonth} />
      </Section>
      <Section title="Most written-about tags" comment="# top 10 across all posts">
        <TagBars tags={tags} />
      </Section>
    </div>

    <Section title="What I wrote about each year" comment="# top tags per year">
      <div className={blogStyles.eras}>
        {eras.map(({ year, posts, tags: yearTags }) => (
          <div key={year} className={blogStyles.era}>
            <span className={blogStyles.eraYear}>{year}</span>
            <span className={blogStyles.eraCount}>
              {posts} post{posts === 1 ? "" : "s"}
            </span>
            <div className={blogStyles.eraTags}>
              {yearTags.map((tag) => (
                <span key={tag} className={blogStyles.eraTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Highlights">
      <div className={styles.highlights}>
        {highlights.map(({ label, slug, title, detail }) => (
          <PostLink key={label} slug={slug} className={styles.highlight}>
            <span className={styles.highlightLabel}>{label}</span>
            <span className={styles.highlightName}>{title}</span>
            <span className={styles.highlightDetail}>{detail}</span>
          </PostLink>
        ))}
      </div>
    </Section>

    {pairs.length > 0 && (
      <Section title="Often written together" comment="# tag pairs that share the most posts">
        <div className={blogStyles.pairs}>
          {pairs.map(({ a, b, count }) => (
            <div key={`${a}+${b}`} className={blogStyles.pair}>
              <span className={blogStyles.pairTag}>{a}</span>
              <span className={blogStyles.pairPlus}>+</span>
              <span className={blogStyles.pairTag}>{b}</span>
              <span className={blogStyles.pairCount}>× {count}</span>
            </div>
          ))}
        </div>
      </Section>
    )}
  </>
);

export async function getStaticProps() {
  const blogs = getBlogs();

  // Measure each post's body
  const posts = blogs.map((blog) => {
    let words = countWords(`${blog.title} ${blog.summary}`);
    let images = 0;
    let codeLines = 0;
    blog.body.forEach((block) => {
      if (typeof block === "string") words += countWords(block);
      else if (block.h) words += countWords(block.h);
      else if (block.list) block.list.forEach((item) => (words += countWords(item)));
      else if (block.code) codeLines += block.code.split("\n").length;
      else if (block.img) {
        images += 1;
        if (block.caption) words += countWords(block.caption);
      }
    });
    if (blog.cover?.src) images += 1;
    return { ...blog, words, images, codeLines };
  });

  const sum = (key) => posts.reduce((total, post) => total + post[key], 0);
  const totalWords = sum("words");
  const yearsOf = posts.map((post) => Number(post.date.slice(0, 4)));
  const firstYear = Math.min(...yearsOf);
  const lastYear = Math.max(...yearsOf);

  // Tag frequency
  const tagCounts = {};
  posts.forEach((post) =>
    post.tags.forEach((tag) => (tagCounts[tag] = (tagCounts[tag] || 0) + 1))
  );
  const rankedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const stats = [
    { label: "posts", value: posts.length },
    { label: "words written", value: totalWords.toLocaleString("en-US") },
    { label: "minutes of reading", value: sum("readTime") },
    { label: "figures & screenshots", value: sum("images") },
    { label: "lines of code shown", value: sum("codeLines") },
    { label: "distinct tags", value: rankedTags.length },
    { label: "posts with source code", value: posts.filter((p) => p.source).length },
    { label: "years covered", value: lastYear - firstYear + 1 },
  ];

  // Publishing calendar, newest year first
  const calendar = [];
  for (let year = lastYear; year >= firstYear; year--) {
    const months = Array.from({ length: 12 }, () => []);
    posts
      .filter((post) => post.date.startsWith(`${year}-`))
      .forEach((post) => months[Number(post.date.slice(5, 7)) - 1].push(post.title));
    calendar.push({ year, months, total: months.flat().length });
  }
  const maxPerMonth = Math.max(...calendar.flatMap((row) => row.months.map((m) => m.length)));

  // Tag pairs that appear together, ignoring pairs seen only once
  const pairCounts = {};
  posts.forEach((post) => {
    const sorted = [...post.tags].sort();
    sorted.forEach((a, i) =>
      sorted.slice(i + 1).forEach((b) => {
        const key = `${a}|${b}`;
        pairCounts[key] = (pairCounts[key] || 0) + 1;
      })
    );
  });
  const pairs = Object.entries(pairCounts)
    .filter(([, count]) => count > 1)
    .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
    .slice(0, 8)
    .map(([key, count]) => {
      const [a, b] = key.split("|");
      return { a, b, count };
    });

  // Top tags per year
  const eras = calendar
    .filter((row) => row.total > 0)
    .map(({ year, total }) => {
      const counts = {};
      posts
        .filter((post) => post.date.startsWith(`${year}-`))
        .forEach((post) => post.tags.forEach((tag) => (counts[tag] = (counts[tag] || 0) + 1)));
      const top = Object.entries(counts)
        .sort((x, y) => y[1] - x[1] || tagCounts[y[0]] - tagCounts[x[0]])
        .slice(0, 5)
        .map(([tag]) => tag);
      return { year, posts: total, tags: top };
    });

  // Highlights
  const pick = (score) => posts.reduce((best, post) => (score(post) > score(best) ? post : best));
  const oldest = posts[posts.length - 1];
  const newest = posts[0];
  const longest = pick((p) => p.words);
  const shortest = pick((p) => -p.words);
  const visual = pick((p) => p.images * 1000 + p.words);
  const codey = pick((p) => p.codeLines);
  const tagged = pick((p) => p.tags.length);

  // Longest quiet stretch between two consecutive posts (posts are newest first)
  const toMonths = (date) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7));
  let gap = { months: -1 };
  for (let i = 0; i < posts.length - 1; i++) {
    const months = toMonths(posts[i].date) - toMonths(posts[i + 1].date);
    if (months > gap.months) gap = { months, after: posts[i + 1], before: posts[i] };
  }

  const card = (label, post, detail) => ({ label, slug: post.slug, title: post.title, detail });
  const highlights = [
    card("first post", oldest, formatDate(oldest.date)),
    card("latest post", newest, formatDate(newest.date)),
    card("longest read", longest, `${longest.words.toLocaleString("en-US")} words · ${longest.readTime} min`),
    card("quickest read", shortest, `${shortest.words.toLocaleString("en-US")} words · ${shortest.readTime} min`),
    card("most visual", visual, `${visual.images} images`),
    card("most tagged", tagged, tagged.tags.join(", ")),
    ...(codey.codeLines ? [card("most code", codey, `${codey.codeLines} lines of code`)] : []),
    card(
      "back after a break",
      gap.before,
      `${gap.months} months after “${gap.after.title}”`
    ),
  ];

  return {
    props: {
      title: "Blog Insights",
      stats,
      calendar,
      maxPerMonth,
      tags: rankedTags.slice(0, 10),
      pairs,
      eras,
      highlights,
    },
  };
}

export default InsightsPage;
