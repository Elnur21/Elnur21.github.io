import { useState } from "react";
import Image from "next/image";

import styles from "@/styles/InsightsPage.module.css";
import { useT, getT, formatDate } from "@/i18n";


// Same colors GitHub uses for its language dots
const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Shell: "#89e051",
  Vue: "#41b883",
  EJS: "#a91e50",
  Dart: "#00B4AB",
};

const DAY = 24 * 60 * 60 * 1000;


const formatDuration = (days, t) => {
  if (days < 1) return t("insights.duration.sameDay");
  if (days < 60) return t("insights.duration.days", { count: days });
  if (days < 730) return t("insights.duration.months", { n: Math.round(days / 30) });
  return t("insights.duration.years", { n: (days / 365).toFixed(1) });
};

const languageColor = (language) => LANGUAGE_COLORS[language] || "var(--accent-color)";

const Section = ({ title, comment, children }) => (
  <section className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {comment && <span className={styles.comment}>{comment}</span>}
    {children}
  </section>
);

const Profile = ({ user, yearsOnGithub, t }) => (
  <a
    href={user.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.profile}
  >
    <Image
      src={user.avatar_url}
      alt={t("github.avatar", { login: user.login })}
      width={72}
      height={72}
      className={styles.avatar}
    />
    <div className={styles.profileText}>
      <span className={styles.prompt}>
        $ whoami <span className={styles.cursor}>▍</span>
      </span>
      <h2 className={styles.name}>{user.name || user.login}</h2>
      <span className={styles.profileMeta}>
        @{user.login}
        {user.location && ` · ${user.location}`} · {t("insights.onGithub", { years: yearsOnGithub })}
      </span>
    </div>
  </a>
);

const YearChart = ({ years, t }) => {
  const [active, setActive] = useState(null);
  const max = Math.max(...years.map((y) => y.count));

  return (
    <div className={styles.yearChart}>
      {years.map((year) => (
        <div
          key={year.year}
          className={styles.yearColumn}
          onMouseEnter={() => setActive(year.year)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(year.year)}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          {active === year.year && (
            <div className={styles.tooltip}>
              <strong>
                {year.year}: {t("insights.repoCount", { count: year.count })}
              </strong>
              {year.names.slice(0, 6).map((name) => (
                <span key={name}>{name}</span>
              ))}
              {year.names.length > 6 && <span>{t("insights.more", { n: year.names.length - 6 })}</span>}
            </div>
          )}
          <span className={styles.yearValue}>{year.count}</span>
          <div className={styles.yearTrack}>
            <div
              className={`${styles.yearBar} ${active === year.year ? styles.yearBarActive : ""}`}
              style={{ height: `${(year.count / max) * 100}%` }}
            />
          </div>
          <span className={styles.yearLabel}>{year.year}</span>
        </div>
      ))}
    </div>
  );
};

const LanguageBars = ({ languages, total, t }) => (
  <div className={styles.languages}>
    {languages.map(({ language, count }) => (
      <div key={language} className={styles.languageRow} title={`${language}: ${t("insights.repoCount", { count })}`}>
        <span className={styles.languageName}>
          <span className={styles.dot} style={{ background: languageColor(language) }} />
          {language === "Other" ? t("insights.other") : language}
        </span>
        <div className={styles.languageTrack}>
          <div
            className={styles.languageBar}
            style={{
              width: `${(count / languages[0].count) * 100}%`,
              background: languageColor(language),
            }}
          />
        </div>
        <span className={styles.languageValue}>
          {count} · {Math.round((count / total) * 100)}%
        </span>
      </div>
    ))}
  </div>
);

const TopicCloud = ({ topics, t }) => {
  const max = topics[0]?.count || 1;
  return (
    <div className={styles.cloud}>
      {topics.map(({ topic, count }) => (
        <span
          key={topic}
          className={styles.cloudTopic}
          title={t("insights.repoCount", { count })}
          style={{
            fontSize: `${0.75 + (count / max) * 0.75}rem`,
            opacity: 0.55 + (count / max) * 0.45,
          }}
        >
          #{topic}
        </span>
      ))}
    </div>
  );
};

