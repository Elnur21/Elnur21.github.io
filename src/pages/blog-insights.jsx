import { useState } from "react";
import Link from "next/link";

import { useAppStore } from "@/libs/store";
import styles from "@/styles/InsightsPage.module.css";
import blogStyles from "@/styles/BlogInsightsPage.module.css";
import { getBlogs } from "./api/blogs";
import { useT, getT, formatDate } from "@/i18n";



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
  const t = useT();
  const months = t("months.short");
  const [active, setActive] = useState(null);

  return (
    <div className={blogStyles.heatmap}>
      <div className={blogStyles.heatRow}>
        <span />
        {months.map((month) => (
          <span key={month} className={blogStyles.heatMonth}>
            {month[0].toUpperCase()}
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
                      {months[m]} {year}: {t("blogInsights.posts", { count: posts.length })}
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
        {t("blogInsights.less")}
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
        {t("blogInsights.more")}
      </div>
    </div>
  );
};

const TagBars = ({ tags, t }) => (
  <div className={styles.languages}>
    {tags.map(({ tag, count }) => (
      <div key={tag} className={styles.languageRow}>
        <span className={styles.languageName}>{t.tag(tag)}</span>
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
          {t("blogInsights.posts", { count })}
        </span>
      </div>
    ))}
  </div>
);

const InsightsPage = ({ stats, calendar, maxPerMonth, tags, pairs, eras, highlights }) => {
  const t = useT();
  return (
  <>
    <div className={styles.header}>
      <span className={styles.comment}>{"# blog-insights.py"}</span>
      <span className={styles.comment}>
        {t("blogInsights.comment")}
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
      <Section title={t("blogInsights.sections.calendar")} comment={t("blogInsights.sections.calendarHint")}>
        <Heatmap calendar={calendar} max={maxPerMonth} />
      </Section>
      <Section title={t("blogInsights.sections.tags")} comment={t("blogInsights.sections.tagsHint")}>
        <TagBars tags={tags} t={t} />
      </Section>
    </div>

    <Section title={t("blogInsights.sections.years")} comment={t("blogInsights.sections.yearsHint")}>
      <div className={blogStyles.eras}>
        {eras.map(({ year, posts, tags: yearTags }) => (
          <div key={year} className={blogStyles.era}>
            <span className={blogStyles.eraYear}>{year}</span>
            <span className={blogStyles.eraCount}>
              {t("blogInsights.posts", { count: posts })}
            </span>
            <div className={blogStyles.eraTags}>
              {yearTags.map((tag) => (
                <span key={tag} className={blogStyles.eraTag}>
                  {t.tag(tag)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section title={t("blogInsights.sections.highlights")}>
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
      <Section title={t("blogInsights.sections.pairs")} comment={t("blogInsights.sections.pairsHint")}>
        <div className={blogStyles.pairs}>
          {pairs.map(({ a, b, count }) => (
            <div key={`${a}+${b}`} className={blogStyles.pair}>
              <span className={blogStyles.pairTag}>{t.tag(a)}</span>
              <span className={blogStyles.pairPlus}>+</span>
              <span className={blogStyles.pairTag}>{t.tag(b)}</span>
              <span className={blogStyles.pairCount}>× {count}</span>
            </div>
          ))}
        </div>
      </Section>
    )}
  </>
  );
};

export async function getStaticProps({ locale }) {
  const t = getT(locale);
  const number = (n) => n.toLocaleString({ en: "en-US", az: "az-AZ", ru: "ru-RU" }[t.locale]);
  const blogs = getBlogs(locale);

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
    { label: t("blogInsights.stats.posts"), value: posts.length },
    { label: t("blogInsights.stats.words"), value: number(totalWords) },
    { label: t("blogInsights.stats.minutes"), value: sum("readTime") },
    { label: t("blogInsights.stats.images"), value: sum("images") },
    { label: t("blogInsights.stats.code"), value: sum("codeLines") },
    { label: t("blogInsights.stats.tags"), value: rankedTags.length },
    { label: t("blogInsights.stats.source"), value: posts.filter((p) => p.source).length },
    { label: t("blogInsights.stats.years"), value: lastYear - firstYear + 1 },
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
    card(t("blogInsights.highlights.first"), oldest, formatDate(oldest.date, locale)),
    card(t("blogInsights.highlights.latest"), newest, formatDate(newest.date, locale)),
    card(t("blogInsights.highlights.longest"), longest, t("blogInsights.wordsMinutes", { words: number(longest.words), minutes: longest.readTime })),
    card(t("blogInsights.highlights.quickest"), shortest, t("blogInsights.wordsMinutes", { words: number(shortest.words), minutes: shortest.readTime })),
    card(t("blogInsights.highlights.visual"), visual, t("blogInsights.images", { count: visual.images })),
    card(t("blogInsights.highlights.tagged"), tagged, tagged.tags.map(t.tag).join(", ")),
    ...(codey.codeLines ? [card(t("blogInsights.highlights.code"), codey, t("blogInsights.codeLines", { count: codey.codeLines }))] : []),
    card(
      t("blogInsights.highlights.break"),
      gap.before,
      t("blogInsights.breakDetail", { months: gap.months, title: gap.after.title })
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