const Highlight = ({ label, repo, detail }) => (
  <a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.highlight}
  >
    <span className={styles.highlightLabel}>{label}</span>
    <span className={styles.highlightName}>{repo.name}</span>
    <span className={styles.highlightDetail}>{detail}</span>
  </a>
);

const GitLog = ({ repos, t }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? repos : repos.slice(0, 8);

  return (
    <div className={styles.gitLog}>
      {visible.map((repo, i) => {
        const yearChanged =
          i === 0 || repos[i - 1].created_at.slice(0, 4) !== repo.created_at.slice(0, 4);
        return (
          <div key={repo.id}>
            {yearChanged && (
              <div className={styles.logYear}>
                <span className={styles.graph}>|</span>
                <span className={styles.tag}>tag: {repo.created_at.slice(0, 4)}</span>
              </div>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logLine}
            >
              <span className={styles.graph}>*</span>
              <span className={styles.hash}>{repo.hash}</span>
              <span className={styles.logDate}>{formatDate(repo.created_at, t.locale, { short: true })}</span>
              {repo.language && (
                <span className={styles.logLanguage}>
                  <span className={styles.dot} style={{ background: languageColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              <span className={styles.logMessage}>
                init <strong>{repo.name}</strong>
                {repo.description && ` — ${repo.description}`}
              </span>
            </a>
          </div>
        );
      })}
      {repos.length > 8 && (
        <button className={styles.more} onClick={() => setShowAll(!showAll)}>
          {showAll ? "$ git log -n 8" : `$ git log --all  ${t("insights.logMore", { n: repos.length - 8 })}`}
        </button>
      )}
    </div>
  );
};

const InsightsPage = ({ user, stats, years, languages, topics, highlights, log, yearsOnGithub }) => {
  const t = useT();
  if (!user) {
    return <p>{t("common.githubUnavailable")}</p>;
  }

  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"# insights.py"}</span>
        <span className={styles.comment}>
          {t("insights.comment")}
        </span>
      </div>

      <Profile user={user} yearsOnGithub={yearsOnGithub} t={t} />

      <div className={styles.stats}>
        {stats.map(({ label, value }) => (
          <div key={label} className={styles.stat}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <Section title={t("insights.sections.perYear")} comment={t("insights.sections.perYearHint")}>
          <YearChart years={years} t={t} />
        </Section>
        <Section title={t("insights.sections.languages")} comment={t("insights.sections.languagesHint")}>
          <LanguageBars languages={languages} total={log.length} t={t} />
        </Section>
      </div>

      <Section title={t("insights.sections.highlights")}>
        <div className={styles.highlights}>
          {highlights.map((h) => (
            <Highlight key={h.label} {...h} />
          ))}
        </div>
      </Section>

      {topics.length > 0 && (
        <Section title={t("insights.sections.topics")} comment={t("insights.sections.topicsHint")}>
          <TopicCloud topics={topics} t={t} />
        </Section>
      )}

      <Section title={t("insights.sections.timeline")} comment="# git log --graph --reverse-chronological">
        <GitLog repos={log} t={t} />
      </Section>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const t = getT(locale);
  const empty = {
    props: { title: "Insights", user: null },
    revalidate: 30,
  };

  try {
    const headers = { Authorization: `token ${process.env.GITHUB_API_KEY}` };
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) throw new Error(`GitHub user API error: ${userRes.status}`);
    if (!repoRes.ok) throw new Error(`GitHub repos API error: ${repoRes.status}`);

    const rawUser = await userRes.json();
    const repos = await repoRes.json();
    if (!Array.isArray(repos) || repos.length === 0) throw new Error("Invalid repos response");

    const now = Date.now();
    const age = (from, to = now) => Math.max(0, Math.round((new Date(to) - new Date(from)) / DAY));

    const user = {
      login: rawUser.login,
      name: rawUser.name,
      avatar_url: rawUser.avatar_url,
      html_url: rawUser.html_url,
      location: rawUser.location,
    };
    const yearsOnGithub = (age(rawUser.created_at) / 365).toFixed(1);

    // Headline numbers
    const sum = (key) => repos.reduce((total, repo) => total + (repo[key] || 0), 0);
    const recentlyActive = repos.filter((repo) => age(repo.pushed_at) <= 90).length;
    const stats = [
      { label: t("insights.stats.repos"), value: rawUser.public_repos },
      { label: t("insights.stats.stars"), value: sum("stargazers_count") },
      { label: t("insights.stats.forks"), value: sum("forks_count") },
      { label: t("insights.stats.followers"), value: rawUser.followers },
      { label: t("insights.stats.demos"), value: repos.filter((repo) => repo.homepage).length },
      { label: t("insights.stats.active"), value: recentlyActive },
    ];

    // Repos created per year, with no gaps between the first and last year
    const byYear = {};
    repos.forEach((repo) => {
      const year = new Date(repo.created_at).getUTCFullYear();
      (byYear[year] = byYear[year] || []).push(repo.name);
    });
    const yearKeys = Object.keys(byYear).map(Number);
    const years = [];
    for (let y = Math.min(...yearKeys); y <= Math.max(...yearKeys); y++) {
      years.push({ year: y, count: byYear[y]?.length || 0, names: byYear[y] || [] });
    }

    // Primary language counts, small ones folded into "Other"
    const languageCounts = {};
    repos.forEach(({ language }) => {
      const key = language || "Other";
      languageCounts[key] = (languageCounts[key] || 0) + 1;
    });
    const named = Object.entries(languageCounts)
      .filter(([language]) => language !== "Other")
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
    const otherCount =
      (languageCounts.Other || 0) + named.slice(7).reduce((total, l) => total + l.count, 0);
    const languages = [
      ...named.slice(0, 7),
      ...(otherCount ? [{ language: "Other", count: otherCount }] : []),
    ];

    // Topic frequency
    const topicCounts = {};
    repos.forEach((repo) =>
      (repo.topics || []).forEach((topic) => (topicCounts[topic] = (topicCounts[topic] || 0) + 1))
    );
    const topics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic))
      .slice(0, 40);

    // Highlights
    const pick = (score) => repos.reduce((best, repo) => (score(repo) > score(best) ? repo : best));
    const slim = ({ name, html_url }) => ({ name, html_url });
    const oldest = pick((r) => -new Date(r.created_at));
    const newest = pick((r) => +new Date(r.created_at));
    const latestPush = pick((r) => +new Date(r.pushed_at));
    const starred = pick((r) => r.stargazers_count * 1000 + r.forks_count * 100 + r.watchers_count);
    const biggest = pick((r) => r.size);
    const longest = pick((r) => new Date(r.pushed_at) - new Date(r.created_at));
    const tagged = pick((r) => (r.topics || []).length);

    const highlights = [
      { label: t("insights.highlights.first"), repo: slim(oldest), detail: formatDate(oldest.created_at, locale) },
      { label: t("insights.highlights.newest"), repo: slim(newest), detail: formatDate(newest.created_at, locale) },
      { label: t("insights.highlights.lastPush"), repo: slim(latestPush), detail: formatDate(latestPush.pushed_at, locale) },
      {
        label: t("insights.highlights.popular"),
        repo: slim(starred),
        detail: t("insights.starsForks", { stars: starred.stargazers_count, forks: starred.forks_count }),
      },
      {
        label: t("insights.highlights.longest"),
        repo: slim(longest),
        detail: formatDuration(age(longest.created_at, longest.pushed_at), t),
      },
      {
        label: t("insights.highlights.largest"),
        repo: slim(biggest),
        detail: `${(biggest.size / 1024).toFixed(1)} MB`,
      },
      {
        label: t("insights.highlights.tagged"),
        repo: slim(tagged),
        detail: t("insights.topicCount", { count: (tagged.topics || []).length }),
      },
    ];

    // Timeline, newest first, with a short commit-like hash per repo
    const log = [...repos]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((repo) => ({
        id: repo.id,
        hash: repo.id.toString(16).slice(-7).padStart(7, "0"),
        name: repo.name,
        description: repo.description,
        language: repo.language,
        html_url: repo.html_url,
        created_at: repo.created_at,
      }));

    return {
      props: {
        title: "Insights",
        user,
        stats,
        years,
        languages,
        topics,
        highlights,
        log,
        yearsOnGithub,
      },
      revalidate: 30,
    };
  } catch {
    return empty;
  }
}

export default InsightsPage;
